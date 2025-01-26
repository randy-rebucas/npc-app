"use client";

import Image from "next/image";
import Message from "./actions/Message";

interface IFavorite {
    id: string;
    npUser: string;
    physicianUser: {
        email: string;
        profile: {
            profilePhotoPath: string;
            firstName: string;
            lastName: string;
            title: string;
            boardCertification: string;
            practiceTypes: string[];
            monthlyCollaborationRate: number;
            additionalStateFee: number;
            additionalNPFee: number;
            controlledSubstancesMonthlyFee: number;
        };
    };
}

export default function Items({ items }: { items: IFavorite[] }) {
    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Favorites Yet</h3>
                <p className="text-gray-500">
                    When you find physicians you&apos;re interested in, save them here for easy access.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {items.map((item) => (
                <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4"
                >
                    <div className="flex items-start space-x-4">
                        <div className="relative w-24 h-24 flex-shrink-0">
                            <Image
                                src={item.physicianUser.profile.profilePhotoPath}
                                alt={item.physicianUser.profile.firstName + " " + item.physicianUser.profile.lastName}
                                fill
                                className="rounded-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-medium text-gray-900">
                                {item.physicianUser.profile.firstName + " " + item.physicianUser.profile.lastName},
                                <span className="ml-1">{item.physicianUser.profile.title}</span>
                            </h2>

                            <div className="mt-2 space-y-2">
                                <p className="text-sm">
                                    <span className="text-gray-500">Total Price: </span>
                                    <span className="font-medium">${item.physicianUser.profile.monthlyCollaborationRate}</span>
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {item.physicianUser.profile.practiceTypes && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {item.physicianUser.profile.practiceTypes.join(", ")}
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <Message itemId={item.id} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}