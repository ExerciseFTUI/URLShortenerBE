const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");

const mime = require("mime-types");
const { storage } = require("../config/firebase");

const uploadHandler = async (req, folderName, fileName) => {
  try {
    const fileExtension = mime.extension(req.file.mimetype);
    let finalFileName = fileName;

    // If fileName is not provided, use the original file name
    if (!finalFileName || finalFileName === "") {
      const originalFileName = req.file.originalname;
      const originalFileNameWithoutExtension = originalFileName
        .split(".")
        .slice(0, -1)
        .join(".");
      fileName = originalFileNameWithoutExtension;
    }

    const storageRef = ref(
      storage,
      `${folderName}/${fileName}.${fileExtension}`
    );

    // Upload file to Firebase Cloud Storage
    await uploadBytes(storageRef, req.file.buffer);

    // Get Public URL
    const publicUrl = await getDownloadURL(storageRef);

    return publicUrl;
  } catch (error) {
    console.log(error);
    // console.error("Error uploading file:", error);
    throw error;
  }
};

module.exports = { uploadHandler };
