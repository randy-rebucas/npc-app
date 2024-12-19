'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Form } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { OnboardingStep } from '@/lib/types/onboarding';
import { UserInformationForm, LicenseInformationForm, ClinicalPracticeForm, RateMatrixForm, BackgroundCertificationsForm, ProfilePhotoForm, GovernmentIdForm } from './components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOnBoardingStore } from '@/lib/store/onBoardingStore';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { checkFileType } from '@/lib/utils';
import * as z from 'zod';

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: session } = useSession();
    const router = useRouter();

    // Get the onboarding state from the store
    const onBoarding = useOnBoardingStore(state => state.onBoarding);
    const updateFields = useOnBoardingStore(state => state.updateFields);

    // Update the onboarding state with the user's email if they are logged in
    useEffect(() => {
        if (session?.user) {
            updateFields({ email: session.user.email });
        }
    }, [session, updateFields]);

    // Define the maximum file size for uploads
    const MAX_FILE_SIZE = 5000000;

    // Move ONBOARDING_STEPS into useMemo
    const ONBOARDING_STEPS: OnboardingStep[] = useMemo(() => [
        {
            id: 'user-info',
            title: 'User Information',
            description: 'Please provide your basic information',
            component: UserInformationForm,
            formSchema: z.object({
                firstName: z.string().min(2, 'First name must be at least 2 characters'),
                lastName: z.string().min(2, 'Last name must be at least 2 characters'),
                email: z.string().email('Invalid email address'),
            }),
            defaultValues: {
                firstName: onBoarding.firstName ?? '',
                lastName: onBoarding.lastName ?? '',
                email: onBoarding.email ?? '',
            },
        },
        {
            id: 'license-info',
            title: 'License Information',
            description: 'Please provide your license details',
            component: LicenseInformationForm,
            formSchema: z.object({
                medicalLicenseStates: z.array(z.string()).min(1, "At least one medical license state is required"),
                deaLicenseStates: z.array(z.string()).min(1, "At least one DEA license state is required"),
            }),
            defaultValues: {
                medicalLicenseStates: onBoarding.medicalLicenseStates ?? [],
                deaLicenseStates: onBoarding.deaLicenseStates ?? [],
            },
        },
        {
            id: 'clinical-practice',
            title: 'Clinical Practice',
            description: 'Tell us about your clinical practice',
            component: ClinicalPracticeForm,
            formSchema: z.object({
                practiceTypes: z.array(z.string()).min(1, "At least one practice type is required"),
            }),
            defaultValues: {
                practiceTypes: onBoarding.practiceTypes ?? [],
            },
        },
        {
            id: 'rate-matrix',
            title: 'Rate Matrix',
            description: 'Set your rates and availability',
            component: RateMatrixForm,
            formSchema: z.object({
                monthlyCollaborationRate: z.number().min(0, "Monthly collaboration rate must be greater than 0"),
                additionalStateFee: z.number().min(0, "Additional state fee must be greater than 0"),
                additionalNPFee: z.number().min(0, "Additional NP fee must be greater than 0"),
                controlledSubstancesMonthlyFee: z.number().min(0, "Controlled substances monthly fee must be greater than 0"),
                controlledSubstancesPerPrescriptionFee: z.number().min(0, "Controlled substances per prescription fee must be greater than 0"),
            }),
            defaultValues: {
                monthlyCollaborationRate: onBoarding.monthlyCollaborationRate ?? 0,
                additionalStateFee: onBoarding.additionalStateFee ?? 0,
                additionalNPFee: onBoarding.additionalNPFee ?? 0,
                controlledSubstancesMonthlyFee: onBoarding.controlledSubstancesMonthlyFee ?? 0,
                controlledSubstancesPerPrescriptionFee: onBoarding.controlledSubstancesPerPrescriptionFee ?? 0,
            },
        },
        {
            id: 'background-certifications',
            title: 'Background & Certifications',
            description: 'Upload your certifications and background information',
            component: BackgroundCertificationsForm,
            formSchema: z.object({
                description: z.string().min(10, "Description must be at least 10 characters"),
                boardCertification: z.string().min(10, "Board certification must be at least 10 characters"),
                additionalCertifications: z.array(z.string()).min(1, "At least one additional certification is required"),
                linkedinProfile: z.string().url("Invalid LinkedIn profile URL"),
            }),
            defaultValues: {
                description: onBoarding.description ?? '',
                boardCertification: onBoarding.boardCertification ?? '',
                additionalCertifications: onBoarding.additionalCertifications ?? [],
                linkedinProfile: onBoarding.linkedinProfile ?? '',
            },
        },
        {
            id: 'profile-photo',
            title: 'Profile Photo',
            description: 'Upload your professional photo',
            component: ProfilePhotoForm,
            formSchema: z.object({
                profilePhotoUrl: z.any()
                    .refine((file: File) => file != null, "Profile Photo is required")
                    .refine((file) => file.size < MAX_FILE_SIZE, "Max size is 5MB.")
                    .refine((file) => checkFileType(file), "Only .jpg, .jpeg, .png formats are supported."),
            }),
            defaultValues: {
                profilePhotoUrl: onBoarding.profilePhotoUrl ?? null,
            },
        },
        {
            id: 'government-id',
            title: 'Government ID',
            description: 'Provide your government identification',
            component: GovernmentIdForm,
            formSchema: z.object({
                governmentIdUrl: z.any()
                    .refine((file: File) => file != null, "Government ID is required")
                    .refine((file) => file.size < MAX_FILE_SIZE, "Max size is 5MB.")
                    .refine((file) => checkFileType(file), "Only .jpg, .jpeg, .png formats are supported."),
            }),
            defaultValues: {
                governmentIdUrl: onBoarding.governmentIdUrl ?? null,
            },
        },
    ] as const, [onBoarding]);

    // First, create a union type of all possible schemas
    type FormSchema = z.infer<(typeof ONBOARDING_STEPS)[number]['formSchema']>;

    // Create the form with the current step's schema and default values
    const form = useForm<FormSchema>({
        resolver: zodResolver(ONBOARDING_STEPS[currentStep].formSchema),
        defaultValues: ONBOARDING_STEPS[currentStep].defaultValues,
        mode: 'onChange',
    });

    // Add useEffect to update form when onBoarding state changes
    useEffect(() => {
        // Reset form with new values from onBoarding state
        const currentStepDefaults = {
            ...ONBOARDING_STEPS[currentStep].defaultValues,
            ...onBoarding // Merge with current onBoarding state
        };
        form.reset(currentStepDefaults);
    }, [onBoarding, currentStep, form, ONBOARDING_STEPS]);

    // Get the component for the current step
    const CurrentStepComponent = ONBOARDING_STEPS[currentStep].component;

    // Calculate the progress percentage
    const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

    // Check if the current step is the last step
    const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

    // Handle form submission
    const onSubmit = async () => {
        const currentFormData = form.getValues();

        // Update the store with the current step's data
        useOnBoardingStore.getState().updateFields({
            ...onBoarding,
            ...currentFormData
        });

        // If not the last step, move to the next step
        if (!isLastStep) {
            setCurrentStep(prev => {
                if (prev >= ONBOARDING_STEPS.length - 1) return prev;
                return prev + 1;
            });
            form.reset(ONBOARDING_STEPS[currentStep + 1].defaultValues);
            return;
        }

        try {
            // Set the submitting state to true
            setIsSubmitting(true);

            // Create a FormData object to send the data to the server
            const formData = new FormData();

            // Get the final data from the store
            const finalData = useOnBoardingStore.getState().onBoarding;

            // Loop through the final data and append it to the formData object
            Object.entries(finalData).forEach(([key, value]) => {
                if (value instanceof File) {
                    formData.append(key, value);
                } else if (value !== null && value !== undefined) {
                    formData.append(key, String(value));
                }
            });

            // Log the formData object
            console.log(formData);

            // Send the formData to the server
            const response = await fetch('/api/onboarding', {
                method: 'POST',
                body: formData,
            });

            // Check if the response is ok
            if (!response.ok) throw new Error('Submission failed');

            // Show a success toast
            toast({
                title: "Success!",
                description: "Your onboarding information has been submitted.",
            });

            // Redirect to the home page
            router.push('/');
        } catch (error) {
            console.error('Error:', error);

            // Show an error toast
            toast({
                title: "Error",
                description: "Failed to submit form. Please try again.",
                variant: "destructive",
            });
        } finally {
            // Set the submitting state to false
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-10">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card className="p-6">
                        <CardHeader>
                            <Progress value={progress} className="mb-4" />
                            <CardTitle>
                                {ONBOARDING_STEPS[currentStep].title}
                                <span className="text-sm text-muted-foreground">
                                    (Step {currentStep + 1} of {ONBOARDING_STEPS.length})
                                </span>
                            </CardTitle>
                            <CardDescription>
                                {ONBOARDING_STEPS[currentStep].description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <CurrentStepComponent
                                key={currentStep}
                                form={form}
                            />
                        </CardContent>

                        <CardFooter className="flex justify-between">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(prev => {
                                    if (prev <= 0) return prev;
                                    return prev - 1;
                                })}
                            >
                                {currentStep === 0 ? 'Start' : 'Previous'}
                            </Button>

                            <Button type='submit' disabled={isSubmitting}>
                                {isLastStep ? 'Submit' : 'Next'}
                            </Button>

                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
