'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { OnboardingFormData } from '@/lib/types/onboarding';
import { UserInformationForm, LicenseInformationForm, ClinicalPracticeForm, RateMatrixForm, BackgroundCertificationsForm, ProfilePhotoForm, GovernmentIdForm } from './components';
import { Form } from '@/components/ui/form';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useOnBoardingStore } from '@/lib/store/onBoardingStore';


export default function OnboardingPage() {

    const onBoarding = useOnBoardingStore(state => state.onBoarding);

    type OnboardingStep = {
        id: string;
        title: string;
        description: string;
        component: React.ComponentType<{ form: UseFormReturn<OnboardingFormData> }>;
        formSchema: z.ZodSchema;
        defaultValues: Partial<OnboardingFormData>;
    };

    // Define steps configuration
    const ONBOARDING_STEPS: OnboardingStep[] = [
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
                medicalLicenseStates: z.array(z.string()),
                deaLicenseStates: z.array(z.string()),
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
                practiceTypes: z.array(z.string()),
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
                monthlyCollaborationRate: z.number(),
                additionalStateFee: z.number(),
                additionalNPFee: z.number(),
                controlledSubstancesMonthlyFee: z.number(),
                controlledSubstancesPerPrescriptionFee: z.number(),
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
                description: z.string(),
                boardCertification: z.string(),
                additionalCertifications: z.array(z.string()),
                linkedinProfile: z.string(),
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
                profilePhotoUrl: z.string(),
            }),
            defaultValues: {
                profilePhotoUrl: onBoarding.profilePhotoUrl ?? '',
            },
        },
        {
            id: 'government-id',
            title: 'Government ID',
            description: 'Provide your government identification',
            component: GovernmentIdForm,
            formSchema: z.object({
                governmentIdUrl: z.string(),
            }),
            defaultValues: {
                governmentIdUrl: onBoarding.governmentIdUrl ?? '',
            },
        },
    ] as const;

    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const isFirstStep = currentStep === 0;
    // const isStepValid = formData.isValid[currentStep];

    // First, create a union type of all possible schemas
    type FormSchema = z.infer<(typeof ONBOARDING_STEPS)[number]['formSchema']>;

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
    }, [onBoarding, currentStep, form]);

    const CurrentStepComponent = ONBOARDING_STEPS[currentStep].component;
    const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;
    const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

    const onSubmit = async () => {
        const currentFormData = form.getValues();

        // Update the store with the current step's data
        useOnBoardingStore.getState().updateFields({
            ...onBoarding,
            ...currentFormData
        });

        if (!isLastStep) {
            setCurrentStep(prev => prev + 1);
            form.reset(ONBOARDING_STEPS[currentStep + 1].defaultValues);
            return;
        }

        try {
            setIsSubmitting(true);
            const finalData = useOnBoardingStore.getState()

            const response = await fetch('/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });

            if (!response.ok) throw new Error('Submission failed');

            toast({
                title: "Success!",
                description: "Your onboarding information has been submitted.",
            });
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: "Error",
                description: "Failed to submit form. Please try again.",
                variant: "destructive",
            });
        } finally {
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
                                    console.log(prev);
                                    if (prev === 0) return prev;
                                    return prev - 1;
                                })}
                                disabled={currentStep === 0 || isSubmitting}
                            >
                                Previous
                            </Button>

                            <Button type='submit'>
                                Next
                            </Button>

                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
