import express from 'express'
import contactsControlers from '../../controlers/contacts-controlers.js'
import isEmptyBody from '../../middlewares/isEmptyBody.js'
import validateBody from '../../middlewares/validateBody.js'
import { addContactScheme,updateContactScheme } from '../../schemes/contactsSchemes.js'

const contactsRouter = express.Router()

contactsRouter.get('/', contactsControlers.getAllContacts);

contactsRouter.get('/:contactId',contactsControlers.getContactById);

contactsRouter.post('/',isEmptyBody,validateBody(addContactScheme), contactsControlers.addContact);

contactsRouter.delete('/:contactId',contactsControlers.deleteContact);

contactsRouter.put('/:contactId',isEmptyBody,validateBody(updateContactScheme), contactsControlers.updateContact);

export default  contactsRouter
