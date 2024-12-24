'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export default function AdminChartPage() {
    const [period, setPeriod] = useState('7days');
    const [view, setView] = useState('daily');

    console.log(period, view);
    const mockSignupData = [
        { date: '2024-03-01', signups: 4 },
        { date: '2024-03-02', signups: 3 },
        { date: '2024-03-03', signups: 5 },
        { date: '2024-03-04', signups: 2 },
        { date: '2024-03-05', signups: 7 },
        { date: '2024-03-06', signups: 4 },
        { date: '2024-03-07', signups: 6 },
    ];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-medium">Signups</CardTitle>
                    <Select defaultValue="7days" onValueChange={(value) => setPeriod(value)}>
                        <SelectTrigger className="w-[140px] h-8">
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7days">Last 7 days</SelectItem>
                            <SelectItem value="30days">Last 30 days</SelectItem>
                            <SelectItem value="90days">Last 90 days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Select defaultValue="daily" onValueChange={(value) => setView(value)}>
                    <SelectTrigger className="w-[100px] h-8">
                        <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockSignupData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis />
                        <Tooltip
                            labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            formatter={(value) => [`${value} signups`, 'Signups']}
                        />
                        <Line
                            type="monotone"
                            dataKey="signups"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={{ fill: '#2563eb' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}