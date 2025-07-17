import express from 'express';
const router = new express.Router();


import contactsController from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import contactSchemas from '../schemas/contactSchemas.js';
const { createContactSchema, updateContactSchema } = contactSchemas;






router.get('/', ctrlWrapper(contactsController.getContacts));


router.get('/:contactId',
  isValidId,                                   
  ctrlWrapper(contactsController.getContact)
);


router.delete('/:contactId',
  isValidId,
  ctrlWrapper(contactsController.deleteContact)
);


router.post('/',
  validateBody(createContactSchema),           
  ctrlWrapper(contactsController.createContact)
);


router.patch('/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(contactsController.patchContact)
);

export default router;
