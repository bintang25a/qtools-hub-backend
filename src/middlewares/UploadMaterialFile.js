import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const publicPath = path.resolve("public");
      const materialFolder = path.join(publicPath, "materials");

      if (!fs.existsSync(materialFolder)) {
        fs.mkdirSync(materialFolder, { recursive: true });
      }

      cb(null, materialFolder);
    } catch (err) {
      cb(err);
    }
  },

  filename: (req, file, cb) => {
    const materialNumber = req.material_number;
    const fileName = `${materialNumber}${path.extname(file.originalname)}`;

    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /\.(?:pdf|pptx|ppt|doc|docx|jpg|png|jpeg)$/i;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.test(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only file pdf, pptx, ppt, doc, docx, jpg, png, jpeg allowed")
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 32 * 1024 * 1024 },
});

export default upload;
