const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

//serve frontend files
app.use(express.static("public"));

//create database
const db = new sqlite3.Database("database.db");

//create tasks table
db.run(`CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, 
    text TEXT NOT NULL, 
    completed INTEGER DEFAULT 0)`);

//get all tasks
app.get("/tasks", (req, res) => {
    db.all("SELECT * FROM tasks", [], (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(rows);
        }
    });
});

//add a task
app.post("/tasks", (req, res) => {
    const { text } = req.body;

    db.run(
        "INSERT INTO tasks(text) VALUES(?)", [text], 
        function(err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json({
                    id: this.lastID, 
                    text: text, 
                    completed: false 
                });
            }
        }
    );
});

//update task completion
app.put("/tasks/:id", (req, res) => {
    const { text, completed } = req.body;

    db.run(
        "UPDATE tasks SET text=?, completed=? WHERE id=?",
        [text, completed, req.params.id], 
        function(err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.sendStatus(200);
            }
        }
    );
});

//delete tasks
app.delete("/tasks/:id", (req, res) => {
    db.run("DELETE FROM tasks WHERE id=?",
        [req.params.id],
        function(err) {
            if (err) {
                res.status(500).send(err);

            } else {
                res.sendStatus(200);
            }
        }
    );
});

//start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
