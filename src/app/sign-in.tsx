'use client';

type Props = {
    onSignIn: () => Promise<void>;
};

const SignIn = ({ onSignIn }: Props) => {
    return (
        <button
            onClick={() => {
                onSignIn();
            }}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 
                transition duration-200 text-lg font-medium"
        >
            Sign In
        </button>
    );
};

export default SignIn;