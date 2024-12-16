'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { OnboardingFormData } from '@/lib/types/onboarding';
import { UserInformationForm, LicenseInformationForm, ClinicalPracticeForm, RateMatrixForm, BackgroundCertificationsForm, ProfilePhotoForm, GovernmentIdForm } from './components';

// Define steps configuration
const ONBOARDING_STEPS = [
    {
        id: 'user-info',
        title: 'User Information',
        description: 'Please provide your basic information',
        component: UserInformationForm,
    },
    {
        id: 'license-info',
        title: 'License Information',
        description: 'Please provide your license details',
        component: LicenseInformationForm,
    },
    {
        id: 'clinical-practice',
        title: 'Clinical Practice',
        description: 'Tell us about your clinical practice',
        component: ClinicalPracticeForm,
    },
    {
        id: 'rate-matrix',
        title: 'Rate Matrix',
        description: 'Set your rates and availability',
        component: RateMatrixForm,
    },
    {
        id: 'background-certifications',
        title: 'Background & Certifications',
        description: 'Upload your certifications and background information',
        component: BackgroundCertificationsForm,
    },
    {
        id: 'profile-photo',
        title: 'Profile Photo',
        description: 'Upload your professional photo',
        component: ProfilePhotoForm,
    },
    {
        id: 'government-id',
        title: 'Government ID',
        description: 'Provide your government identification',
        component: GovernmentIdForm,
    },
] as const;

const initialFormData: OnboardingFormData & { isValid: boolean[] } = {
    firstName: '',
    lastName: '',
    email: '',

    medicalLicenseStates: [],
    deaLicenseStates: [],

    practiceTypes: [],

    monthlyCollaborationRate: 0,
    additionalStateFee: 0,
    additionalNPFee: 0,
    controlledSubstancesMonthlyFee: 0,
    controlledSubstancesPerPrescriptionFee: 0,

    description: '',
    boardCertification: '',
    additionalCertifications: [],
    linkedinProfile: '',

    profilePhotoUrl: '',

    governmentIdUrl: '',

    isValid: new Array(ONBOARDING_STEPS.length).fill(false),
};

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(initialFormData);

    const updateFormData = (
        data: Partial<OnboardingFormData>,
        isValid?: boolean
    ) => {
        setFormData(prev => {
            // Only update if there are actual changes
            const newIsValid = isValid !== undefined
                ? prev.isValid.map((v, i) => i === currentStep ? isValid : v)
                : prev.isValid;
            
            const newData = {
                ...prev,
                ...data,
                isValid: newIsValid
            };

            // Only update if there are actual changes
            if (JSON.stringify(newData) === JSON.stringify(prev)) {
                return prev;
            }

            return newData;
        });
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            const response = await fetch('/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
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

    const CurrentStepComponent = ONBOARDING_STEPS[currentStep].component;
    const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;
    const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
    const isStepValid = formData.isValid[currentStep];

    return (
        <div className="container mx-auto py-10">
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
                        data={formData}
                        updateData={updateFormData}
                        currentStep={currentStep}
                        setIsValid={(isValid) => {
                            if (formData.isValid[currentStep] !== isValid) {
                                updateFormData({}, isValid);
                            }
                        }}
                    />
                </CardContent>

                <CardFooter className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        disabled={currentStep === 0 || isSubmitting}
                    >
                        Previous
                    </Button>

                    {isLastStep ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={!isStepValid || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : 'Submit'}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setCurrentStep(prev => prev + 1)}
                            disabled={!isStepValid}
                        >
                            Next
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
