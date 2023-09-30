const express = require("express");
const router = express.Router();
const Joi = require("joi");
const mongoose = require("../mongoose");

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const Contact = mongoose.model("Contact", {
  name: String,
  email: String,
  phone: String,
  favorite: {
    type: Boolean,
    default: false,
  },
});

// GET all contacts
router.get("/", async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

// GET a specific contact by ID
router.get("/:contactId", async (req, res, next) => {
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
});

// POST a new contact
router.post("/", async (req, res, next) => {
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
});

// DELETE a contact by ID
router.delete("/:contactId", async (req, res, next) => {
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
});

// PUT (update) a contact by ID
router.put("/:contactId", async (req, res, next) => {
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
});

module.exports = router;
