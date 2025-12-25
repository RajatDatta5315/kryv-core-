use client;

import {
  ArrowUpIcon,
  CogIcon,
  CollectionIcon,
  CreditCardIcon,
  DocumentReportIcon,
  HomeIcon,
  ScaleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Header from '@/components/Header';
import Stats from '@/components/Stats';
import SystemHealth from '@/components/SystemHealth';
import ViralPostGenerator from '@/components/ViralPostGenerator';

export default function Dashboard() {
  const supabaseClient = useSupabaseClient();

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="h-24 rounded-lg bg-gray-200" />
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SystemHealth />
            <ViralPostGenerator />
            <Stats />
          </div>
        </div>
      </main>
    </>
  );
}