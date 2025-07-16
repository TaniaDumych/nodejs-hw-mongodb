import Contact from '../models/contact.js';


async function getContactsPaginated({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite,
} = {}) {
  const skip = (page - 1) * perPage;

  
  const filter = {};
  if (type) filter.contactType = type;
  if (typeof isFavourite !== 'undefined') filter.isFavourite = isFavourite === 'true';

  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);

  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .skip(skip)
    .limit(perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
}


async function getAllContacts() {
  return Contact.find();
}

async function getContactById(contactId) {
  return Contact.findById(contactId);
}

async function deleteContactById(contactId) {
  return Contact.findByIdAndDelete(contactId);
}

async function createContact(data) {
  return Contact.create(data);
}

async function updateContactById(contactId, data) {
  return Contact.findByIdAndUpdate(contactId, data, { new: true });
}

export  {

  getContactsPaginated,
  getAllContacts,
  getContactById,
  deleteContactById,
  createContact,
  updateContactById,
};
