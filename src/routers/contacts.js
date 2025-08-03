import express from 'express';
const router = express.Router();

import { authenticate } from '../middlewares/authenticate.js';
import { getContacts, getContact, deleteContact, createContact, patchContact } from '../controllers/contacts.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactSchemas.js';
import { upload } from '../middlewares/upload.js';

router.use(authenticate);

router.get('/', ctrlWrapper(getContacts));

router.get('/:contactId',
  isValidId,
  ctrlWrapper(getContact)
);

router.delete('/:contactId',
  isValidId,
  ctrlWrapper(deleteContact)
);

router.post(
  '/',
  authenticate,
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContact)
);

router.patch('/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContact)
);



export default router;
