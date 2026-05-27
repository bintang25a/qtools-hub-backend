import multer from "multer";
import path from "path";
import fs from "fs";
import { Assignment } from "../../database/models/Model.js";

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const publicPath = path.resolve("public");

      let codeNumber = req.assignment_number;

      if (!req.assignment_number && req.params.assignment_number) {
        const assignment = await Assignment.findOne({
          where: {
            assignment_number: req.params.assignment_number,
          },
        });

        if (!assignment) {
          cb(new Error("Assignment not found"));
        }

        codeNumber = req.params.assignment_number;
      }

      const classFolder = path.join(publicPath, "assignments", codeNumber);

      if (!fs.existsSync(classFolder)) {
        fs.mkdirSync(classFolder, { recursive: true });
      }

      cb(null, classFolder);
    } catch (err) {
      cb(err);
    }
  },

  filename: (req, file, cb) => {
    const identifier =
      req.role != "Praktikan" ? "answer_key" : req.uid || undefined;
    const fileName = `${identifier}${path.extname(file.originalname)}`;

    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /\.(?:c|cpp|java|py|zip|rar|pdf)$/i;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only file c, cpp, java, py, zip, rar, pdf allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default upload;
