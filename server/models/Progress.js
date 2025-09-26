const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    milestone: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional for faculty/admin
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);
