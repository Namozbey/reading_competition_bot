import sqlite3

conn = sqlite3.connect("db.sqlite3")
conn.execute("CREATE TABLE IF NOT EXISTS books(id integer primary key auto_increment, name varchar)")
conn.execute("CREATE TABLE IF NOT EXISTS pages(id integer primary key auto_increment, book varchar, user varchar, page integer)")


def get_all_book():
    cur = conn.cursor()
    cur = cur.execute('SELECT name from books')
    books = cur.fetchall()
    cur.close()
    return [i[0] for i in books]

def add_book(name:str):
    cur = conn.cursor()
    cur.execute('INSERT into books(name) values (?)', (name))
    cur.close()

def delete_book(name:str):
    cur = conn.cursor()
    cur.execute('DELETE FROM books where name = ?', (name))

def set_user_page(book, user, page):
    cur = conn.cursor()
    cur.execute('DELETE FROM pages where user=? and book= ?', (user, book))
    cur.execute('insert into pages(user, book, page) values(?,?, ?)', (user, book, page))
    cur.close()

def get_status():
    cur = conn.cursor()
    cur.execute('select book, user, page from pages order by book, page')
    status = cur.fetchall()
    cur.close()
    return status