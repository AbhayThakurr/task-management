import express from "express";
import { auth, isAdmin } from "../middleware/auth.js";
import User from "../models/auth.js";

const router = express.Router();

router.get("/", [auth, isAdmin], async (req, res) => {
  try {
    const users = await User.find({ role: "user" }, "email username _id");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
