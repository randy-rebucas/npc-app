import FormWrapper from "../components/FormWrapper";

const USER_TYPES = {
    'nurse-practitioner': 'nurse-practitioner',
    'physician': 'physician',
}

export default async function OnboardingPage({
    params,
}: {
    params: Promise<{ type: string }>
}) {

    const type = (await params).type as keyof typeof USER_TYPES;

    if (!USER_TYPES[type]) {
        return <div>Invalid user type</div>;
    }

    return (
        <FormWrapper type={type} />
    );
}
