import { Types } from "mongoose";

export interface IPost {
  userId: Types.ObjectId;
  content?: string;
  attatchments?: string[]; // arr of urls
  reactionsCount: number; // calculated failed >> drived >> user reacations >> length
  sharescount: number;
  commentsCount: number;
}
