"use client";

import { Pencil, Trash2, KeyRound, Send } from "lucide-react";
import { Button } from "../button";

export const UserActions = ({ userId }: { userId: string }) => {
    console.log(userId);

    const handleEdit = () => {
        console.log("Edit");
    };

    const handleDelete = () => {
        console.log("Delete");
    };

    const handleResetPassword = () => {
        console.log("Reset Password");
    };

    const handleSendInvite = () => {
        console.log("Send Invite");
    };

    return (
        <div className="opacity-0 group-hover:opacity-100 flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleEdit}>
                <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleResetPassword}>
                <KeyRound className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSendInvite}>
                <Send className="h-4 w-4" />
            </Button>
        </div>
    );
};
