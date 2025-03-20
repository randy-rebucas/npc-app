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
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 
                transition duration-200 text-sm font-medium"
        >
            Sign In
        </button>
    );
};

export default SignIn;