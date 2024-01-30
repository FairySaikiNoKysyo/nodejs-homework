import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import User from "../models/user.js";
import {ctrlWrapper} from '../decorators/index.js';
import {HttpError} from '../helpers/index.js';

dotenv.config();

const {JWT_SECRET} = process.env;

const signup = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user){
        throw HttpError(409, 'Email in use')
    }
    const hashPassword = await bcrypt.hash(password,10);
    const newUser = await User.create({...req.body, password: hashPassword});
    res.status(201).json({
        user:{
            email: newUser.email,
            subscription: newUser.subscription
        }
    });

};

const signin = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({ email });
    if(!user){
        throw HttpError(401, 'Email or password is wrong');
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
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
    updateSubscription: ctrlWrapper(updateSubscription),
};