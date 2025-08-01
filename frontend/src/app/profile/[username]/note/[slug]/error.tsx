'use client';

import Link from 'next/link';
import { LucideAlertCircle, LucideArrowLeft } from 'lucide-react';

export default function NoteError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="min-h-screen w-full bg-[#dacfbe] text-gray-900 overflow-y-auto flex items-center justify-center px-2 sm:px-6 py-12">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-sm rounded-2xl shadow-lg border border-black/5 p-8 sm:p-12 flex flex-col gap-6 items-center text-center">
          <div className="size-16 flex items-center justify-center bg-red-50 rounded-full text-red-500">
            <LucideAlertCircle className="w-8 h-8" />
          </div>
          
          <div>
            <h1 className="text-2xl font-semibold mb-2">Error Loading Note</h1>
            <p className="text-gray-600 mb-6">
              We encountered a problem while trying to load this note. Please try again later.
            </p>
          </div>
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/80 text-white hover:bg-black transition-colors"
          >
            <LucideArrowLeft className="w-4 h-4" />
            Return to Home
          </Link>
          
          <div className="mt-4 text-xs text-gray-500">
            Error reference: {error.digest}
          </div>
        </div>
      </div>
    </div>
  );
}
