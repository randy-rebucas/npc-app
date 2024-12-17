export async function POST(request: Request) {
  const res = await request.json();
  
  console.log(res);
  // onBoarding: {
  //   firstName: 'Randy',
  //   lastName: 'Rebucas',
  //   email: 'admin@kidzklinika.com',
  //   medicalLicenseStates: [ 'California', 'New York', 'Texas', 'Florida', 'Illinois' ],
  //   deaLicenseStates: [ 'California', 'New York', 'Texas', 'Florida', 'Illinois' ],
  //   practiceTypes: [
  //     'Primary Care',
  //     'Urgent Care',
  //     'Emergency Care',
  //     'Telemedicine',
  //     'Internal Medicine',
  //     'Family Medicine',
  //     'Pediatrics',
  //     'Psychiatry'
  //   ],
  //   monthlyCollaborationRate: 0,
  //   additionalStateFee: 0,
  //   additionalNPFee: 0,
  //   controlledSubstancesMonthlyFee: 0,
  //   controlledSubstancesPerPrescriptionFee: 0,
  //   description: '',
  //   boardCertification: '',
  //   additionalCertifications: [],
  //   linkedinProfile: '',
  //   profilePhotoUrl: 'blob:http://localhost:3000/99a2b3a9-5774-457e-bd8e-5ed5c10689b5',
  //   governmentIdUrl: 'blob:http://localhost:3000/695406be-2eee-403b-98c8-e6e7ad6cee62'
  // }
  return Response.json({ res });
}
