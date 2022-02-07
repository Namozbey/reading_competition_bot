const os = require("os");
const chalk = require("chalk");
const express = require("express");
const mongoose = require("mongoose");
const { Telegraf } = require("telegraf");

require("dotenv").config();

const {
  bot_token,
  owner,
  group_id,
  db_base_url,
  version,
  prefix,
  PORT = 5001,
} = process.env;

const { start, help } = require("./lib/help");
const { getUser } = require("./lib/tele");
const {
  getAllBooks,
  addBook,
  deleteBook,
  selectBook,
  setPage,
  getStatistics,
} = require("./lib/book_handler");

const app = express();
// const port = PORT || 5001;

const errorText = "Something went wrong 😐";

if (!bot_token) {
  return console.log("=== BOT TOKEN CANNOT BE EMPTY ===");
}

mongoose.connect(db_base_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const bot = new Telegraf(bot_token);
const { telegram } = bot;

bot.command("start", async (ctx) => {
  user = await getUser(ctx.message.from);
  console.log("user===>", user);
  await start(ctx, user.full_name);
  // await ctx.deleteMessage()
});

bot.command("help", async (ctx) => {
  //   console.log(ctx.message);
  user = await getUser(ctx.message.from);
  await help(ctx, user);
});

bot.command("list", (ctx) => {
  getAllBooks(ctx)
    .then((res) => ctx.reply(res))
    .catch((err) => {
      ctx.reply(errorText);
      console.log(err);
    });
});

bot.command("select", async (ctx) => {
  const name = ctx.message.text.replace("/select", "").trim();
  if (!name) {
    ctx.reply("Please, enter the book name");
    return;
  }

  selectBook(ctx, name)
    .then((res) => ctx.reply(res))
    .catch((err) => {
      ctx.reply(errorText);
      console.log(err);
    });
});

bot.command("setpage", async (ctx) => {
  const page = ctx.message.text.replace("/setpage", "").trim();
  if (!page) {
    ctx.reply("Please, enter the book page");
    return;
  }

  setPage(ctx, page)
    .then((res) => ctx.reply(res))
    .catch((err) => {
      ctx.reply(errorText);
      console.log(err);
    });
});

bot.command("statistics", async (ctx) => {
  getStatistics(ctx, undefined, true).catch((err) => {
    console.log(err);
    ctx.reply(errorText);
  });
});

// ********* ADMIN *********
bot.command("add", async (ctx) => {
  user = await getUser(ctx.message.from);
  if (user.type !== "admin") {
    ctx.reply("Only admins can add books");
    return;
  }

  const name = ctx.message.text.replace("/add", "").trim();
  if (!name) {
    ctx.reply("Please, enter the book name");
    return;
  }

  addBook(name)
    .then((res) => ctx.reply("succesfully added"))
    .catch((err) => {
      console.log(err);
      ctx.reply(errorText);
    });
});

bot.command("delete", async (ctx) => {
  user = await getUser(ctx.message.from);
  if (user.type !== "admin") {
    ctx.reply("Only admins can delete books");
    return;
  }

  const name = ctx.message.text.replace("/delete", "").trim();
  if (!name) {
    ctx.reply("Please, enter the book name");
    return;
  }

  deleteBook(name)
    .then((res) => ctx.reply("succesfully deleted"))
    .catch((err) => {
      console.log(err);
      ctx.reply(errorText);
    });
});

bot.command("sendstats", async (ctx) => {
  user = await getUser(ctx.message.from);
  if (user.type !== "admin") {
    ctx.reply("Only admins can sand statistics to the group");
    return;
  }

  const name = ctx.message.text.replace("/sendstats", "").trim();

  getStatistics(ctx, name, true, true).catch((err) => {
    console.log(err);
    ctx.reply(errorText);
  });
});

bot.command("auto", async (ctx) => {
  user = await getUser(ctx.message.from);
  if (user.type !== "admin") {
    ctx.reply("Only admins can change auto send");
    return;
  }
});

bot.command("send", async (ctx) => {
  user = await getUser(ctx.message.from);
  if (user.type !== "admin") {
    ctx.reply("Only admins can sand messages");
    return;
  }

  const message = ctx.message.text.replace("/send", "").trim();
  if (!message) {
    ctx.reply("Please, enter the book name");
    return;
  }

  telegram.sendMessage(group_id, message);
});

// bot.on("message", async (ctx) => {
//   console.log("message", ctx);
//   telegram.sendMessage(group_id, ctx.update.message.text);
// });

bot.launch();
telegram.getMe().then((getme) => {
  itsPrefix = prefix != "" ? prefix : "No Prefix";
  //   console.log(
  //     chalk.greenBright(" ====================================================")
  //   );
  //   console.log(chalk.greenBright(" │ + Owner    : " + owner || ""));
  //   console.log(chalk.greenBright(" │ + Bot Name : " + getme.first_name || ""));
  //   console.log(chalk.greenBright(" │ + Version  : " + version || ""));
  //   console.log(chalk.greenBright(" │ + Host     : " + os.hostname() || ""));
  //   console.log(chalk.greenBright(" │ + Platfrom : " + os.platform() || ""));
  //   console.log(chalk.greenBright(" │ + Prefix   : " + itsPrefix));
  //   console.log(
  //     chalk.greenBright(" ====================================================")
  //   );
  console.log(chalk.whiteBright("╭─── [ LOG ]"));
});
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
