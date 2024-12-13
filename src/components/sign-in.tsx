'use client';

import { useRouter } from 'next/navigation';

const SignIn = () => {
    const router = useRouter();
    return (
        <button
            onClick={() => {
                router.push('/auth/signin');
            }}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 
                transition duration-200 text-lg font-medium"
        >
            Sign In
        </button>
    );
};

export default SignIn;