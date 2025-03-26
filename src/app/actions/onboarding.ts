import { OnboardingFormData } from "@/lib/types/onboarding";

export async function createOnboarding(userId: string, onboarding: OnboardingFormData) {
    console.log(onboarding);
//   const { data, error } = await supabase.from('onboarding').insert(onboarding).select();
//   if (error) {
//     throw new Error(error.message);
//   }
//   return data;
}

// export async function getOnboarding(id: string) {
//     const { data, error } = await supabase.from('onboarding').select('*').eq('id', id).single();
//     if (error) {
//         throw new Error(error.message);
//     }
//     return data;
// }