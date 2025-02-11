import Items from "@/components/favorite/Items";
import Header from "@/components/header";
import { getFavorites } from "@/app/actions/favorite";

export default async function FavoritesPage() {
    const favorites = await getFavorites();

    return (
        <div className="min-h-screen w-full bg-background">
            <Header />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-foreground mb-6">Favorite Physicians</h1>
                <Items items={favorites} />
            </main>
        </div>
    );
}