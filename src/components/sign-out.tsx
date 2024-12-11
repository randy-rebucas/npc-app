'use client';

import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';

type Props = {
    onSignOut: () => Promise<void>;
};

const SignOut = ({ onSignOut }: Props) => {
    return (
        <button
            title="Sign Out"
            onClick={() => {
                onSignOut();
            }}
            className="flex items-center gap-2"
        >
            <ArrowLeftStartOnRectangleIcon className="h-4 w-4" />
        </button>
    );
};

export default SignOut;