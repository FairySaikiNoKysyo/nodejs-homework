import express from "express";

import contactsController from "../../controllers/contacts-controller.js";
import {isEmptyBody, isEmptyBodyForFavorite, isValidId, authenticate} from "../../midllewares/index.js";
import {validateBody} from '../../decorators/index.js';
import {contactAddSchema, contactFavoriteSchema, contactUpdateSchema } from "../../models/Contact.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', contactsController.getAll);

contactsRouter.get('/:id', isValidId, contactsController.getById);

contactsRouter.post('/', isEmptyBody, validateBody(contactAddSchema), contactsController.add);

contactsRouter.put('/:id', isValidId, isEmptyBody, validateBody(contactUpdateSchema), contactsController.updateById);

contactsRouter.patch('/:id/favorite', isValidId, isEmptyBodyForFavorite, validateBody(contactFavoriteSchema), contactsController.updateById);

contactsRouter.delete('/:id', isValidId, contactsController.deleteById);

export default contactsRouter;