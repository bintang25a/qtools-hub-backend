import { Assignment, Material } from "../../database/models/Model.js";

export const generateAssignmentNumber = async (req, res, next) => {
  try {
    const { class_code, assignment_number: paramNumber } = req.params;

    if (paramNumber) {
      req.assignment_number = paramNumber;
      return next();
    }

    const assignmentCount = await Assignment.count({
      where: { class_code },
    });

    const nextNumber = assignmentCount + 1;

    const newAssignmentNumber = `${class_code}-${String(nextNumber).padStart(
      2,
      "0"
    )}`;

    req.assignment_number = newAssignmentNumber;
    next();
  } catch (error) {
    console.error("Error generating assignment number:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const generateMaterialNumber = async (req, res, next) => {
  try {
    const dateNumber = new Date().toISOString().replace(/[-:.TZ]/g, "");
    const newAssignmentNumber = String(dateNumber);

    req.material_number = newAssignmentNumber;
    next();
  } catch (error) {
    console.error("Error generating material number:", error);
    res.status(500).json({ message: "Failed to generate material number" });
  }
};

export const generateSubmissionNumber = async (req, res, next) => {
  try {
    const dateNumber = new Date().toISOString().replace(/[-:.TZ]/g, "");
    const idNumber = req.uid;

    req.submission_number = `${idNumber}-${dateNumber}`;
    next();
  } catch (error) {
    console.error("Error generating submission number:", error);
    res.status(500).json({ message: "Failed to generate submission number" });
  }
};
