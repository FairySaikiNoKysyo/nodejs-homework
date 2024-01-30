import Contact from '../models/contacts.js';
import {ctrlWrapper} from '../decorators/index.js';
import {HttpError} from '../helpers/index.js';

const getAll = async(req, res) => {    
        const {_id: owner} = req.user;        
        const {page = 1, limit = 20, ...filterParams} = req.query;
        const skip = (page - 1) * limit;
        const filter = {owner, ...filterParams};        
        const result = await Contact.find(filter, "", {skip, limit}).populate("owner", "email subscription");
        if(!result.length){
                throw HttpError(404, `No contacts added yet`);            
            }
        const total = result.length;        
        res.json({
                result,
                total
        });    
}; 

const getById = async(req, res) => {    
        const {id} = req.params;
        const {_id: owner} = req.user;
        const result = await Contact.findOne({_id: id, owner});
        if(!result){
            throw HttpError(404, `Contact with id=${id} not found`);            
        }
        res.json(result);   
};

const add = async(req, res) => {       
        const {_id: owner} = req.user;                
        const result = await Contact.create({...req.body, owner});
        res.status(201).json(result);
};

const updateById = async(req, res ) => {   
        const {id} = req.params;
        const {_id: owner} = req.user;
        const result = await Contact.findOneAndUpdate( {_id: id, owner}, req.body);
        if(!result){
                throw HttpError(404, `Contact with id=${id} not found`);            
            }
        res.json(result); 
}; 

const deleteById = async(req, res ) => {   
        const {id} = req.params;
        const {_id: owner} = req.user;
        const result = await Contact.findOneAndDelete({_id: id, owner});
        if(!result){
            throw HttpError(404, `Contact with id=${id} not found`);            
        }      
        res.json({
            message: 'Contact delete'
        }) 
};

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById)
};