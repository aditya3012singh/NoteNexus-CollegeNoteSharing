import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

// async function main() {
//   await prisma.branch.createMany({
//     skipDuplicates: true,
//     data: [
//       { code: "CSE", name: "Computer Science Engineering" },
//       { code: "IT", name: "Information Technology" },
//       { code: "ECE", name: "Electronics & Communication Engineering" },
//       { code: "ME", name: "Mechanical Engineering" },
//       { code: "CSE_AI", name: "CSE Artificial Intelligence" },
//       {code: "CSE_DS", name: "CSE Data Science" },
//       {code: "CSE_CS", name: "CSE Cyber Security" },
//       {code: "CSE_IAIML", name: "CSE Artificial Intelligence and Machine Learning" },
//       {code:"CSIT", name: "Computer Science and Information Technology" },
//       {code:"IT", name: "Information Technology" },
//       {code:"CS", name: "Computer Science" },
//     ],
//   });
//   console.log("Branches seeded.");
// }

// main()
//   .then(() => prisma.$disconnect())
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

// async function upsertSubject(name, semester, branchCodes) {
//   await prisma.subject.upsert({
//     where: {
//       name_semester: {
//         name,
//         semester,
//       },
//     },
//     update: {},
//     create: {
//       name,
//       semester,
//       branches: {
//         connect: branchCodes.map(code => ({ code })),
//       },
//     },
//   });
// }

// async function main() {
//   const SEM1_BRANCHES = ["CSE_AI", "CSE_IAIML", "CS"];

//   /* ---------- SEMESTER 1 SUBJECTS (COMMON) ---------- */

//   await upsertSubject("Calculus for Engineers", 1, SEM1_BRANCHES);
//   await upsertSubject("Communication Skills", 1, SEM1_BRANCHES);
//   await upsertSubject("Web Development", 1, SEM1_BRANCHES);
//   await upsertSubject("IoT and Embedded Systems", 1, SEM1_BRANCHES);
//   await upsertSubject("Design Thinking", 1, SEM1_BRANCHES);
//   await upsertSubject("Programming for Problem Solving (PPS)", 1, SEM1_BRANCHES);
//   await upsertSubject("Web Designing", 1, SEM1_BRANCHES);
//   await upsertSubject("DSTL", 1, SEM1_BRANCHES);
//   await upsertSubject("Semiconductor Physics and Devices", 1, SEM1_BRANCHES);

//   console.log("✅ Semester 1 subjects seeded for CSE_AI, CSE_IAIML, CS");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


// async function main() {
//   // 1️⃣ Find any existing branch (admin still needs branch + semester)
//   const branch = await prisma.branch.findFirst();

//   if (!branch) {
//     throw new Error("❌ No branch found. Please seed Branch first.");
//   }

//   // 2️⃣ Hash password
//   const hashedPassword = await bcrypt.hash("Admin@123", 10);

//   // 3️⃣ Create admin (skip if already exists)
//   const adminEmail = "admin@example.com";

//   const existingAdmin = await prisma.user.findUnique({
//     where: { email: adminEmail },
//   });

//   if (existingAdmin) {
//     console.log("⚠️ Admin already exists:", existingAdmin.email);
//     return;
//   }

//   const admin = await prisma.user.create({
//     data: {
//       name: "Super Admin",
//       email: adminEmail,
//       password: hashedPassword,
//       role: "ADMIN",
//       semester: 0, // Admin doesn’t belong to a semester
//       branchId: branch.id,
//     },
//   });

//   console.log("✅ Admin created successfully:");
//   console.log({
//     email: admin.email,
//     role: admin.role,
//   });
// }

// main()
//   .catch((e) => {
//     console.error("❌ Seeding error:", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

async function seedNotes() {
  console.log("📘 Seeding notes...");

  /* ---------------- FIND REQUIRED DATA ---------------- */

  const branch = await prisma.branch.findFirst({
    where: { code: "CSE_AI" },
  });
  if (!branch) throw new Error("❌ Branch CSE_AI not found");

  const subject = await prisma.subject.findFirst({
    where: {
      name: "Programming for Problem Solving (PPS)",
      semester: 1,
    },
  });
  if (!subject) throw new Error("❌ Subject PPS (Sem 1) not found");

  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });
  if (!admin) throw new Error("❌ Admin not found");

  /* ---------------- STUDENT (UPLOADER) ---------------- */

  const studentEmail = "student1@example.com";

  const student = await prisma.user.upsert({
    where: { email: studentEmail },
    update: {},
    create: {
      name: "Student One",
      email: studentEmail,
      password: await bcrypt.hash("Student@123", 10),
      role: "STUDENT",
      semester: 1,
      branchId: branch.id,
    },
  });

  /* ---------------- UPSERT NOTE ---------------- */

  const note = await prisma.note.upsert({
    where: {
      id: `${subject.id}-pps-unit1`, // virtual unique key
    },
    update: {},
    create: {
      id: `${subject.id}-pps-unit1`, // prevents duplication
      title: "PPS Complete Notes – Unit 1",
      semester: 1,
      fileUrl: "https://example-bucket.s3.amazonaws.com/pps-unit1.pdf",

      subject: {
        connect: { id: subject.id },
      },

      branches: {
        connect: [{ id: branch.id }],
      },

      uploadedBy: {
        connect: { id: student.id },
      },

      approvedBy: {
        connect: { id: admin.id },
      },
    },
  });

  console.log("✅ Note seeded:", note.title);
}

seedNotes()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
