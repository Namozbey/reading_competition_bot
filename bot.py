from telebot import TeleBot
from telebot.types import Message
from config import TOKEN, ADMINS, GROUP_ID
from bot import *
from database import book_handler

bot = TeleBot(TOKEN)

def handle_admin_command(bot:TeleBot , message: Message):
    if message.text.startswith("/add_book "):
        book_name = message.text[len("/add_book "):]
        book_handler.add_book(book_name)
        bot.reply_to(message, "Added successfully")
        return 
    if message.text == "/list":
        books = book_handler.get_all_book()
        bot.reply_to(message, "\n".join(books))
        return 
    if message.text.startswith("/delete "):
        book_name = message.text[len("/delete "):]
        book_handler.delete_book(book_name)
        return
    
    if message.text == '/status':
        bot.send_message(GROUP_ID, book_handler.get_status())
        return

    
    bot.reply_to(message, "Unknown command")

def handle_user_command(bot, message):
    try:
        if message.text.startswith("/set_page "):
            book, page = message.text[len("/set_page "):].split(" ")
            book_handler.set_user_page(book, message.from_user.username, page)
            bot.reply_to(message, "success")
            return
    except Exception as e:
        print(e, message)
        bot.reply_to(message, "Something went wrong")
    bot.reply_to(message, "Unknown command")


@bot.message_handler()
def handle_text(message: Message):
    if message.from_user.id in ADMINS:
        handle_admin_command(bot, message)
    else:
        handle_user_command(bot, message)