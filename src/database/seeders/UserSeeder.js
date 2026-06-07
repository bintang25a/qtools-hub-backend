import { User } from "../models/Model.js";
import bcrypt from "bcrypt";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function AssetSeeder() {
  const filePath = path.resolve(__dirname, "../resource/users.xlsx");
  const buf = fs.readFileSync(filePath);

  const workbook = XLSX.read(buf, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const rawData = XLSX.utils.sheet_to_json(worksheet);

  if (rawData.length === 0) {
    console.log("File Excel kosong atau tidak terbaca.");
    return;
  }

  const saltRounds = 10;

  const combinedData = [
    ...rawData.map((item) => ({
      nrp: item["NRP"],
      section: item["SECTION"],
      role: item["ROLE"],
      name: item["NAMA"],
      rawPassword: item["NRP"]?.toLowerCase(),
    })),
    {
      nrp: "251003",
      name: "Bintang Al Fizar",
      role: "planner",
      section: "IT",
      rawPassword: "IT123",
    },
    {
      nrp: "U002",
      name: "Rizky Pratama",
      role: "tool keeper",
      section: "IT",
      rawPassword: "IT123",
    },
    {
      nrp: "U003",
      name: "Dewi Anggraini",
      role: "mechanic",
      section: "IT",
      rawPassword: "IT123",
    },
  ];

  const mappedData = await Promise.all(
    combinedData.map(async (item) => ({
      nrp: item.nrp,
      section: item.section,
      role: item.role,
      name: item.name,
      password: await bcrypt.hash(item.rawPassword, saltRounds),
    }))
  );

  await User.bulkCreate(mappedData, {
    validate: true,
    ignoreDuplicates: true,
  });

  console.log("User seeding successfully");
}
