const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts');
const ctrlWrapper = require('../utils/ctrlWrapper');

router.get('/', ctrlWrapper(contactsController.getContacts));
router.get('/:contactId', ctrlWrapper(contactsController.getContact));
router.delete('/:contactId', ctrlWrapper(contactsController.deleteContact));
router.post('/', ctrlWrapper(contactsController.createContact));
router.patch('/:contactId', ctrlWrapper(contactsController.patchContact));



module.exports = router;
