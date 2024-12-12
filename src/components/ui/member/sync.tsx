'use client'
import { syncMembers } from '@/app/actions/members';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

export default function Sync({ id }: { id: string }) {
    return (
        <Button variant="outline" size="icon" onClick={() => syncMembers(id)}>
            <RefreshCcw />
        </Button>
    );
}