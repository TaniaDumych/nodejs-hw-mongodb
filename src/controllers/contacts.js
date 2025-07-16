import createError from 'http-errors';
import * as contactsService from '../services/contacts.js';

async function getContacts(req, res) {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const data = await contactsService.getContactsPaginated({
    page: Number(page),
    perPage: Number(perPage),
    sortBy,
    sortOrder,
    type,
    isFavourite,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
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

export default  {
  getContacts,
  getContact,
  deleteContact,
  createContact,
  patchContact,
};
