import { HttpError } from "../helpers/index.js";

const isEmptyBody = async(req, res, next) => {
    console.log(req.body);
    const keys = Object.keys(req.body);    
    if(!keys.length) {
        return next(HttpError(400, "Missing fields"));
    }
    next();    
}
export default isEmptyBody;