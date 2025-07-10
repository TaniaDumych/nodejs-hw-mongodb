const createError = require('http-errors');
const contactsService = require('../services/contacts');

async function getContacts(req, res) {
  const contacts = await contactsService.getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

async function getContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await contactsService.getContactById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

async function deleteContact(req, res, next) {
  const { contactId } = req.params;
  const deletedContact = await contactsService.deleteContactById(contactId);

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
}

async function createContact(req, res) {
  const newContact = await contactsService.createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
}
async function patchContact(req, res) {
  const { contactId } = req.params;
  const updatedContact = await contactsService.updateContactById(contactId, req.body);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
}

module.exports = {
  getContacts,
  getContact,
  deleteContact,
  createContact,
  patchContact,
};
