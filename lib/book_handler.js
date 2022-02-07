const { Telegraf } = require("telegraf");
let Book = require("../models/books.model");
let User = require("../models/user.model");
const { getUser } = require("./tele");

const { bot_token, group_id } = process.env;

const { telegram } = new Telegraf(bot_token);

function getAllBooks(ctx) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await getUser(ctx.message.from);
      const books = await Book.find({});

      resolve(
        books
          .map((elm) =>
            elm.name === user.selected_book ? "> " + elm.name : elm.name
          )
          .join("\n")
      );
    } catch (err) {
      reject(err);
    }
  });
}

function addBook(name) {
  return new Promise((resolve, reject) => {
    const newBook = new Book({ name });
    newBook
      .save()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

function deleteBook(name) {
  return new Promise((resolve, reject) => {
    Book.deleteOne({ name })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

function setPage(ctx, page = 0) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await getUser(ctx.message.from);
      if (!user.selected_book) {
        resolve("Please, select a book first");
        return;
      }
      // console.log(selectBook);
      // console.log(user);
      const updatedBook = await Book.updateOne(
        { name: user.selected_book, "readers.id": user.id },
        { $set: { "readers.$.page": page } }
      );

      if (!updatedBook.nModified) {
        await Book.updateOne(
          { name: user.selected_book },
          {
            $push: {
              readers: {
                name: user.full_name,
                id: user.id,
                page,
              },
            },
          }
        );
      }

      resolve("succesfully updated");

      getStatistics(ctx, user.selected_book, true, true);
    } catch (err) {
      reject(err);
    }
  });
}

function selectBook(ctx, name) {
  return new Promise(async (resolve, reject) => {
    try {
      const foundBook = await Book.findOne({ name });
      if (!foundBook) {
        resolve(
          "Please, select existing book \nRun /list to show the list of books"
        );
        return;
      }
      const user = await getUser(ctx.message.from);
      const res = await User.updateOne(
        { id: user.id },
        { $set: { selected_book: name } }
      );
      const result = Book.updateOne();

      resolve(`${name} has been selected`);
    } catch (err) {
      reject(err);
    }
  });
}

function getStatistics(ctx, name, isReply, isSendToGroup) {
  const defineSymbol = (index) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return "";
    }
  };
  const formatData = (data, i) =>
    `${data.name} - ${data.page} ${defineSymbol(i)}`;
  let result = {};
  return new Promise((resolve, reject) => {
    Book.find(name ? { name } : {})
      .then((res) => {
        if (!res && !res.length) {
          resolve("The book is not found");
          return;
        }

        res.forEach((elm) => {
          const sortedElm = elm.readers.sort((fir, sec) => sec.page - fir.page);
          result[elm.name] =
            elm.name +
            "\n\n" +
            sortedElm
              .map((el, i) => `${i + 1}. ${formatData(el, i)}`)
              .join("\n");
        });

        resolve(result);

        if (isReply) {
          for (let key in result) {
            ctx.reply(result[key]);
          }
        }

        if (isSendToGroup) {
          for (let key in result) {
            telegram.sendMessage(group_id, result[key]);
          }
        }
      })
      .catch((err) => reject(err));
  });
}

function addAdmin(id) {}

module.exports = {
  getAllBooks,
  addBook,
  deleteBook,
  setPage,
  getStatistics,
  addAdmin,
  selectBook,
};
