import { model, Schema } from "mongoose";
import { IUser, SYS_GENDER, SYS_ROLE, SYS_PROVIDER } from "../../../common";

const schema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 20,
    },
    email: { type: String, required: true },
    password: {
      type: String,
      required: function () {
        if (this.provider == SYS_PROVIDER.google) {
          return false;
        }
        return true;
      },
    },
    role: {
      type: Number,
      default: SYS_ROLE.user,
    },
    provider: {
      type: Number,
      default: SYS_PROVIDER.system,
    },
    gender: {
      type: Number,
      default: SYS_GENDER.male,
    },
    phoneNumber: String,
    profilePic: { type: String },
  },
  { timestamps: true },
);

export const User = model<IUser>("User", schema);
