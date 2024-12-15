import mongoose, { Schema } from "mongoose";

export interface IOnboarding {
  step: number;
  completed: boolean;
}

const onboardingSchema = new Schema<IOnboarding>({
  step: Number,
  completed: Boolean,
});

const Onboarding =
  mongoose.models.Onboarding ??
  mongoose.model<IOnboarding>("Onboarding", onboardingSchema);

export default Onboarding;
