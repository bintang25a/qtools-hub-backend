import { User } from "../models/Model.js";
import bcrypt from "bcrypt";

export default async function UserSeeder() {
  const saltRounds = 10;

  const hash = async (plain) => await bcrypt.hash(plain, saltRounds);

  const users = [
    // 1 Admin
    {
      uid: "251003",
      name: "Bintang Al Fizar",
      email: "bintangalfizar25@gmail.com",
      phone_number: "082111710709",
      role: "admin",
    },

    // 3 Asisten
    {
      uid: "U002",
      name: "Rizky Pratama",
      email: "rizky@example.com",
      phone_number: "081234567891",
      role: "asisten",
    },
    {
      uid: "U003",
      name: "Dewi Anggraini",
      email: "dewi@example.com",
      phone_number: "081234567892",
      role: "asisten",
    },
    {
      uid: "U004",
      name: "Rama Kurniawan",
      email: "rama@example.com",
      phone_number: "081234567893",
      role: "asisten",
    },

    // 16 Praktikan
    {
      uid: "U005",
      name: "Aulia Rahman",
      email: "aulia@example.com",
      phone_number: "081234567894",
      role: "praktikan",
    },
    {
      uid: "U006",
      name: "Nadia Putri",
      email: "nadia@example.com",
      phone_number: "081234567895",
      role: "praktikan",
    },
    {
      uid: "U007",
      name: "Fajar Hidayat",
      email: "fajar@example.com",
      phone_number: "081234567896",
      role: "praktikan",
    },
    {
      uid: "U008",
      name: "Rafi Ramadhan",
      email: "rafi@example.com",
      phone_number: "081234567897",
      role: "praktikan",
    },
    {
      uid: "U009",
      name: "Indah Lestari",
      email: "indah@example.com",
      phone_number: "081234567898",
      role: "praktikan",
    },
    {
      uid: "U010",
      name: "Dian Saputra",
      email: "dian@example.com",
      phone_number: "081234567899",
      role: "praktikan",
    },
    {
      uid: "U011",
      name: "Andi Firmansyah",
      email: "andi@example.com",
      phone_number: "081234567800",
      role: "praktikan",
    },
    {
      uid: "U012",
      name: "Bella Sari",
      email: "bella@example.com",
      phone_number: "081234567801",
      role: "praktikan",
    },
    {
      uid: "U013",
      name: "Putra Santoso",
      email: "putra@example.com",
      phone_number: "081234567802",
      role: "praktikan",
    },
    {
      uid: "U014",
      name: "Lina Marlina",
      email: "lina@example.com",
      phone_number: "081234567803",
      role: "praktikan",
    },
    {
      uid: "U015",
      name: "Danu Setiawan",
      email: "danu@example.com",
      phone_number: "081234567804",
      role: "praktikan",
    },
    {
      uid: "U016",
      name: "Tika Salsabila",
      email: "tika@example.com",
      phone_number: "081234567805",
      role: "praktikan",
    },
    {
      uid: "U017",
      name: "Yoga Pratama",
      email: "yoga@example.com",
      phone_number: "081234567806",
      role: "praktikan",
    },
    {
      uid: "U018",
      name: "Adit Nugraha",
      email: "adit@example.com",
      phone_number: "081234567807",
      role: "praktikan",
    },
    {
      uid: "U019",
      name: "Sari Utami",
      email: "sari@example.com",
      phone_number: "081234567808",
      role: "praktikan",
    },
    {
      uid: "U020",
      name: "Bima Prakoso",
      email: "bima@example.com",
      phone_number: "081234567809",
      role: "praktikan",
    },
  ];

  for (const user of users) {
    user.password = await hash("password123");
  }

  await User.bulkCreate(users);
  console.log("User seeding successfully");
}
