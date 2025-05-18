"use server";

import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "../logto";
import connect from "@/lib/db";
import Attestation from "../models/Attestation";
import { handleAsync } from "@/lib/errorHandler";
import {
  DatabaseError,
  ValidationError,
  AuthenticationError,
} from "@/lib/errors";

export async function getCurrentUserAttestation() {
  const [context, error] = await handleAsync(getLogtoContext(logtoConfig));

  if (error || !context?.claims?.sub) {
    throw new AuthenticationError("User not authenticated");
  }

  const [attestation, attestationError] = await handleAsync(
    (async () => {
      await connect();
      return await Attestation.findOne({ userId: context!.claims!.sub });
    })()
  );

  if (attestationError) {
    throw new DatabaseError("Failed to fetch attestation");
  }

  return attestation;
}

export async function createAttestation(type: "physician" | "nurse") {
  const { claims } = await getLogtoContext(logtoConfig);

  if (!claims) {
    throw new ValidationError("User not authenticated");
  }

  await connect();
  // Check if attestation already exists
  const existing = await Attestation.findOne({ userId: claims!.sub });
  if (existing) {
    throw new ValidationError("Attestation already exists");
  }

  return await Attestation.create({
    userId: claims!.sub,
    type,
    attestedItems: [
      {
        item: "license_verification",
        attestedAt: new Date(),
      },
      {
        item: "malpractice_insurance",
      },
    ],
  });

}

export async function attestItem(item: string) {
  const [context, error] = await handleAsync(getLogtoContext(logtoConfig));

  if (error || !context?.claims?.sub) {
    throw new AuthenticationError("User not authenticated");
  }

  const [attestation, attestationError] = await handleAsync(
    (async () => {
      await connect();

      const attestation = await Attestation.findOne({
        userId: context!.claims!.sub,
      });
      if (!attestation) {
        throw new ValidationError("No attestation found");
      }

      // Check if item already attested
      if (
        attestation.attestedItems.some((i: { item: string }) => i.item === item)
      ) {
        throw new ValidationError("Item already attested");
      }

      attestation.attestedItems.push({
        item,
        attestedAt: new Date(),
      });

      // If all required items are attested, mark as completed
      // You can customize this logic based on your requirements
      if (
        attestation.attestedItems.length >=
        getRequiredAttestations(attestation.type).length
      ) {
        attestation.completedAt = new Date();
      }

      return await attestation.save();
    })()
  );

  if (attestationError) {
    throw new DatabaseError("Failed to attest item");
  }

  return attestation;
}

// Helper function to get required attestations based on type
function getRequiredAttestations(type: "physician" | "nurse"): string[] {
  if (type === "physician") {
    return [
      "license_verification",
      "malpractice_insurance",
      "dea_certification",
      "board_certification",
      "terms_and_conditions",
    ];
  }
  return [
    "license_verification",
    "liability_insurance",
    "certification_verification",
    "terms_and_conditions",
  ];
}
