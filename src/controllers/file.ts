import { Request, Response } from "express";
import prisma from "../utils/database";

export const uploadFileController = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    // Check if file is provided
    if (file === undefined) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    // File upload successful

    // Logic to save the file information to the database or perform any other operations
    const uploadedFile = await prisma.file.create({
      data: {
        userId: req.user.id, // Assuming you have user ID from authentication middleware
        originalFilename: file.originalname,
        storagePath: `/uploads/${file.filename}`, // Path to the file in your storage
        title: file.originalname,
        description: "File uploaded successfully",
      },
    });

    if (!uploadedFile) {
      res.status(500).json({ message: "Failed to save file information" });
      return;
    }

    // now that the file is uploaded, you can perform any additional operations
    // add a message in the bullmq queue
    // to process the file asynchronously

    // You can also return the file information or any other relevant data

    res.status(200).json({
      message: "File uploaded successfully",
      data: {
        id: uploadedFile.id,
        status: uploadedFile.status,
      },
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getFileByIdController = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.id;

    // Logic to retrieve the file by ID from the database or storage
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });

    // Check if the file exists

    if (!file) {
      res.status(404).json({ message: "File not found" });
      return;
    }

    // check if the file was uploaded by the current user
    if (file.userId !== req.user.id) {
      res
        .status(403)
        .json({ message: "You are not authorized to access this file" });
      return;
    }

    // File retrieval successful
    res.status(200).json({
      message: "File retrieved successfully",
      file,
    });
  } catch (error) {
    console.error("Error retrieving file:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
