export default function Message({ itemId }: { itemId: string }) {
    const handleMessage = (id: string) => {
        console.log("Message", id);
    }
    return (
        <button
            onClick={() => handleMessage(itemId)}
            className="flex-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
        >
            Message
        </button>
    );
}