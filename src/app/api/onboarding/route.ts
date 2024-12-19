import UserProfile from "@/app/models/UserProfile";
import User from "@/app/models/User";
import { writeFile } from "fs/promises";
import path from "path";
import connect from "@/lib/db";
import bcrypt from "bcrypt";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    await connect();

    // Convert the request to form data
    const formData = await request.formData();
    const fields = new Map();

    // Process all form fields
    for (const [fieldName, value] of formData.entries()) {
      if (fieldName === "profilePhotoUrl" || fieldName === "governmentIdUrl") {
        const file = value as File;

        // Create unique filename
        const timestamp = Date.now();
        const filename = `${fieldName}-${timestamp}${path.extname(file.name)}`;
        const uploadDir = path.join(process.cwd(), "public/uploads");
        const filepath = path.join(uploadDir, filename);

        // Convert file to Buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save file to uploads directory
        await writeFile(filepath, buffer);

        // Store the relative path in the database
        fields.set(fieldName, `/uploads/${filename}`);
      } else {
        fields.set(fieldName, value);
      }
    }

    // Generate random password (12 characters)
    const generatePassword = () => {
      const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
      return Array.from(crypto.getRandomValues(new Uint32Array(12)))
        .map((x) => chars[x % chars.length])
        .join("");
    };
    const plainPassword = generatePassword();

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    const user = new User({
      username: fields.get("email").split("@")[0],
      email: fields.get("email"),
      password: hashedPassword,
      onboardingStatus: "completed",
    });

    const userResponse = await user.save();

    const userProfile = new UserProfile({
      firstName: fields.get("firstName"),
      lastName: fields.get("lastName"),
      medicalLicenseStates: fields.get("medicalLicenseStates"),
      deaLicenseStates: fields.get("deaLicenseStates"),
      practiceTypes: fields.get("practiceTypes"),
      monthlyCollaborationRate: fields.get("monthlyCollaborationRate"),
      additionalStateFee: fields.get("additionalStateFee"),
      additionalNPFee: fields.get("additionalNPFee"),
      controlledSubstancesMonthlyFee: fields.get(
        "controlledSubstancesMonthlyFee"
      ),
      controlledSubstancesPerPrescriptionFee: fields.get(
        "controlledSubstancesPerPrescriptionFee"
      ),
      description: fields.get("description"),
      boardCertification: fields.get("boardCertification"),
      additionalCertifications: fields.get("additionalCertifications"),
      linkedinProfile: fields.get("linkedinProfile"),
      profilePhotoUrl: fields.get("profilePhotoUrl"),
      governmentIdUrl: fields.get("governmentIdUrl"),
      user: userResponse._id.toString(),
    });

    const userProfileResponse = await userProfile.save();

    return Response.json({ userProfileResponse });
  } catch (error) {
    console.error("Error in onboarding:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
