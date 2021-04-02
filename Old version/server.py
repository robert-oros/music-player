from flask import Flask, render_template, Response
from flask import request, redirect, send_from_directory
import sqlite3
import uuid
import os


app = Flask(__name__)


def create_connection():
  return sqlite3.connect('database.db')

@app.route("/audio/js/<path:path>")
def send_js(path):
  return send_from_directory("js", path)

@app.route("/audio/css/<path:path>")
def send_css(path):
  return send_from_directory("css", path)

@app.route("/audio/", methods=["GET"])
def home():
  cursor = create_connection().cursor()
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
  
    db = create_connection()
    db.execute(f'''INSERT INTO mp3player(title, autor, filemp3)
    VALUES("{title}", "{autor}", "{full_name}")''')
    db.commit()
    db.close()
    return redirect("/audio/")
  return render_template("add.html")

@app.route("/audio/delete", methods=["GET","DELETE"])
def delete():
  id = request.args.get("id")
  db = create_connection()
  db.execute("DELETE FROM mp3player WHERE ID = ? ", id)
  db.commit()
  db.close()
  return Response(mimetype='application/json')

@app.route("/audio/edit", methods=['GET','POST'])
def edit():
  if request.method == "POST":
    title = request.form.get("title")
    autor = request.form.get("autor")
    file = request.form.get("file")
    db = create_connection()
    db.execute(f'''UPDATE mp3player SET title="{title}", autor="{autor}", filemp3="{file}"''')
    db.commit()
    db.close()
    return redirect("/audio/")
  id = request.args.get("id")
  db = create_connection()
  cursor = db.cursor()
  cursor = db.execute("SELECT * FROM mp3player WHERE ID=?", id)
  row = cursor.fetchall()
  db.close()
  return render_template("edit.html", row=row[0])


app.run(port=8000, debug=True)