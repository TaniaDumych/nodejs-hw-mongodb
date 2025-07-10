const Contact = require('../models/contact');

async function getAllContacts() {
  return await Contact.find();
}

async function getContactById(contactId) {
  return await Contact.findById(contactId);
}

async function deleteContactById(contactId) {
  return await Contact.findByIdAndDelete(contactId);
}

async function createContact(data) {
  return await Contact.create(data);
}

async function updateContactById(contactId, data) {
  return await Contact.findByIdAndUpdate(contactId, data, { new: true });
}


module.exports = {
  getAllContacts,
  getContactById,
  deleteContactById,
  createContact,
  updateContactById,

};
