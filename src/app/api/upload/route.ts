import { unlink, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filepath = path.join(uploadDir, filename);

    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Write file to public/uploads
    await writeFile(filepath, buffer);

    // Return the public URL
    return NextResponse.json({
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();
    // 1734755780883-photo-1633332755192-727a05c4013d.jpeg
    const filename = data.path.split("/")[2];

    // public/uploads/1734755780883-photo-1633332755192-727a05c4013d.jpeg
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filepath = path.join(uploadDir, filename);

    // Check if file exists before attempting to delete
    const fileExists = await fs
      .access(filepath)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    } else {
      // unlink public/uploads/1734755780883-photo-1633332755192-727a05c4013d.jpeg
      await unlink(filepath);
      console.log("File found and deleted");
    }

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Error deleting file" }, { status: 500 });
  }
}
