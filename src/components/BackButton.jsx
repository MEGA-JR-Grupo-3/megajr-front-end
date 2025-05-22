// components/BackButton.tsx
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react'; // ícone de seta

export default function BackButton() {
  return (
    <Link href="/dashboard">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-300">
        <ArrowLeft className="text-white w-5 h-5" />
      </div>
    </Link>
  );
}
