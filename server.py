from flask import Flask, render_template, Response
from flask import request, redirect, send_from_directory
import mysql.connector
import sqlite3
import uuid
import os


app = Flask(__name__)


def create_connection():
  return mysql.connector.connect(
    host=os.getenv("MYSQL_HOST", "localhost"),
    user=os.getenv("MYSQL_USER", "player"),
    password=os.getenv("MYSQL_PASSWORD", "pass"),
    database=os.getenv("MYSQL_DATABASE", "database"),
    port=os.getenv("MYSQL_PORT", "3306"),
  )

@app.route("/audio/js/<path:path>")
def send_js(path):
  return send_from_directory("js", path)

@app.route("/audio/css/<path:path>")
def send_css(path):
  return send_from_directory("css", path)

@app.route("/audio/", methods=["GET"])
def home():
  connection = create_connection()
  cursor = connection.cursor()
  cursor.execute('''SELECT * FROM mp3player''')
  rows = cursor.fetchall()
  cursor.close()
  return render_template("index.html",rows=rows)

@app.route("/audio/add", methods=["GET","POST"])
def add():
  if request.method == "POST":
    title = request.form.get("title")
    autor = request.form.get("autor")
    file = request.files["file"]

    file_name = uuid.uuid4()
    filename, file_extension = os.path.splitext(file.filename)
    full_name = "songs/" + str(file_name) + file_extension
    file.save(full_name)
  
    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute(f'''INSERT INTO mp3player(title, autor, filemp3)
    VALUES("{title}", "{autor}", "{full_name}")''')
    connection.commit()
    cursor.close()
    connection.close()
    return redirect("/audio/")
  return render_template("add.html")

@app.route("/audio/delete", methods=["GET","DELETE"])
def delete():
  id = request.args.get("id")
  connection = create_connection()
  cursor = connection.cursor()
  cursor.execute("DELETE FROM mp3player WHERE ID = ? ", (id,))
  connection.commit()
  cursor.close()
  connection.close()
  return Response(mimetype='application/json')

@app.route("/audio/edit", methods=['GET','POST'])
def edit():
  if request.method == "POST":
    title = request.form.get("title")
    autor = request.form.get("autor")
    file = request.form.get("file")
    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute(f'''UPDATE mp3player SET title="{title}", autor="{autor}", filemp3="{file}"''')
    connection.commit()
    cursor.close()
    connection.close()
    return redirect("/audio/")
  id = request.args.get("id")
  connection = create_connection()
  cursor = connection.cursor()
  cursor.execute("SELECT * FROM mp3player WHERE ID=?", (id,))
  row = cursor.fetchone()
  cursor.close()
  connection.close()
  return render_template("edit.html", row=row)


app.run(port=8000, debug=True)