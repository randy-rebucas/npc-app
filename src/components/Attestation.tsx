'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';  
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { getCurrentUserAttestation, createAttestation, attestItem } from '@/app/actions/attestation';
import { toast } from "sonner";
import { IAttestation } from '@/app/models/Attestation';

interface AttestationProps {
  type: 'physician' | 'nurse';
}

export default function Attestation({ type }: AttestationProps) {
  const [attestation, setAttestation] = useState<IAttestation | null>(null);
  const [loading, setLoading] = useState(true);   

  const requiredAttestations = type === 'physician' ? [
    { id: 'license_verification', label: 'I verify that my medical license is current and in good standing' },
    { id: 'malpractice_insurance', label: 'I have active malpractice insurance coverage' },
    { id: 'dea_certification', label: 'I have a valid DEA certification' },
    { id: 'board_certification', label: 'I am board certified in my specialty' },
    { id: 'terms_and_conditions', label: 'I agree to the terms and conditions' },
  ] : [
    { id: 'license_verification', label: 'I verify that my nursing license is current and in good standing' },
    { id: 'liability_insurance', label: 'I have active liability insurance coverage' },
    { id: 'certification_verification', label: 'I verify my certifications are current' },
    { id: 'terms_and_conditions', label: 'I agree to the terms and conditions' },
  ];

  useEffect(() => {
    loadAttestation();
  }, []);

  const loadAttestation = async () => {
    try {
      const data = await getCurrentUserAttestation();
      setAttestation(data);
    } catch (error) {
      console.error('Failed to load attestation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAttestation = async () => {
    try {
      const data = await createAttestation(type);
      setAttestation(data);
      toast.success('Attestation Started', {
        description: 'Please complete all required attestations.',
      });
    } catch (error) {
      console.error('Failed to start attestation process:', error);
      toast.error('Failed to start attestation process.', {
        description: 'Please try again.',
      });
    }
  };

  const handleAttestItem = async (itemId: string) => {
    try {
      const data = await attestItem(itemId);
      setAttestation(data);
      toast.success('Item Attested', {
        description: 'Successfully recorded your attestation.',
      });
    } catch (error) {
      console.error('Failed to record attestation:', error);
      toast.error('Failed to record attestation.', {
        description: 'Please try again.',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!attestation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Required Attestations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Please start the attestation process to continue.</p>
          <Button onClick={handleCreateAttestation}>Start Attestation</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Required Attestations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requiredAttestations.map((item) => {
            const isAttested = attestation.attestedItems.some(
              (a: { item: string; attestedAt: Date }) => a.item === item.id
            );
            return (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={item.id}
                  checked={isAttested}
                  onCheckedChange={() => !isAttested && handleAttestItem(item.id)}
                  disabled={isAttested}
                />
                <label
                  htmlFor={item.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item.label}
                </label>
              </div>
            );
          })}
        </div>
        {attestation.completedAt && (
          <p className="mt-4 text-sm text-green-600">
            Attestation completed on{' '}
            {new Date(attestation.completedAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
} 