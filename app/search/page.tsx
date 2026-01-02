"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import Sidebar from '../../components/Sidebar';
import FeedPost from '../../components/FeedPost';
import Link from 'next/link';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query) performSearch(query);
    }, [query]);

    const performSearch = async (term: string) => {
        setLoading(true);
        // Call the RPC function we created in SQL
        const { data, error } = await supabase.rpc('search_kryv', { keyword: term });
        if (data) setResults(data);
        else console.error(error);
        setLoading(false);
    };

    return (
        <div className="flex-1 md:ml-64 bg-black min-h-screen text-white border-r border-gray-800">
             <div className="p-4 border-b border-gray-800 sticky top-0 bg-black/90 backdrop-blur-md z-50">
                 <h2 className="text-xl font-bold">Results for "{query}"</h2>
             </div>

             <div className="p-4 pb-20">
                 {loading && <div className="text-emerald-500 animate-pulse">Scanning Neural Network...</div>}
                 
                 {!loading && results.length === 0 && <div className="text-gray-500">No signals found.</div>}

                 <div className="space-y-4">
                     {results.map((item: any, i) => (
                         <div key={i}>
                             {item.type === 'user' ? (
                                 // USER CARD
                                 <Link href={`/profile?id=${item.id}`} className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-emerald-500 transition">
                                     <img src={item.content || "/KRYV.png"} className="w-12 h-12 rounded-full object-cover" />
                                     <div>
                                         <h3 className="font-bold text-lg">{item.id === item.content ? 'User' : item.content}</h3> {/* Username handling fix */}
                                         <p className="text-sm text-gray-500">{item.secondary}</p> {/* Bio */}
                                     </div>
                                 </Link>
                             ) : (
                                 // POST CARD (Using raw div for now, but linked)
                                 <Link href={`/profile?id=${item.secondary}`} className="block p-4 bg-black border-b border-gray-800 hover:bg-white/5">
                                      <p className="text-gray-300">{item.content}</p>
                                      <p className="text-xs text-emerald-500 mt-2">View Signal</p>
                                 </Link>
                             )}
                         </div>
                     ))}
                 </div>
             </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-black text-white flex">
            <Sidebar currentUser={null} />
            <Suspense fallback={<div>Loading...</div>}>
                <SearchContent />
            </Suspense>
        </div>
    )
}
