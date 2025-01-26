import Items from "@/components/favorite/Items";
import Header from "@/components/header";
import { getFavorites } from "@/app/actions/favorite";

export default async function FavoritesPage() {

    // get favorites and their users and their profiles
    const favorites = await getFavorites();

    return (
        <div className="bg-gray-50 min-h-screen w-full">
            <Header />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Favorite Physicians</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Items items={favorites} />
                </div>
            </main>
        </div>
    );
}