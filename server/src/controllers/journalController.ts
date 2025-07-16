import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Journal from "../models/journalSchema";
import mongoose from "mongoose";

export const journalSave = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  // ✅ FIXED: explicitly say Promise<void>
  const userId = req.user;
  const { chanting, reading, katha, gratitude } = req.body;
  console.log("Journal Body:", req.body);

  const today = new Date().toISOString().split("T")[0];

  if (
    !chanting?.status ||
    (chanting.status === "yes" && !chanting.rounds) ||
    !reading?.status ||
    !katha?.status ||
    !gratitude?.trim()
  ) {
    res.status(400).json({ error: "All fields are required" });
    return; // ✅ stop further execution
  }

  try {
    const existing = await Journal.findOne({ user: userId, date: today });
    if (existing) {
      res.status(409).json({ error: "Journal already submitted today." });
      return;
    }

    const newEntry = new Journal({
      user: userId,
      chanting,
      reading,
      katha,
      gratitude,
      date: today,
    });

    await newEntry.save();

    res.status(201).json({ message: "Journal saved successfully!" });
  } catch (error) {
    console.error("Journal Save Error:", error);
    res.status(500).json({ error: "Server error while saving journal" });
  }
};

export const getJournal = async (req: AuthRequest, res: Response) => {
 const userId = new mongoose.Types.ObjectId(req.user as string);
 console.log("req.user:", req.user);
  try {
    const  journal = await Journal.find({user: userId}).sort({date: -1})
    res.json(journal)

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch journal entries." });
  }
};
