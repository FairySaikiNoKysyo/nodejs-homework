import express from "express";

import authController from "../../controllers/auth-controller.js";
import {authenticate, isEmptyBody, isEmptyFile, resizeAvatar, upload} from '../../middlewares/index.js'
import {validateBody} from '../../decorators/index.js';
import { userSignupSchema, userSigninSchema, usersUpdateSubscribeSchema} from "../../models/user.js";


const authRouter = express.Router();

authRouter.post('/register', isEmptyBody, validateBody(userSignupSchema), resizeAvatar, authController.signup);

authRouter.post('/login', isEmptyBody, validateBody(userSigninSchema), authController.signin);

authRouter.get('/current', authenticate, authController.getCurrent);

authRouter.post('/logout', authenticate, authController.signout);

authRouter.patch('/update', authenticate, isEmptyBody, validateBody(usersUpdateSubscribeSchema), authController.updateSubscription);

authRouter.patch('/avatars', authenticate, upload.single('avatarURL'), isEmptyFile, resizeAvatar, authController.updateAvatar);

export default authRouter;