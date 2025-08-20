import multer from "multer";

const storage = multer.memoryStorage();

export const multipleUpload = multer({ storage }).fields([
  { name: "file", maxCount: 4 },
]);
