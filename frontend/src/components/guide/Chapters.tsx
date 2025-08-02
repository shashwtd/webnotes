'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
}

interface ChaptersProps {
  chapters: Chapter[];
  activeChapter: string;
  onChapterChange: (id: string) => void;
}

export default function Chapters({ chapters, activeChapter, onChapterChange }: ChaptersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeChapterData = chapters.find(c => c.id === activeChapter);

  return (
    <>
      {/* Mobile Dropdown */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-2 px-6 py-3 bg-white rounded-xl border border-neutral-200/80 text-base"
        >
          <div className="flex flex-col items-start">
            <span className="font-medium">{activeChapterData?.title}</span>
            <span className="text-neutral-500">{activeChapterData?.subtitle}</span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 bg-transparent" 
              onClick={() => setIsOpen(false)} 
            />
            <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-xl border border-neutral-200/80 shadow-lg overflow-hidden z-50 py-2">
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => {
                    onChapterChange(chapter.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-6 py-3 transition-colors
                    ${activeChapter === chapter.id 
                      ? 'text-blue-600 bg-blue-50/50' 
                      : 'text-neutral-800 hover:bg-neutral-50'
                    }`}
                >
                  <p className="font-medium">{chapter.title}</p>
                  {chapter.subtitle && (
                    <p className="text-neutral-500 mt-0.5">
                      {chapter.subtitle}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 shrink-0">
        <nav className="sticky top-32 space-y-1 pr-8">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => onChapterChange(chapter.id)}
              className={`w-full text-left p-4 rounded-xl transition-all border border-transparent
                ${activeChapter === chapter.id 
                  ? 'bg-blue-50/50 border-blue-100 shadow-sm' 
                  : 'hover:bg-neutral-50'
                }`}
            >
              <div className="space-y-1">
                <p className={`font-medium ${
                  activeChapter === chapter.id ? 'text-blue-600' : 'text-neutral-800'
                }`}>
                  {chapter.title}
                </p>
                {chapter.subtitle && (
                  <p className={`${
                    activeChapter === chapter.id ? 'text-blue-600/70' : 'text-neutral-500'
                  }`}>
                    {chapter.subtitle}
                  </p>
                )}
              </div>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
