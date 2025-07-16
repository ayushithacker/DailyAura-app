import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    chanting: {
      status: { type: String, enum: ["yes", "no"], required: true },
      rounds: { type: Number }, // optional, only if status is 'yes'
    },

    reading: {
      status: { type: String, enum: ["yes", "no"], required: true },
    },

    katha: {
      status: { type: String, enum: ["yes", "no"], required: true },
    },

    gratitude: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String, // We'll store it as "2025-07-09" string for easier uniqueness per day
      required: true,
      unique: false, // unique for combination of user+date, we'll handle this via compound index
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);
journalSchema.index({ user: 1, date: 1 }, { unique: true });

const Journal = mongoose.model("Journal", journalSchema);
export default Journal;
