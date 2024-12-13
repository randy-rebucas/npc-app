import { sdk } from "@/lib/sharetribe";
import Image from "next/image";

interface Listing {
    id: {
        uuid: string;
    };
    attributes: {
        title: string;
        description: string;
    };
    relationships: {
        images?: {
            data: Array<{
                attributes: {
                    url: string;
                };
            }>;
        };
        author?: {
            data: {
                attributes: {
                    profileImage?: string;
                    displayName?: string;
                };
            };
        };
    };
}

export default async function Listings() {
    const listings = await sdk.listings.query({
        pub_index: 'default',
        include: ['images', 'author'],
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Marketplace Listings</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listings.data.data.map((listing: Listing, index: number) => (
                    <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
                        {/* Image Container */}
                        <div className="relative h-48 w-full">
                            {listing.relationships?.images?.data?.[0]?.attributes?.url ? (
                                <Image
                                    src={listing.relationships.images.data[0].attributes.url}
                                    alt={listing.attributes.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400">No image available</span>
                                </div>
                            )}
                        </div>

                        {/* Content Container */}
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {listing.attributes.title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                {listing.attributes.description}
                            </p>

                            {/* Author Info */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                        {listing.relationships?.author?.data?.attributes?.profileImage ? (
                                            <Image
                                                src={listing.relationships.author.data.attributes.profileImage}
                                                alt="Author"
                                                width={32}
                                                height={32}
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-300" />
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {listing.relationships?.author?.data?.attributes?.displayName || 'Anonymous'}
                                    </span>
                                </div>

                                {/* View Details Button */}
                                <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                                    View Details →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
