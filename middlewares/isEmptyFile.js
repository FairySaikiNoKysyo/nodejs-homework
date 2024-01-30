import { HttpError } from "../helpers/index.js";

const isEmptyFile = async(req, res, next) => {   
    if(!req.file) {
        return next(HttpError(400, "Missing fields"));
    }    
    next();    
};

export default isEmptyFile;