'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import SignaturePad from '@/components/SignaturePad';

export default function SignPDFPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSignatureSave = (data: string) => {
    setSignatureData(data);
  };

  const signPDF = async () => {
    if (!pdfFile || !signatureData) return;

    try {
      // Load the PDF
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // Convert signature to image
      const signatureImage = await pdfDoc.embedPng(signatureData);

      // Get the first page
      const page = pdfDoc.getPages()[0];
      const { width } = page.getSize();

      // Add signature to the bottom right of the page
      page.drawImage(signatureImage, {
        x: width - 140,
        y: 50,
        width: 140,
        height: 60,
      });

      // Save the PDF
      const signedPdfBytes = await pdfDoc.save();

      // Create download link
      const blob = new Blob([signedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'signed-document.pdf';
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error signing PDF:', error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Sign PDF Document</h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl mb-4">1. Upload PDF</h2>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div>
            <h2 className="text-xl mb-4">2. Draw Signature</h2>
            <SignaturePad onSave={handleSignatureSave} />
          </div>

          <button
            onClick={signPDF}
            disabled={!pdfFile || !signatureData}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Sign and Download PDF
          </button>
        </div>
      </div>
    </div>
  );
} 