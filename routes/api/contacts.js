const express = require("express");
const Joi = require("joi"); 
const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

router.get("/", async (req, res, next) => {
});

router.get("/:contactId", async (req, res, next) => {
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    res.json({ message: "Contact added successfully" });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    res.json({ message: "Contact updated successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
