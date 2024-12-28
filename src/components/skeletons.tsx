export const ProfileSkeleton = () => {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            {/* Header skeleton */}
            <div className="mb-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>

            {/* Form skeleton */}
            <div className="space-y-6 animate-pulse">
                {/* Name fields */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </div>
                </div>

                {/* Phone field */}
                <div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/5 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>

                {/* Address field */}
                <div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>

                {/* City/State/ZIP fields */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </div>
                    <div className="flex-1">
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </div>
                    <div className="flex-1">
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </div>
                </div>

                {/* Email field */}
                <div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="flex gap-4">
                        <div className="h-10 bg-gray-200 rounded flex-1"></div>
                        <div className="h-10 bg-gray-200 rounded w-40"></div>
                    </div>
                </div>

                {/* Save button */}
                <div className="flex justify-end">
                    <div className="h-10 bg-gray-200 rounded w-20"></div>
                </div>
            </div>
        </div>
    );
}

export const BioSkeleton = () => {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="animate-pulse space-y-6">
                <div className="space-y-2">
                    <div className="h-7 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>

                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-[100px] bg-gray-200 rounded"></div>
                </div>

                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-36"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>

                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>

                <div className="flex justify-end">
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
            </div>
        </div>
    );
}

export const PhotoSkeleton = () => {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="space-y-6">
                {/* Title and subtitle skeleton */}
                <div className="space-y-2">
                    <div className="h-7 bg-gray-200 rounded-md w-32"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-64"></div>
                </div>

                {/* Profile picture skeleton */}
                <div className="flex flex-col items-center gap-6">
                    <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded-md w-32 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}

export const RatesSkeleton = () => {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <div className="h-7 bg-gray-200 rounded w-48 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>

            <div className="space-y-8">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="h-4 bg-gray-200 rounded w-48"></div>
                            <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end mt-8">
                <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
        </div>
    );
}

