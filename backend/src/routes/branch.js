
import express from "express";
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    console.log("Fetching branches");
    const branches = await prisma.branch.findMany({
      select: {
        id: true,
        code: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });

    res.status(200).json({ branches });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch branches" });
  }
});


export default router;