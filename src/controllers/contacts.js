import createError from 'http-errors';
import * as contactsService from '../services/contacts.js';


export async function getContacts(req, res, next) {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      type,
      isFavourite,
    } = req.query;

    const { _id: userId } = req.user;

    const data = await contactsService.getContactsPaginated({
      userId,
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
  } catch (error) {
    next(error);
  }
}

export async function getContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    const contact = await contactsService.getContactById(contactId, userId);

    if (!contact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    const deletedContact = await contactsService.deleteContactById(contactId, userId);

    if (!deletedContact) {
      throw createError(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phoneNumber } = req.body;
    const userId = req.user.id;

    let photoUrl = null;
    if (req.file) {
      photoUrl = req.file.path; 
    }

    const newContact = await contactsService.createContact({
      name,
      email,
      phoneNumber,
      photo: photoUrl,
      user: userId,
    });

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export async function patchContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const body = { ...req.body };

    if (req.file) {
      
      body.photo = req.file.path;
    }

    const updatedContact = await contactsService.updateContactById(contactId, body, userId);

    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
}