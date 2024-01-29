import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { HttpError } from "../helpers/index.js";
import User from "../models/user.js";

dotenv.config()

const {JWT_SECRET} = process.env;

const authenticate = async(req, res, next) => {
    const {authorization} = req.headers;
    if(!authorization){
        return next(HttpError(401, 'Not authorized'))
    }
    const [bearer, token] = authorization.split(" ");
    if(bearer !== "Bearer"){
        return next(HttpError(401, 'Not authorized'));
    }
    try {
        const {id} = jwt.verify(token, JWT_SECRET);//перев. чи токен валідний
        const user = await User.findById(id);//чи є користувач з таким id в базі
        if(!user || !user.token || user.token !== token){//якщо користувача немає або в нього немає токену або токен не співпадає з тим що в базі
            return next(HttpError(401, 'Not authorized'));
        }
        req.user = user;//додавання інформації про користувача, який робить запит
        next();       
    } catch (error) {        
        next(HttpError(401, error.message));
    } 
    
}; 

export default authenticate;