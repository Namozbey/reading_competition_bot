const { Telegraf } = require("telegraf");
const { bot_token } = process.env;
let User = require("../models/user.model");

const bots = new Telegraf(bot_token);

exports.getArgs = async (ctx) => {
  try {
    args = ctx.message.text;
    args = args.split(" ");
    args.shift();
    return args;
  } catch {
    return [];
  }
};

const getFullName = (elm) =>
  `${elm.first_name ?? ""} ${elm.last_name ?? ""}`.trim();

exports.getUser = (ctx) => {
  const { id, first_name, last_name, username } = ctx;
  return new Promise((resolve, reject) => {
    User.findOne({ id })
      .then((res) => {
        if (res) resolve({ ...res._doc, full_name: getFullName(ctx) });
        else {
          const newUser = new User({
            id,
            first_name,
            last_name,
            username,
          });

          newUser.save().then((res) => {
            // console.log("res ===>", res);
            resolve({ ...res._doc, full_name: getFullName(ctx) });
          });
        }
      })
      .catch((err) => {
        console.log("error: ", err);
        reject(err);
      });
  });
};

// exports.getUser = async (ctx) => {
//   try {
//     const user = await User.findById(ctx.id);
//     user = ctx;
//     last_name = user["last_name"] || "";
//     full_name = user.first_name + " " + last_name;
//     user["full_name"] = full_name.trim();
//     return user;
//   } catch (e) {
//     throw e;
//   }
// };

exports.getBot = async (ctx) => {
  try {
    bot = ctx.botInfo;
    last_name = bot["last_name"] || "";
    full_name = bot.first_name + " " + last_name;
    bot["full_name"] = full_name.trim();
    return bot;
  } catch {
    return {};
  }
};

exports.getLink = async (file_id) => {
  try {
    return (await bots.telegram.getFileLink(file_id)).href;
  } catch {
    throw "Error while get url";
  }
};

exports.getPhotoProfile = async (id) => {
  try {
    url_default =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    if (String(id).startsWith("-100")) {
      var pp = await bots.telegram.getChat(id);
      if (!pp.hasOwnProperty("photo")) return url_default;
      file_id = pp.photo.big_file_id;
    } else {
      var pp = await bots.telegram.getUserProfilePhotos(id);
      if (pp.total_count == 0) return url_default;
      file_id = pp.photos[0][2].file_id;
    }
    return await this.getLink(file_id);
  } catch (e) {
    throw e;
  }
};
