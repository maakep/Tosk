import * as express from "express";
import * as http from "http";
import * as path from "path";
import * as bodyParser from "body-parser";
import { Database } from "./datalayer";

import * as Types from "../models/types";

const port = 3000;

const app = express();
const server = http.createServer(app);
const db = new Database();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../index.html"));
});

app.get("/user/:id", (req, res) => {
  db.getAllUsers().then((r) => {
    res.json(r);
  })
});

app.post("/user/:id", (req, res) => {
  let user: Types.IUser = req.body;
  db.addUser(user).then((r) => {
    res.json({ success: r });
  });
});

app.post("/task/:id", async (req, res) => {
  let task: Types.ITask = req.body;
  let username = req.params.id;
  db.addTask(username, task).then((r) => {
    res.json(r);
  });
});

server.listen(port, () => {
    console.log("listening on *:" + port);
});
