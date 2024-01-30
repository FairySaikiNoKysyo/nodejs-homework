import * as contactsService from '../models/contacts.js'
import {HttpError} from '../helpers/index.js'

const getAllContacts = async(req,res)=>{
    const result = await contactsService.listContacts();
    res.json(result);
}
const getContactById = async(req,res)=>{
    const {contactId} = req.params;
    const result = await contactsService.getContactById(contactId);
    if(!result){
        throw HttpError(404,'not found')
    }
    res.json(result).status(200);

}
const addContact = async(req,res)=>{
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
}
const  deleteContact = async(req,res)=>{
   const {contactId} = req.params;
   const result = await contactsService.removeContact(contactId);
   if(!result){
    throw HttpError(404,'not found')
}
res.status(200).json({message:'All right. We deleted this contact.'});
}

const updateContact = async(req,res)=>{
    const {contactId} = req.params;
    const result = await contactsService.contactsUpdate(contactId,req.body);
    if(!result){
        throw HttpError(400,'not found')
    }
    res.json(result).status(200);
}
export default{
    getAllContacts,
    getContactById,
    addContact,
    deleteContact,
    updateContact
}