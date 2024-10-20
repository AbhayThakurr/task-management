import express from "express";
import Task from "../models/tasks.js";
import { auth, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", [auth, isAdmin], async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const query =
      req.user.role === "admin" ? {} : { assignedTo: req.user.userId };
    const tasks = await Task.find(query).populate("assignedTo", "email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id", [auth, isAdmin], async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", [auth, isAdmin], async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
