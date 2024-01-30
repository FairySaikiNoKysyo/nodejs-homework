import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv/config';
import fs from 'fs/promises';
import path from "path";
import gravatar from 'gravatar';
import { nanoid } from "nanoid";

import User from "../models/user.js";
import {ctrlWrapper} from '../decorators/index.js';
import {HttpError, sendEmail} from '../helpers/index.js';

const {JWT_SECRET, BASE_URL} = process.env;

const avatarsPath = path.resolve('public', 'avatars');

const signup = async(req, res) => {

    const {email, password} = req.body;    
    const user = await User.findOne({email});

    if(user){
        throw HttpError(409, 'Email in use')
    }

    const avatarURL = gravatar.url(email, {s: '100', r: 'g', d: 'monsterid'}, false);    
    const hashPassword = await bcrypt.hash(password,10);
    const verificationToken = nanoid();
       
    const newUser = await User.create({...req.body, avatarURL, password: hashPassword, verificationToken});
    
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
        user:{
            email: newUser.email,
            subscription: newUser.subscription
        }
    });
};

const verify = async(req, res) => {

    const {verificationToken} = req.params; 
    const user = await User.findOne({verificationToken});    

    if(!user){
        throw HttpError(404, 'User not found');
    }

    const {_id} = user._id;
    
    await User.updateOne({_id}, {verify: true, verificationToken: null});
    res.status(200).json({
        message: 'Verification successful'
    })
};

const resendVerify = async(req, res) => {
    const {email} = req.body; 
     const {verificationToken} = req.params; 

    const user = await User.findOne({email});    
    
    if(!user){
        throw HttpError(400, 'Missing required field email');
    };

    if(user.verify ==="true") {
        throw HttpError(400, 'Verification has already been passed');
    };
   
      
    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.json({
        message: 'Verification email sent'
    })

}

const signin = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({ email });
    if(!user){
        throw HttpError(401, 'Email or password is wrong');
    } 

    if(user.verify ==="false"){
        throw HttpError(401, 'Email not verify'); 
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, 'Email or password is wrong')
    }

    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '23h'});
    await User.findByIdAndUpdate(user._id, {token});
    res.json({
        token,
        user:{
            email: user.email,
            subscription: user.subscription,
        }
    })
};

const getCurrent = async(req, res) => {
    const {email, subscription} = req.user;
    res.json({
        email,
        subscription
    })
};

const signout = async(req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token:""});
    res.status(204).send();    
};

const updateAvatar = async(req, res) => {    
    const {_id, avatarURL: oldURL } = req.user;    

    const {path: oldPath, filename} = req.file;
    const newPath = path.join(avatarsPath, filename);
    await fs.rename(oldPath, newPath);  
    const avatarURL = path.join('avatars', filename);

    const result = await User.findByIdAndUpdate(_id, {avatarURL}); 

    if(oldURL.startsWith('avatars')){
        const oldAvatarPath = path.resolve('public', oldURL);     
        await fs.unlink(oldAvatarPath);
    }       
    res.json({
        avatarURL: result.avatarURL});
}

const updateSubscription = async(req, res) => {
    const subscriptionValue = ["starter", "pro", "business"];
    const {subscription} = req.body;    
    const {_id, email} = req.user;    
    if(!(subscriptionValue.includes(subscription))){
        throw HttpError(401, 'Subscribtion value is wrong')
    };
    await User.findByIdAndUpdate(_id, req.body);
    res.json({
        email,        
        subscription
    });
};

export default {
    signup: ctrlWrapper(signup),
    verify:ctrlWrapper(verify),
    resendVerify: ctrlWrapper(resendVerify),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
    updateAvatar: ctrlWrapper(updateAvatar),
    updateSubscription: ctrlWrapper(updateSubscription),
};