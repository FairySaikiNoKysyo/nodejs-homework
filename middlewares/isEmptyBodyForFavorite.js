import { HttpError } from "../helpers/index.js";

const isEmptyBodyForFavorite = async (req, res, next) => {
    const keys = Object.keys(req.body);
    if(!keys.length) {
        return next(HttpError(400, "Missing field favorite"));
    }
    next();
};
export default isEmptyBodyForFavorite;