import * as mongoose from "mongoose";

export interface ITask extends mongoose.Document {
  taskHeader: string;
  createdAt?: Date;
  dueAt: Date;
}

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  tasks: ITask[];
}