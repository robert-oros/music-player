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
    user=os.getenv("MYSQL_USER", "root"),
    password=os.getenv("MYSQL_PASSWORD", "pass"),
    database=os.getenv("MYSQL_DATABASE", "mydb"),
    port=os.getenv("MYSQL_PORT", "3306"),
  )

@app.route("/audio/js/<path:path>")
def send_js(path):
  return send_from_directory("js", path)

@app.route("/audio/css/<path:path>")
def send_css(path):
  return send_from_directory("css", path)

@app.route("/audio/songs/<path:path>")
def send_audio(path):
  return send_from_directory("songs", path)

@app.route("/audio/", methods=["GET"])
def home():
  try:
    connection = create_connection()
    with connection.cursor() as cursor:
      cursor.execute('SELECT * FROM mp3player')
      rows = cursor.fetchall()
  except Exception as e:
    return Response(f"Error fetching data: {str(e)}", status=500)
  finally:
    connection.close()

  return render_template("index.html", rows=rows)
  
@app.route("/audio/add", methods=["GET", "POST"])
def add():
  if request.method == "POST":
    title = request.form.get("title")
    autor = request.form.get("autor")
    file = request.files.get("file")

    if not title or not autor or not file:
      return Response("Missing title, autor, or file", status=400)

    try:
      file_path = save_file(file)
      insert_song(title, autor, file_path)
    except Exception as e:
      return Response(f"Error adding song: {str(e)}", status=500)

    return redirect("/audio/")

  return render_template("add.html")

def save_file(file):
  file_name = uuid.uuid4()
  _, file_extension = os.path.splitext(file.filename)
  full_name = os.path.join("songs", f"{file_name}{file_extension}")
  file.save(full_name)
  return full_name

def insert_song(title, autor, file_path):
  connection = create_connection()
  try:
    with connection.cursor() as cursor:
      cursor.execute("INSERT INTO mp3player (title, autor, audio_path) VALUES (%s, %s, %s)",(title, autor, file_path))
    connection.commit()
  finally:
    connection.close()

@app.route("/audio/delete", methods=["DELETE"])
def delete():
  id = request.args.get("id")
  if not id:
    return Response("Missing 'id' parameter", status=400, mimetype='application/json')

  connection = create_connection()
  cursor = connection.cursor()
  try:
    cursor.execute("DELETE FROM mp3player WHERE ID = %s", (id,))
    connection.commit()
  except Exception as e:
    connection.rollback()
    return Response(f"Error deleting record: {str(e)}", status=500, mimetype='application/json')
  finally:
    cursor.close()
    connection.close()
  
  return Response("Record deleted successfully", status=200, mimetype='application/json')

@app.route("/audio/edit", methods=['GET','POST'])
def edit():
  if request.method == "POST":
    title = request.form.get("title")
    autor = request.form.get("autor")
    file = request.form.get("file")
    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute(f'''UPDATE mp3player SET title="{title}", autor="{autor}", audio_path="{file}"''')
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