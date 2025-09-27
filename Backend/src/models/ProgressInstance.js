const mongoose = require('mongoose');
const { Schema } = mongoose;

const AuditSchema = new Schema({ when: Date, by: { type: Schema.Types.ObjectId, ref: 'User' }, action: String, nodeId: Schema.Types.ObjectId, oldStatus: String, newStatus: String });

const ProgressSubtask = new Schema({ _id: Schema.Types.ObjectId, title: String, description: String, status: { type: String, enum: ['Locked','In Progress','Completed'], default: 'Locked' }, ordering: Number });
const ProgressTask = new Schema({ _id: Schema.Types.ObjectId, title: String, description: String, status: { type: String, enum: ['Locked','In Progress','Completed'], default: 'Locked' }, ordering: Number, subtasks: [ProgressSubtask] });
const ProgressStage = new Schema({ _id: Schema.Types.ObjectId, title: String, description: String, status: { type: String, enum: ['Locked','In Progress','Completed'], default: 'Locked' }, ordering: Number, tasks: [ProgressTask] });
const ProgressMilestone = new Schema({ _id: Schema.Types.ObjectId, title: String, description: String, status: { type: String, enum: ['Locked','In Progress','Completed'], default: 'Locked' }, ordering: Number, stages: [ProgressStage] });

const ProgressInstanceSchema = new Schema({ studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, templateId: { type: Schema.Types.ObjectId, ref: 'Template' }, milestones: [ProgressMilestone], audit: [AuditSchema] }, { timestamps: true });

module.exports = mongoose.model('ProgressInstance', ProgressInstanceSchema);