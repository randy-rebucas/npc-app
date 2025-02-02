'use client';

import { useRouter } from 'next/navigation';

const SignIn = () => {
    const router = useRouter();
    return (
        <button
            onClick={() => {
                router.push('/auth');
            }}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 
                transition duration-200 text-sm font-medium"
        >
            Sign In
        </button>
    );
};

export default SignIn;