/**
 * This module defines the User model using Mongoose.
 * It has fields such as fullName, username, email, password, roles, and profilePicture.
 * The password is encrypted using the SECRET from the env.ts file.
 * The model has pre and post hooks for save and updateOne operations.
 * It also overrides the toJSON method to remove the password field from the returned JSON object.
 */

import mongoose from "mongoose";
import { encrypt } from "@/utils/encryption";
import { SECRET } from "@/utils/env";
import mail from "@/utils/mail";

const Schema = mongoose.Schema;

/**
 * The User schema defines the structure of the User document.
 */
const UsersSchema = new Schema(
  /**
   * The User document has the following fields:
   * @property {String} fullName - The full name of the user.
   * @property {String} username - The username of the user.
   * @property {String} email - The email of the user.
   * @property {String} password - The password of the user.
   * @property {String[]} roles - The roles of the user.
   * @property {String} profilePicture - The profile picture of the user.
   */
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: [
      {
        type: String,
        default: "user",
      },
    ],
    profilePicture: {
      type: String,
      default: "default.jpg",
    },
  },
  {
    /**
     * The User schema has the following options:
     * @property {Boolean} timestamps - Whether to include timestamps for createdAt and updatedAt fields.
     */
    timestamps: true,
  }
);

/**
 * This function is executed before the User document is saved.
 * It encrypts the password field using the SECRET from the env.ts file.
 * @param {Function} next - The next middleware function.
 */
UsersSchema.pre("save", async function (next) {
  const user = this;
  user.password = encrypt(SECRET, user.password);
  next();
});

/**
 * This function is executed after the User document is saved.
 * It sends an email to the user with a registration successful message.
 * @param {Object} doc - The saved User document.
 * @param {Function} next - The next middleware function.
 */
UsersSchema.post("save", async function(doc, next) {
  const user = doc;
  console.log("Send Email to", user.email);

  const content = await mail.render('register-success.ejs', {
    username: user.username
  });

  await mail.send(user.email, 'Registration Successful', content);
  next();
});

/**
 * This function is executed before the User document is updated.
 * It encrypts the password field using the SECRET from the env.ts file.
 * @param {Function} next - The next middleware function.
 */
UsersSchema.pre("updateOne", async function (next) {
  const user = (this as unknown as { _update: any })._update;
  user.password = encrypt(SECRET, user.password);
  next();
});

/**
 * This method overrides the toJSON method of the Mongoose document.
 * It removes the password field from the returned JSON object.
 * @returns {Object} The JSON representation of the User document.
 */
UsersSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

/**
 * The UsersModel is the Mongoose model for the User schema.
 */
const UsersModel = mongoose.model("User", UsersSchema);

export default UsersModel;

