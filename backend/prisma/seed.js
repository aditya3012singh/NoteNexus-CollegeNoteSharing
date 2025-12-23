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


async function main() {
  // 1️⃣ Find any existing branch (admin still needs branch + semester)
  const branch = await prisma.branch.findFirst();

  if (!branch) {
    throw new Error("❌ No branch found. Please seed Branch first.");
  }

  // 2️⃣ Hash password
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  // 3️⃣ Create admin (skip if already exists)
  const adminEmail = "admin@example.com";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("⚠️ Admin already exists:", existingAdmin.email);
    return;
  }

  const admin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      semester: 0, // Admin doesn’t belong to a semester
      branchId: branch.id,
    },
  });

  console.log("✅ Admin created successfully:");
  console.log({
    email: admin.email,
    role: admin.role,
  });
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });