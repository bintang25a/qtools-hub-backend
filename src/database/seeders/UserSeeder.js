import { User } from "../models/Model.js";
import bcrypt from "bcrypt";

export default async function UserSeeder() {
  const saltRounds = 10;

  const hash = async (plain) => await bcrypt.hash(plain, saltRounds);

  const users = [
    // 1 Admin
    {
      nrp: "251003",
      name: "Bintang Al Fizar",
      role: "planner",
    },

    // 3 Tool Keeper
    {
      nrp: "U002",
      name: "Rizky Pratama",
      role: "tool keeper",
    },
    {
      nrp: "U003",
      name: "Dewi Anggraini",
      role: "tool keeper",
    },
    {
      nrp: "U004",
      name: "Rama Kurniawan",
      role: "tool keeper",
    },

    // 16 Mechanic
    {
      nrp: "U005",
      name: "Aulia Rahman",
      role: "mechanic",
    },
    {
      nrp: "U006",
      name: "Nadia Putri",
      role: "mechanic",
    },
    {
      nrp: "U007",
      name: "Fajar Hidayat",
      role: "mechanic",
    },
    {
      nrp: "U008",
      name: "Rafi Ramadhan",
      role: "mechanic",
    },
    {
      nrp: "U009",
      name: "Indah Lestari",
      role: "mechanic",
    },
    {
      nrp: "U010",
      name: "Dian Saputra",
      role: "mechanic",
    },
    {
      nrp: "U011",
      name: "Andi Firmansyah",
      role: "mechanic",
    },
    {
      nrp: "U012",
      name: "Bella Sari",
      role: "mechanic",
    },
    {
      nrp: "U013",
      name: "Putra Santoso",
      role: "mechanic",
    },
    {
      nrp: "U014",
      name: "Lina Marlina",
      role: "mechanic",
    },
    {
      nrp: "U015",
      name: "Danu Setiawan",
      role: "mechanic",
    },
    {
      nrp: "U016",
      name: "Tika Salsabila",
      role: "mechanic",
    },
    {
      nrp: "U017",
      name: "Yoga Pratama",
      role: "mechanic",
    },
    {
      nrp: "U018",
      name: "Adit Nugraha",
      role: "mechanic",
    },
    {
      nrp: "U019",
      name: "Sari Utami",
      role: "mechanic",
    },
    {
      nrp: "U020",
      name: "Bima Prakoso",
      role: "mechanic",
    },
  ];

  for (const user of users) {
    user.password = await hash("password123");
  }

  await User.bulkCreate(users);
  console.log("User seeding successfully");
}
