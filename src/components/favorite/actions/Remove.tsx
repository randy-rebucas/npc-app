export default function Remove({ itemId }: { itemId: string }) {
    const handleRemove = (id: string) => {
        console.log("Remove", id);
    }
    return (
        <button
            onClick={() => handleRemove(itemId)}
            className="flex-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
        >
            Remove
        </button>
    );
}