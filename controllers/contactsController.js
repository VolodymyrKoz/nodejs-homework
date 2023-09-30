// eslint-disable-next-line no-unused-vars
const Joi = require("joi");
const Contact = require("../models/contact");
const contactSchema = require("../schemas/contactSchema");

// Create a new contact
async function createContact(req, res, next) {
  try {
    const { error } = contactSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newContact = new Contact(req.body);
    await newContact.save();

    res.json({ message: "Contact added successfully" });
  } catch (error) {
    next(error);
  }
}

async function getAllContacts(req, res, next) {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
}

async function getContactById(req, res, next) {
  const { contactId } = req.params;

  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
}

async function updateContactById(req, res, next) {
  const { contactId } = req.params;

  try {
    const { error } = contactSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      req.body,
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Contact updated successfully", updatedContact });
  } catch (error) {
    next(error);
  }
}

async function deleteContactById(req, res, next) {
  const { contactId } = req.params;

  try {
    const deletedContact = await Contact.findByIdAndRemove(contactId);
    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContactById,
  deleteContactById,
};
