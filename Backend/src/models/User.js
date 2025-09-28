const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");

// Import related models
const Template = require("./Template");
const ProgressInstance = require("./ProgressInstance");

// --- Nested Schemas ---
const ResearchProfileSchema = new Schema({
  researchTopic: { type: String, default: "" },
  researchArea: { type: String, default: "" },
  supervisor: { type: Schema.Types.ObjectId, ref: "User", default: null },
  supervisees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  researchProgress: { type: Number, min: 0, max: 100, default: 0 },
  publications: [{ type: String }],
  startDate: { type: Date },
  expectedCompletion: { type: Date },
});

const AcademicInfoSchema = new Schema({
  program: { type: String, default: "" },
  specialization: { type: String, default: "" },
  currentSemester: { type: Number, default: 1 },
  expectedGraduation: { type: Date },
});

const FacultyInfoSchema = new Schema({
  designation: { type: String, default: "" },
  office: { type: String, default: "" },
  officeHours: { type: String, default: "" },
  researchInterests: [{ type: String }],
});

// --- Main User Schema ---
const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Student", "Faculty", "Admin"], required: true },
  name: { type: String, required: true },

  personalInfo: {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    phone: { type: String, default: "" },
    department: { type: String, default: "" },
  },

  academicInfo: { type: AcademicInfoSchema, default: {} },
  facultyInfo: { type: FacultyInfoSchema, default: {} },
  researchProfile: { type: ResearchProfileSchema, default: {} },

  memberSince: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
});

// --- Password compare ---
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// --- Post-save hook to add default Template + Progress ---
UserSchema.post("save", async function (doc, next) {
  try {
    if (doc.role === "Student") {
      // Default template data
      const defaultTemplate = await Template.create({
        _id: new mongoose.Types.ObjectId(),
        name: "Default Research Template",
        description: "Auto-created for new student",
        milestones: [
          {
            _id: new mongoose.Types.ObjectId("68d957b8f4a36c879c8d88a8"),
            title: "Milestone 1: Literature Review",
            description: "Collect and review relevant papers",
            ordering: 1,
            stages: [
              {
                _id: new mongoose.Types.ObjectId("68d957b8f4a36c879c8d88a9"),
                title: "Stage 1.1: Collect Papers",
                description: "Gather research papers from databases",
                ordering: 1,
                tasks: [
                  {
                    _id: new mongoose.Types.ObjectId(
                      "68d957b8f4a36c879c8d88aa"
                    ),
                    title: "Task 1.1.1: Search Papers",
                    description: "Use Google Scholar and IEEE Xplore",
                    ordering: 1,
                    subtasks: [
                      {
                        _id: new mongoose.Types.ObjectId(
                          "68d957b8f4a36c879c8d88ab"
                        ),
                        title: "Subtask 1",
                        description: "Search for keywords",
                        ordering: 1,
                      },
                      {
                        _id: new mongoose.Types.ObjectId(
                          "68d957b8f4a36c879c8d88ac"
                        ),
                        title: "Subtask 2",
                        description: "Save PDFs",
                        ordering: 2,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            _id: new mongoose.Types.ObjectId("68d957b8f4a36c879c8d88ad"),
            title: "Milestone 2: Experiment Design",
            description: "Plan experiments",
            ordering: 2,
            stages: [
              {
                _id: new mongoose.Types.ObjectId("68d957b8f4a36c879c8d88ae"),
                title: "Stage 2.1: Hypothesis",
                description: "Define hypotheses for experiments",
                ordering: 1,
                tasks: [
                  {
                    _id: new mongoose.Types.ObjectId(
                      "68d957b8f4a36c879c8d88af"
                    ),
                    title: "Task 2.1.1: Formulate Hypotheses",
                    description: "Write down testable hypotheses",
                    ordering: 1,
                    subtasks: [
                      {
                        _id: new mongoose.Types.ObjectId(
                          "68d957b8f4a36c879c8d88b0"
                        ),
                        title: "Subtask 1",
                        description: "Brainstorm ideas",
                        ordering: 1,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      // Create Progress Instance for this student
      await ProgressInstance.create({
        studentId: doc._id,
        templateId: defaultTemplate._id,
        milestones: defaultTemplate.milestones.map((ms) => ({
          ...ms.toObject(),
          status: "Locked",
          stages: ms.stages.map((st) => ({
            ...st.toObject(),
            status: "Locked",
            tasks: st.tasks.map((t) => ({
              ...t.toObject(),
              status: "Locked",
              subtasks: t.subtasks.map((s) => ({
                ...s.toObject(),
                status: "Locked",
              })),
            })),
          })),
        })),
        audit: [],
      });
    }
    next();
  } catch (err) {
    console.error("Error creating default template/progress:", err);
    next(err);
  }
});

module.exports = mongoose.model("User", UserSchema);
