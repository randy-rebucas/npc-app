'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UserInformationForm from './components/UserInformationForm';
import LicenseInformationForm from './components/LicenseInformationForm';
import ClinicalPracticeForm from './components/ClinicalPracticeForm';
import RateMatrixForm from './components/RateMatrixForm';
import BackgroundCertificationsForm from './components/BackgroundCertificationsForm';
import ProfilePhotoForm from './components/ProfilePhotoForm';
import GovernmentIdForm from './components/GovernmentIdForm';
import { OnboardingFormData } from '@/lib/types/onboarding';

const steps = [
    'User Information',
    'License Information',
    'Clinical Practice Types',
    'Rate Matrix',
    'Background & Certifications',
    'Profile Photo',
    'Government ID',
];

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<OnboardingFormData>({
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
    });

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const updateFormData = (data: Partial<OnboardingFormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <UserInformationForm data={formData} updateData={updateFormData} />;
            case 1:
                return <LicenseInformationForm data={formData} updateData={updateFormData} />;
            case 2:
                return <ClinicalPracticeForm data={formData} updateData={updateFormData} />;
            case 3:
                return <RateMatrixForm data={formData} updateData={updateFormData} />;
            case 4:
                return <BackgroundCertificationsForm data={formData} updateData={updateFormData} />;
            case 5:
                return <ProfilePhotoForm data={formData} updateData={updateFormData} />;
            case 6:
                return <GovernmentIdForm data={formData} updateData={updateFormData} />;
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto py-10">
            <Card className="p-6">
                <CardHeader>
                    <CardTitle>
                        {steps[currentStep]} <span className="text-sm text-muted-foreground">({currentStep + 1} out of {steps.length})</span>
                    </CardTitle>
                    <CardDescription>
                        {steps[currentStep]}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {renderStep()}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={currentStep === steps.length - 1}
                    >
                        Next
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
