const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcryptjs'); // Needed for password hashing and comparison

// --- 1. Define Nested Schemas ---

// Used by both Student and Faculty
const ResearchProfileSchema = new Schema({
    researchTopic: { type: String, default: "" },
    researchArea: { type: String, default: "" },
    // Reference to a Faculty user (self-reference)
    supervisor: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    // Array of Student IDs the Faculty user is supervising
    supervisees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    researchProgress: { type: Number, min: 0, max: 100, default: 0 },
    publications: [{ type: String }],
    startDate: { type: Date },
    expectedCompletion: { type: Date },
});

// Used only by Student role
const AcademicInfoSchema = new Schema({
    program: { type: String, default: "" }, // e.g., 'PhD', 'Masters'
    specialization: { type: String, default: "" },
    currentSemester: { type: Number, default: 1 },
    expectedGraduation: { type: Date },
});

// Used only by Faculty role
const FacultyInfoSchema = new Schema({
    designation: { type: String, default: "" }, // e.g., 'Professor', 'Lecturer'
    office: { type: String, default: "" },
    officeHours: { type: String, default: "" },
    researchInterests: [{ type: String }],
});

// --- 2. Define Main User Schema ---

const UserSchema = new Schema({
    // Basic Authentication & Identification
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Student", "Faculty", "Admin"], required: true },
    
    // Personal Information (used by all roles)
    personalInfo: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, default: "" },
        department: { type: String, default: "" },
        // NOTE: Email is kept outside personalInfo to enforce uniqueness at the root level
    },

    // Role-specific Information (Conditional)
    academicInfo: { type: AcademicInfoSchema, default: {} },
    facultyInfo: { type: FacultyInfoSchema, default: {} },
    
    // Research Information (used by both Student and Faculty)
    researchProfile: { type: ResearchProfileSchema, default: {} },

    // Metadata
    memberSince: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
});

// --- 3. Add Pre-Save Hook for Password Hashing ---

// Hash password before saving if it has been modified (e.g., during creation or change)
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// --- 4. Add Method for Password Comparison ---

// Method to compare candidate password with hashed password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    // This is used in your /change-password route
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);