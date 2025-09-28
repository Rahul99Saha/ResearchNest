const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs"); // Needed for password hashing and comparison

// --- 1. Define Nested Schemas ---

// Used by both Student and Faculty
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

// Used only by Student role
const AcademicInfoSchema = new Schema({
  program: { type: String, default: "" },
  specialization: { type: String, default: "" },
  currentSemester: { type: Number, default: 1 },
  expectedGraduation: { type: Date },
});

// Used only by Faculty role
const FacultyInfoSchema = new Schema({
  designation: { type: String, default: "" },
  office: { type: String, default: "" },
  officeHours: { type: String, default: "" },
  researchInterests: [{ type: String }],
});

// --- 2. Define Main User Schema ---
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

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
