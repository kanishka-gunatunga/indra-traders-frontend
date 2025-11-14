'use client';
import {useCurrentUser} from "@/utils/auth";

export default function Home() {

    const data = useCurrentUser();
    console.log('session', data);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <h1>Hello {data?.full_name}</h1>
        </div>
    );
}