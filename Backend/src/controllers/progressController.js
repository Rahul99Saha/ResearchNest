const ProgressInstance = require("../models/ProgressInstance");
const Template = require("../models/Template");
const mongoose = require("mongoose");
const { propagateStatus, setNodeStatusById } = require("../utils/propagate");

// Seed a progress instance for a student from a template
const seedProgressForStudent = async (req, res) => {
  const { studentId, templateId } = req.body;
  try {
    const tpl = await Template.findById(templateId);
    if (!tpl) return res.status(404).json({ message: "Template not found" });
    const milestones = tpl.milestones.map((ms) => {
      const msId = new mongoose.Types.ObjectId();
      return {
        _id: msId,
        title: ms.title,
        description: ms.description,
        ordering: ms.ordering,
        status: "Locked",
        stages: ms.stages.map((st) => {
          const stId = new mongoose.Types.ObjectId();
          return {
            _id: stId,
            title: st.title,
            description: st.description,
            ordering: st.ordering,
            status: "Locked",
            tasks: st.tasks.map((t) => {
              const tId = new mongoose.Types.ObjectId();
              return {
                _id: tId,
                title: t.title,
                description: t.description,
                ordering: t.ordering,
                status: "Locked",
                subtasks: t.subtasks.map((s) => ({
                  _id: new mongoose.Types.ObjectId(),
                  title: s.title,
                  description: s.description,
                  ordering: s.ordering,
                  status: "Locked",
                })),
              };
            }),
          };
        }),
      };
    });
    const inst = await ProgressInstance.create({
      studentId,
      templateId,
      milestones,
    });
    return res.json(inst);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getMyProgress = async (req, res) => {
  try {
    const inst = await ProgressInstance.findOne({ studentId: req.user._id });
    if (!inst) return res.status(404).json({ message: "No progress found" });
    return res.json(inst);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getStudentProgress = async (req, res) => {
  try {
    const inst = await ProgressInstance.findOne({
      studentId: req.params.studentId,
    });
    if (!inst) return res.status(404).json({ message: "No progress found" });
    return res.json(inst);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update node status and propagate
const updateNodeStatus = async (req, res) => {
  const { nodeId } = req.params;
  const { status } = req.body; // 'Locked'|'In Progress'|'Completed'
  try {
    const inst = await ProgressInstance.findOne({ studentId: req.user._id });
    if (!inst) return res.status(404).json({ message: "No progress found" });
    const found = setNodeStatusById(inst.milestones, nodeId, status);
    if (!found) return res.status(404).json({ message: "Node not found" });
    propagateStatus(inst.milestones);
    inst.audit.push({
      when: new Date(),
      by: req.user._id,
      action: "update_status",
      nodeId,
      oldStatus: found.oldStatus,
      newStatus: status,
    });
    await inst.save();
    return res.json(inst);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Faculty override
const overrideNodeStatus = async (req, res) => {
  const { nodeId } = req.params;
  const { status } = req.body;
  try {
    const inst = await ProgressInstance.findOne({
      studentId: req.params.studentId,
    });
    if (!inst) return res.status(404).json({ message: "No progress found" });
    const found = setNodeStatusById(inst.milestones, nodeId, status);
    if (!found) return res.status(404).json({ message: "Node not found" });
    propagateStatus(inst.milestones);
    inst.audit.push({
      when: new Date(),
      by: req.user._id,
      action: "override_status",
      nodeId,
      oldStatus: found.oldStatus,
      newStatus: status,
    });
    await inst.save();
    return res.json(inst);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  seedProgressForStudent,
  getMyProgress,
  getStudentProgress,
  updateNodeStatus,
  overrideNodeStatus,
};
