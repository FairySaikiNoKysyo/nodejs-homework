import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, preUpdate } from "./hooks.js";

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const subscriptionValue = ["starter", "pro", "business"];

const userSchema = new Schema({
    email: {
        type: String,
        match: emailRegex,
        reguired: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    avatarURL:{ 
        type: String,
    },
    subscription:{
        type: String,
        enum: subscriptionValue,
        default: "starter",
    },
    token:{
        type: String,
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken:{
        type: String,
        required: [true, 'Verify token is required'],
    }
},{versionKey: false}
);

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", preUpdate);
userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignupSchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().required(),
    subscription: Joi.string(),    
});

export const userEmailSchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
});

export const userSigninSchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().required(),
});

export const usersUpdateSubscribeSchema = Joi.object({
    subscription: Joi.required(),    
});

const User = model('user', userSchema);

export default User;