import { Request, Response } from "express";

import { Contact } from "../../models/web/Contact";

export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    // Save contact form data to DB
    const contact = new Contact({ name, email, subject, message });
    await contact.save();

    console.log("Contact form submission received and saved:", { name, email, subject, message });

    return res.status(200).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    console.error("Error handling contact form submission:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
