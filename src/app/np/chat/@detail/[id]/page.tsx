// import { Loader2, Paperclip } from "lucide-react";
// import { ISharedFile } from "@/app/models/SharedFile";
// import { IUser } from "@/app/models/User";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    console.log(id);
    // const [messages, setMessages] = useState<Message[]>([]);
    // const [isLoading, setIsLoading] = useState(true);
    // const [newMessage, setNewMessage] = useState<string>("");
    // const [members, setMembers] = useState<IUser[]>([]);
    // const [files, setFiles] = useState<ISharedFile[]>([]);
    // const [mentionQuery, setMentionQuery] = useState<string>('');
    // const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
    // useEffect(() => {
    //     const loadMembersAndFiles = async () => {
    //         if (!activeChat) return;

    //         try {
    //             const [membersRes, filesRes] = await Promise.all([
    //                 fetch(`/api/chat/members?chatId=${activeChat}`),
    //                 fetch(`/api/chat/files?chatId=${activeChat}`)
    //             ]);

    //             if (membersRes.ok && filesRes.ok) {
    //                 const { members } = await membersRes.json();
    //                 const { files } = await filesRes.json();
    //                 setMembers(members);
    //                 setFiles(files);
    //             }
    //         } catch (err) {
    //             console.error('Failed to load members or files:', err);
    //         }
    //     };

    //     loadMembersAndFiles();
    // }, [activeChat]);
    // const handleSubmit = async (e: FormEvent) => {
    //     e.preventDefault();
    //     if (!newMessage.trim()) return;

    //     const message: Message = {
    //         id: Date.now().toString(),
    //         content: newMessage,
    //         sender: 'user',
    //         timestamp: new Date()
    //     };

    //     setMessages(prev => [...prev, message]);
    //     setNewMessage("");

    //     try {
    //         const response = await fetch('/api/chat/send', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ content: newMessage }),
    //         });

    //         if (!response.ok) throw new Error('Failed to send message');

    //         const data = await response.json();
    //         console.log(data);
    //     } catch (err) {
    //         console.error('Failed to send message:', err);
    //         setMessages(prev => prev.filter(m => m.id !== message.id));
    //     }
    // };

    // const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (!file || !activeChat) return;

    //     // Implement your file upload logic here
    //     // For example, upload to S3 or your preferred storage
    //     // Then save the file reference:
    //     try {
    //         const fileUrl = 'your-uploaded-file-url';
    //         const response = await fetch('/api/chat/files', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({
    //                 chatId: activeChat,
    //                 fileName: file.name,
    //                 fileUrl,
    //                 fileType: file.type,
    //                 fileSize: file.size,
    //             }),
    //         });

    //         // if (!response.ok) throw new Error('Failed to share file');

    //         const { file: newFile } = await response.json();
    //         setFiles(prev => [...prev, newFile]);
    //     } catch (err) {
    //         console.error('Failed to upload file:', err);
    //     }
    // };

    // const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    //     const value = e.target.value;
    //     setNewMessage(value);

    //     // Check for @ symbol
    //     const lastAtSymbol = value.lastIndexOf('@');
    //     if (lastAtSymbol !== -1) {
    //         const query = value.slice(lastAtSymbol + 1);
    //         setMentionQuery(query);
    //         setShowMentionSuggestions(true);
    //     } else {
    //         setShowMentionSuggestions(false);
    //     }
    // };

    // const handleMentionSelect = (member: IUser) => {
    //     const lastAtSymbol = newMessage.lastIndexOf('@');
    //     const newValue = newMessage.slice(0, lastAtSymbol) + `@${member.email} `;
    //     setNewMessage(newValue);
    //     setShowMentionSuggestions(false);
    // };

    return (
        <div className="flex-1 flex">
            {/* <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-white">
                    <h1 className="text-xl font-semibold">Chat Messages</h1>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                    <div className="flex flex-col space-y-4">
                        {messages && messages.length > 0 && messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl p-3 ${message.sender === 'user'
                                        ? 'bg-[#0084FF] text-white'
                                        : 'bg-gray-100 text-gray-900'
                                        }`}
                                >
                                    <div className="text-xs text-gray-500 mb-1">
                                        {new Date(message.timestamp).toLocaleString()}
                                    </div>
                                    {message.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-200 bg-white p-4 relative">
                    <form className="flex gap-2">
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                        <label
                            htmlFor="file-upload"
                            className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
                        >
                            <Paperclip size={20} />
                        </label>
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="w-full p-2 rounded-full bg-gray-100 text-gray-900 border-none focus:outline-none focus:ring-1 focus:ring-[#0084FF]"
                                value={newMessage}
                                onChange={handleInputChange}
                            />
                            {showMentionSuggestions && (
                                <div className="absolute bottom-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {members && members.length > 0 && members
                                        .filter(member =>
                                            member.email.toLowerCase().includes(mentionQuery.toLowerCase())
                                        )
                                        .map(member => (
                                            <div
                                                key={member.id}
                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleMentionSelect(member)}
                                            >
                                                {member.email}
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#0084FF] text-white rounded-full hover:bg-[#0073E6] transition-colors"
                            onClick={handleSubmit}
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>

            <div className="w-[320px] border-l border-gray-200 p-4">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full" />
                    <h2 className="text-xl font-semibold">Chat Details</h2>
                    <div className="w-full space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold mb-2">Members</h3>
                            
                            {members && members.length > 0 && members.map((member) => (
                                <div key={member.id}>{member.email}</div>
                            ))}
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold mb-2">Shared Files</h3>
                            
                            {files && files.length > 0 && files.map((file) => (
                                <div key={file.id}>{file.fileName}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
}