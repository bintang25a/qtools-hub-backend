import { Tool } from "../models/Model.js";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function ToolSeeder() {
  const filePath = path.resolve(__dirname, "../resource/tools.xlsx");
  const buf = fs.readFileSync(filePath);

  const workbook = XLSX.read(buf, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const rawData = XLSX.utils.sheet_to_json(worksheet);

  if (rawData.length === 0) {
    console.log("File Excel kosong atau tidak terbaca.");
    return;
  }

  const mappedData = rawData.map((item) => ({
    tool_number: item["CODE"],
    name: item["NAMA ALAT"],
    specification: item["SPESIFIKASI"],
    stock_code: item["NUMBER"],
  }));

  await Tool.bulkCreate(mappedData, {
    validate: true,
    ignoreDuplicates: true,
  });

  console.log("Tool seeding successfully");
}
