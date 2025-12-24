import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { subjectSchema } from "../validators/ValidateUser.js";

const prisma = new PrismaClient();
const router = express.Router();

/* ================= CREATE SUBJECT ================= */
router.post("/subject", authMiddleware, isAdmin, async (req, res) => {
  try {
    const parsed = subjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { name, semester, branchCodes } = parsed.data;

    const subject = await prisma.subject.create({
      data: {
        name,
        semester,
        branches: {
          connect: branchCodes.map((code) => ({ code })),
        },
      },
      include: { branches: true },
    });

    res.status(201).json({ subject });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* ================= GET SUBJECTS (WITH FILTER) ================= */
/*
  Supports:
  /api/subject
  /api/subject?semester=1
  /api/subject?branch=CSE_AI
  /api/subject?semester=1&branch=CSE_AI
*/
router.get("/subject", async (req, res) => {
  try {
    const { semester, branch } = req.query;

    const subjects = await prisma.subject.findMany({
      where: {
        ...(semester && { semester: Number(semester) }),
        ...(branch && {
          branches: {
            some: { code: branch },
          },
        }),
      },
      orderBy: { semester: "asc" },
      select: {
        id: true,
        name: true,
        semester: true,
      },
    });

    res.status(200).json(subjects);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* ================= GET SUBJECT BY ID ================= */
router.get("/subject/:id", async (req, res) => {
  try {
    const subject = await prisma.subject.findUnique({
      where: { id: req.params.id },
      include: { branches: true },
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json(subject);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* ================= UPDATE SUBJECT ================= */
router.put("/subject/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const parsed = subjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { name, semester, branchCodes } = parsed.data;

    const subject = await prisma.subject.update({
      where: { id: req.params.id },
      data: {
        name,
        semester,
        branches: {
          set: [],
          connect: branchCodes.map((code) => ({ code })),
        },
      },
      include: { branches: true },
    });

    res.status(200).json(subject);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* ================= DELETE SUBJECT ================= */
router.delete("/subject/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    await prisma.subject.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({ message: "Subject deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
