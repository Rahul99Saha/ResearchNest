const mongoose = require("mongoose");
const { Schema } = mongoose;

const SubtaskSchema = new Schema({
  title: String,
  description: String,
  ordering: Number,
});
const TaskSchema = new Schema({
  title: String,
  description: String,
  ordering: Number,
  subtasks: [SubtaskSchema],
});
const StageSchema = new Schema({
  title: String,
  description: String,
  ordering: Number,
  tasks: [TaskSchema],
});
const MilestoneSchema = new Schema({
  title: String,
  description: String,
  ordering: Number,
  stages: [StageSchema],
});

const TemplateSchema = new Schema({
  name: String,
  description: String,
  milestones: [MilestoneSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Template", TemplateSchema);
