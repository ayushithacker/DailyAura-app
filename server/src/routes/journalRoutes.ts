import { authenticateToken } from './../middleware/authMiddleware';
import express from "express"
import { journalSave, getJournal } from "../controllers/journalController"

const router = express.Router();

router.post("/", authenticateToken, journalSave);
router.get("/", authenticateToken, getJournal);

export default router;