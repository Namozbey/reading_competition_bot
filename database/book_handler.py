import sqlite3

conn = sqlite3.connect("db.sqlite3")
conn.execute("CREATE TABLE IF NOT EXISTS books(id integer primary key autoincrement, name varchar)")
conn.execute("CREATE TABLE IF NOT EXISTS pages(id integer primary key autoincrement, book varchar, user varchar, page integer)")


def get_all_book():
    conn = sqlite3.connect("db.sqlite3")
    cur = conn.cursor()
    cur = cur.execute('SELECT name from books')
    books = cur.fetchall()
    print(books)
    cur.close()
    return [i[0] for i in books]

def add_book(name:str):
    conn = sqlite3.connect("db.sqlite3")
    cur = conn.cursor()
    cur.execute('INSERT into books(name) values (?)', (name,))
    cur.close()
    conn.commit()

def delete_book(name:str):
    conn = sqlite3.connect("db.sqlite3")
    cur = conn.cursor()
    cur.execute('DELETE FROM books where name = ?', (name,))
    cur.close()
    conn.commit()

def set_user_page(book, user, page):
    conn = sqlite3.connect("db.sqlite3")
    cur = conn.cursor()
    cur.execute('DELETE FROM pages where user=? and book= ?', (user, book))
    cur.execute('insert into pages(user, book, page) values(?,?, ?)', (user, book, page))
    cur.close()
    conn.commit()

def get_status():
    conn = sqlite3.connect("db.sqlite3")
    cur = conn.cursor()
    cur.execute('select book, user, page from pages order by book, page')
    status = cur.fetchall()
    print(status)
    cur.close()
    conn.commit()
    return status