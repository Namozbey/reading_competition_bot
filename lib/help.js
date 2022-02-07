const { owner, ownerLink } = process.env;

exports.start = async (elm, name) => {
  text = `Hello ${name}! I'm a bot that makes reading statistics 🙂`;
  text2 = "Need a help? just type /help command";
  await elm.replyWithMarkdown(text, { disable_web_page_preview: true });
  await elm.replyWithMarkdown(text2, { disable_web_page_preview: true });
};

exports.help = async (elm, user) => {
  text = `Here are the available commands you can use:

/list - Books lists

/select <book name> - To select a book

/statistics - To see others which page are on

/setpage <page number> - To set your current page (example: /setpage 45)
`;

  textAdmin = `
/add <book name> - To add a new book

/delete <book name> - To delete an existing book

/sendstats - To send last statistics to the group

/send <message> - send message to the group`;

  try {
    if (user.type === "admin") {
      await elm.replyWithMarkdown(text + textAdmin, {
        disable_web_page_preview: true,
      });
    } else {
      await elm.replyWithMarkdown(text, { disable_web_page_preview: true });
    }
  } catch {
    await elm.reply("Something went wrong 😐");
  }
};

exports.messageError = async (elm) => {
  await elm.reply(
    `Error! Please report to the [${owner}](${ownerLink}) about this`,
    { parse_mode: "Markdown", disable_web_page_preview: true }
  );
};
