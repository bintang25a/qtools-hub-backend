import db from "../../config/database.js";
import User from "./User.js";
import { DataTypes } from "sequelize";

// User.belongsToMany(Classroom, {
//   through: StudentClassroom,
//   foreignKey: "uid",
//   otherKey: "class_code",
//   as: "classrooms",
// });
// User.belongsToMany(Classroom, {
//   through: AssistantClassroom,
//   foreignKey: "uid",
//   otherKey: "class_code",
//   as: "assists",
// });

// Classroom.belongsToMany(User, {
//   through: StudentClassroom,
//   foreignKey: "class_code",
//   otherKey: "uid",
//   as: "students",
// });
// Classroom.belongsToMany(User, {
//   through: AssistantClassroom,
//   foreignKey: "class_code",
//   otherKey: "uid",
//   as: "assistants",
// });
// Classroom.belongsToMany(Material, {
//   through: MaterialClassroom,
//   foreignKey: "class_code",
//   otherKey: "material_number",
//   as: "materials",
// });
// Classroom.hasMany(Assignment, {
//   foreignKey: "class_code",
//   sourceKey: "class_code",
//   as: "assignments",
// });

// AssistantClassroom.belongsTo(User, {
//   foreignKey: "uid",
//   as: "user",
// });
// AssistantClassroom.belongsTo(Classroom, {
//   foreignKey: "class_code",
//   as: "classroom",
// });

// StudentClassroom.belongsTo(User, {
//   foreignKey: "uid",
//   as: "user",
// });
// StudentClassroom.belongsTo(Classroom, {
//   foreignKey: "class_code",
//   as: "classroom",
// });

// MaterialClassroom.belongsTo(Material, {
//   foreignKey: "material_number",
//   as: "material",
// });
// MaterialClassroom.belongsTo(Classroom, {
//   foreignKey: "class_code",
//   as: "classroom",
// });

// Material.belongsToMany(Classroom, {
//   through: MaterialClassroom,
//   foreignKey: "material_number",
//   otherKey: "class_code",
//   as: "classrooms",
// });

// Assignment.belongsTo(User, {
//   foreignKey: "assistant_uid",
//   sourceKey: "uid",
//   as: "assistant",
// });
// Assignment.belongsTo(Classroom, {
//   foreignKey: "class_code",
//   sourceKey: "class_code",
//   as: "classroom",
// });
// Assignment.hasMany(Testcase, {
//   foreignKey: "assignment_number",
//   sourceKey: "assignment_number",
//   as: "testcases",
// });
// Assignment.hasMany(Submission, {
//   foreignKey: "assignment_number",
//   sourceKey: "assignment_number",
//   as: "submissions",
// });

// Testcase.belongsTo(Assignment, {
//   foreignKey: "assignment_number",
//   sourceKey: "assignment_number",
//   as: "assignment",
// });

// Submission.belongsTo(User, {
//   foreignKey: "student_uid",
//   sourceKey: "uid",
//   as: "student",
// });
// Submission.belongsTo(User, {
//   foreignKey: "assistant_uid",
//   sourceKey: "uid",
//   as: "assistant",
// });
// Submission.belongsTo(Assignment, {
//   foreignKey: "assignment_number",
//   sourceKey: "assignment_number",
//   as: "assignment",
// });

const Setting = db.define("settings", {
  key: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

const Token = db.define("tokens", {
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expiredAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export { db, User, Token, Setting };
