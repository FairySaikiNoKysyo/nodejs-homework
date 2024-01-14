import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("models", "contacts.json");

const updateContacts = (contacts) =>
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export const listContacts = async () => {
  const readContacts = await fs.readFile(contactsPath);
  return JSON.parse(readContacts);
};

export const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find((contact) => contact.id === contactId);
  return result || null; 
};

export const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const findIndex = contacts.findIndex((contact) => contact.id === contactId);
  if ((findIndex === -1)) {
    return null;
  }
  const [result] = contacts.splice(findIndex, 1);
  await updateContacts(contacts);
  return result; 
};

export const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };
  contacts.push(newContact);
  await updateContacts(contacts);
  return newContact
 
};

export const contactsUpdate = async(contactId,data)=>{
const contacts = await listContacts();
const findIndex = contacts.findIndex((contact) => contact.id === contactId);
if ((findIndex === -1)) {
  return null;
}
contacts[findIndex] = {...contacts[findIndex],...data}
await updateContacts(contacts);
return contacts[findIndex];
}
export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  contactsUpdate
}