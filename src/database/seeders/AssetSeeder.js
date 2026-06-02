import { Asset } from "../models/Model.js";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function AssetSeeder() {
  const filePath = path.resolve(__dirname, "../resource/assets.xlsx");
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
    asset_number: item["ASSET NO"],
    class: item["CLASS"],
    description: item["ASSET DESCRIPTION"],
    status: item["STATUS"],
    location: item["LOCATION"],
    district: item["DISTRICT"],
  }));

  await Asset.bulkCreate(mappedData, {
    validate: true,
    ignoreDuplicates: true,
  });

  console.log("Asset seeding successfully");
}
