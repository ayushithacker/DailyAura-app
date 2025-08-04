import { Request, Response } from "express";
import Journal from "../models/journalSchema";
import mongoose from "mongoose";
import { logger } from "../utils/logger";

export const journalSave = async (
  req: Request,
  res: Response
): Promise<void> => {
  const startTime = Date.now();
  const userId = (req as any).user as string;
  const { chanting, reading, katha, gratitude } = req.body;
  
  logger.info('Journal save attempt', { userId, date: new Date().toISOString().split("T")[0] }, 'JOURNAL_CONTROLLER');

  const today = new Date().toISOString().split("T")[0];

  if (
    !chanting?.status ||
    (chanting.status === "yes" && !chanting.rounds) ||
    !reading?.status ||
    !katha?.status ||
    !gratitude?.trim()
  ) {
    logger.warn('Journal save failed - missing fields', { userId, chanting, reading, katha }, 'JOURNAL_CONTROLLER');
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    const existing = await Journal.findOne({ user: userId, date: today });
    if (existing) {
      logger.warn('Journal save failed - already exists for today', { userId, date: today }, 'JOURNAL_CONTROLLER');
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

    const duration = Date.now() - startTime;
    logger.info('Journal saved successfully', { userId, date: today }, 'JOURNAL_CONTROLLER');
    logger.logPerformance('Journal save', duration, 'JOURNAL_CONTROLLER');

    res.status(201).json({ message: "Journal saved successfully!" });
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Journal save failed', error as Error, 'JOURNAL_CONTROLLER');
    logger.logPerformance('Journal save (failed)', duration, 'JOURNAL_CONTROLLER');
    res.status(500).json({ error: "Server error while saving journal" });
  }
};

export const getJournal = async (req: Request, res: Response) => {
  const startTime = Date.now();
  const userId = new mongoose.Types.ObjectId((req as any).user as string);
  
  logger.info('Journal fetch attempt', { userId: userId.toString() }, 'JOURNAL_CONTROLLER');
  
  try {
    const journal = await Journal.find({user: userId}).sort({date: -1});
    
    const duration = Date.now() - startTime;
    logger.info('Journal fetched successfully', { 
      userId: userId.toString(), 
      entryCount: journal.length 
    }, 'JOURNAL_CONTROLLER');
    logger.logPerformance('Journal fetch', duration, 'JOURNAL_CONTROLLER');
    
    res.json(journal);
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Journal fetch failed', error as Error, 'JOURNAL_CONTROLLER');
    logger.logPerformance('Journal fetch (failed)', duration, 'JOURNAL_CONTROLLER');
    res.status(500).json({ message: "Failed to fetch journal entries." });
  }
};
