import * as mongoose from "mongoose";
import { IUser, ITask } from "../models/types";

export class Database {
  db: mongoose.Connection;
  UserModel: mongoose.Model<IUser>;
  TaskModel: mongoose.Model<ITask>;


  constructor() {
    mongoose.connect('mongodb://localhost/tosk');
    this.db = mongoose.connection;

    this.db.on('error', console.error.bind(console, 'connection error:'));
    this.db.once('open', function() {
      console.log("Connection established!");
    });

    let taskSchema = new mongoose.Schema({
      taskHeader: String,
      createdAt: {
        type: Date,
        default: new Date()
      },
      dueAt: Date,
    });
    this.TaskModel = mongoose.model("task", taskSchema);

    let userSchema = new mongoose.Schema({
      username: String,
      password: String,
      tasks: [taskSchema],
    }).pre<IUser>("save", function(next: mongoose.HookNextFunction) {
      for (let task of this.tasks) {
        if (!task.createdAt)
          task.createdAt = new Date();
      }
      next(); // <-- Idk what this does
    });
    this.UserModel = mongoose.model("user", userSchema);
  }

  public async addUser(user: IUser): Promise<boolean> {
    let newUser = new this.UserModel(user);
    let success = await newUser.save((err, obj) => {
      if (err) console.error("Failed to save user " + user.username);
    });
    return (success != undefined);
  }

  public async addTask(username: string, task: ITask): Promise<IUser> {
    let user = await this.UserModel.findOneAndUpdate({username: username}, {$push: {tasks: task}});
    return user;
  }

  public async getUser(username: string) {
    let user = await this.UserModel.findOne({ username: username });
    return user;
  }

  public async getAllUsers(): Promise<IUser[]> {
    let allUsers: IUser[] = await this.UserModel.find();
    return allUsers;
  }


}











// const kittySchema = new mongoose.Schema({
//   name: String
// });



// const Kitten = mongoose.model("kitten", kittySchema);
// let mango = new Kitten({ name: "Mango" });
// console.log(mango);
// // mango.save((err, obj) => {
// //   if (err) console.log("Couldnt save");
// //   else console.log("save success");
// // });

// Kitten.find((err, kittens) => {
//   console.log(kittens);
// })