'use client';

import { useState, useEffect } from 'react';
import { LucideArrowLeft, LucideExternalLink, LucideDownload, LucideChevronRight } from 'lucide-react';
import Image from 'next/image';
import Chapters from '@/components/guide/Chapters';
import CLIOutput from '@/components/guide/CLIOutput';
import { getBinaryLinks } from '@/lib/api/releases';

const chapters = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    subtitle: 'Connect your Mac and start syncing'
  },
  {
    id: 'publishing',
    title: 'Publishing Notes',
    subtitle: 'Share your notes with the world'
  },
  {
    id: 'customization',
    title: 'Your Profile',
    subtitle: 'Make WebNotes yours'
  }
];

const cliOutput = `ajiteshkumar@ajitesh macos_client % ./xpt14.build
Please open the following URL in your browser to authorize the client:
http://localhost:3000/authorize-client?redirect_uri=http%3A%2F%2F127.0.0.1%3A60392
Authorization complete.
2025/08/01 17:03:50 INFO operation completed successfully time=2025-08-01T17:03:50-04:00`;

export default function UserGuidePage() {
  const [activeChapter, setActiveChapter] = useState('getting-started');
  const [downloadLinks, setDownloadLinks] = useState<{
    arm?: string;
    intel?: string;
  } | null>(null);
  const [loadingDownloads, setLoadingDownloads] = useState(true);

  useEffect(() => {
    const fetchDownloadLinks = async () => {
      try {
        setLoadingDownloads(true);
        const links = await getBinaryLinks();
        setDownloadLinks(links);
      } catch (error) {
        console.error('Failed to fetch download links:', error);
        setDownloadLinks(null);
      } finally {
        setLoadingDownloads(false);
      }
    };
    
    fetchDownloadLinks();
  }, []);

  const renderGettingStartedContent = () => (
    <>
      <header className="mb-12 lg:mb-16">
        <h1 className="text-2xl lg:text-4xl font-bold text-neutral-900 mb-4 lg:mb-6 leading-tight">
          Getting Started with WebNotes
        </h1>
        <p className="text-base lg:text-xl text-neutral-600 leading-relaxed">
          Welcome to WebNotes! Before you can start publishing your Apple Notes, you&apos;ll need to connect your Mac to our service. 
          This guide will walk you through the process step by step.
        </p>
      </header>

      <div className="space-y-12 lg:space-y-16">
        <section>
          <h2 className="text-xl lg:text-2xl font-semibold text-neutral-900 mb-4 lg:mb-6">
            Step 1: Download the Mac Client
          </h2>
          <p className="text-sm lg:text-base text-neutral-700 mb-6 lg:mb-8 leading-relaxed">
            First, you&apos;ll need our macOS client to sync your notes. Choose the version that matches your Mac:
          </p>

          {loadingDownloads ? (
            <div className="flex items-center justify-center py-6 lg:py-8 mb-6 lg:mb-8">
              <div className="animate-spin rounded-full h-5 w-5 lg:h-6 lg:w-6 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-sm lg:text-base text-neutral-600">Loading download links...</span>
            </div>
          ) : (
            <div className="grid gap-3 lg:gap-4 sm:grid-cols-2 mb-6 lg:mb-8">
              {downloadLinks?.arm ? (
                <a 
                  href={downloadLinks.arm}
                  className="group p-4 lg:p-6 rounded-xl border-2 border-blue-200 hover:border-blue-300 hover:shadow-md transition-all bg-blue-50 hover:bg-blue-100"
                >
                  <div className="flex items-start gap-3 lg:gap-4">
                    <div className="p-2 bg-blue-600 rounded-lg text-white">
                      <LucideDownload className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm lg:text-base font-semibold text-neutral-900 mb-1">Apple Silicon (ARM)</h3>
                      <p className="text-xs lg:text-sm text-neutral-600 leading-relaxed mb-2">
                        For M1, M2, M3, M4 Macs
                      </p>
                      <div className="flex items-center text-blue-600 text-xs lg:text-sm font-medium">
                        Download now
                        <LucideChevronRight className="w-3 h-3 lg:w-4 lg:h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </a>
              ) : (
                <div className="p-4 lg:p-6 rounded-xl border border-neutral-200 bg-neutral-50">
                  <div className="text-center text-neutral-500">
                    <p className="font-medium text-sm lg:text-base">Apple Silicon Download</p>
                    <p className="text-xs lg:text-sm">Currently unavailable</p>
                  </div>
                </div>
              )}
              
              {downloadLinks?.intel ? (
                <a 
                  href={downloadLinks.intel}
                  className="group p-4 lg:p-6 rounded-xl border-2 border-blue-200 hover:border-blue-300 hover:shadow-md transition-all bg-blue-50 hover:bg-blue-100"
                >
                  <div className="flex items-start gap-3 lg:gap-4">
                    <div className="p-2 bg-blue-600 rounded-lg text-white">
                      <LucideDownload className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm lg:text-base font-semibold text-neutral-900 mb-1">Intel Processor</h3>
                      <p className="text-xs lg:text-sm text-neutral-600 leading-relaxed mb-2">
                        For older Intel-based Macs
                      </p>
                      <div className="flex items-center text-blue-600 text-xs lg:text-sm font-medium">
                        Download now
                        <LucideChevronRight className="w-3 h-3 lg:w-4 lg:h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </a>
              ) : (
                <div className="p-4 lg:p-6 rounded-xl border border-neutral-200 bg-neutral-50">
                  <div className="text-center text-neutral-500">
                    <p className="font-medium text-sm lg:text-base">Intel Download</p>
                    <p className="text-xs lg:text-sm">Currently unavailable</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mb-6 lg:mb-8">
            <a 
              href="https://github.com/webnotes/macos-client/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-xs lg:text-sm font-medium"
            >
              <LucideExternalLink className="w-3 h-3 lg:w-4 lg:h-4" />
              View all releases on GitHub
            </a>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 lg:p-6 rounded-r-lg">
            <h4 className="font-semibold text-amber-900 mb-2 lg:mb-3 text-sm lg:text-base">Not sure which version to download?</h4>
            <ul className="text-amber-800 space-y-1 lg:space-y-2 text-xs lg:text-sm">
              <li className="flex items-start gap-2">
                <LucideChevronRight className="w-3 h-3 lg:w-4 lg:h-4 mt-0.5 flex-shrink-0" />
                <span>For M1, M2, M3, M4 Macs (Apple Silicon): Choose ARM version</span>
              </li>
              <li className="flex items-start gap-2">
                <LucideChevronRight className="w-3 h-3 lg:w-4 lg:h-4 mt-0.5 flex-shrink-0" />
                <span>For older Intel Macs: Choose Intel version</span>
              </li>
              <li className="flex items-start gap-2">
                <LucideChevronRight className="w-3 h-3 lg:w-4 lg:h-4 mt-0.5 flex-shrink-0" />
                <span>Check your Mac: Apple menu → About This Mac</span>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl lg:text-2xl font-semibold text-neutral-900 mb-4 lg:mb-6">
            Step 2: Run the Client
          </h2>
          <p className="text-sm lg:text-base text-neutral-700 mb-6 lg:mb-8 leading-relaxed">
            Once downloaded, the macOS client is a simple command-line tool. Here&apos;s what happens when you run it:
          </p>

          <div className="mb-6 lg:mb-8">
            <CLIOutput content={cliOutput} />
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 lg:p-6 rounded-r-lg mb-6 lg:mb-8">
            <h4 className="font-semibold text-blue-900 mb-2 lg:mb-3 text-sm lg:text-base">What you&apos;ll see</h4>
            <p className="text-blue-800 text-xs lg:text-sm leading-relaxed mb-3 lg:mb-4">
              macOS will ask for permission to access your Apple Notes. This is completely normal and safe - 
              we use Apple&apos;s official AppleScript to read your notes.
            </p>
            
            <div className="bg-neutral-100 rounded-lg p-3 lg:p-4 border border-blue-200 flex justify-center">
              <Image 
                src="/images/apple_permission.png" 
                alt="macOS permission dialog for Apple Notes access"
                width={280}
                height={280}
                className="max-w-full h-auto rounded max-h-64 lg:max-h-80"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl lg:text-2xl font-semibold text-neutral-900 mb-4 lg:mb-6">
            Step 3: Authorize the Client
          </h2>
          <div className="space-y-4 lg:space-y-6">
            <p className="text-sm lg:text-base text-neutral-700 leading-relaxed">
              When you run the client for the first time, it will:
            </p>
            <ol className="space-y-3 lg:space-y-4 text-xs lg:text-sm text-neutral-700">
              <li className="flex gap-3 lg:gap-4">
                <span className="font-mono text-blue-600 font-semibold">1.</span>
                <span>Generate a unique authorization URL</span>
              </li>
              <li className="flex gap-3 lg:gap-4">
                <span className="font-mono text-blue-600 font-semibold">2.</span>
                <span>Open your default browser to complete authorization</span>
              </li>
              <li className="flex gap-3 lg:gap-4">
                <span className="font-mono text-blue-600 font-semibold">3.</span>
                <span>Wait for you to approve the connection</span>
              </li>
              <li className="flex gap-3 lg:gap-4">
                <span className="font-mono text-blue-600 font-semibold">4.</span>
                <span>Display &ldquo;Authorization complete&rdquo; once successful</span>
              </li>
            </ol>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 lg:p-6">
              <h4 className="font-semibold text-blue-900 mb-2 lg:mb-3 text-sm lg:text-base">Authorization Interface</h4>
              <p className="text-blue-800 text-xs lg:text-sm mb-3 lg:mb-4">
                You&apos;ll see a clean authorization page in your browser where you can approve the connection.
              </p>
              <div className="bg-neutral-100 rounded-lg p-3 lg:p-4 border border-blue-200 flex justify-center">
                <Image 
                  src="/images/auth_success.png" 
                  alt="WebNotes authorization success page"
                  width={400}
                  height={200}
                  className="max-w-full h-auto rounded max-h-48 lg:max-h-64"
                />
              </div>
            </div>

            <p className="text-sm lg:text-base text-neutral-700 leading-relaxed">
              After authorization is complete, the client will start syncing your notes automatically.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl lg:text-2xl font-semibold text-neutral-900 mb-4 lg:mb-6">
            Step 4: Check Your Dashboard
          </h2>
          <p className="text-sm lg:text-base text-neutral-700 mb-4 lg:mb-6 leading-relaxed">
            Once the client is authorized and running, head to your WebNotes dashboard. You should see:
          </p>
          <ul className="space-y-2 lg:space-y-3 text-xs lg:text-sm text-neutral-700 mb-6 lg:mb-8">
            <li className="flex items-center gap-2 lg:gap-3 p-3 lg:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <LucideChevronRight className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600 flex-shrink-0" />
              <span>Your Apple Notes appearing in the notes list</span>
            </li>
            <li className="flex items-center gap-2 lg:gap-3 p-3 lg:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <LucideChevronRight className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600 flex-shrink-0" />
              <span>A notification showing &ldquo;X notes synced successfully&rdquo;</span>
            </li>
            <li className="flex items-center gap-2 lg:gap-3 p-3 lg:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <LucideChevronRight className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600 flex-shrink-0" />
              <span>The activity feed updating with the sync status</span>
            </li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 lg:p-6 rounded-r-lg">
            <h4 className="font-semibold text-blue-900 mb-2 lg:mb-3 text-sm lg:text-base">Keep the Client Running</h4>
            <p className="text-blue-800 text-xs lg:text-sm leading-relaxed">
              The macOS client needs to be running to sync changes from your Apple Notes. We recommend adding it to your startup items for the best experience.
            </p>
          </div>
        </section>
      </div>
    </>
  );

  const renderPublishingContent = () => (
    <>
      <header className="mb-12 lg:mb-16">
        <h1 className="text-2xl lg:text-4xl font-bold text-neutral-900 mb-4 lg:mb-6 leading-tight">
          Publishing Your Notes
        </h1>
        <p className="text-base lg:text-xl text-neutral-600 leading-relaxed">
          Once your Mac client is connected, you can start publishing your Apple Notes to share them with the world.
        </p>
      </header>

      <div className="space-y-8 lg:space-y-12">
        <section>
          <h2 className="text-xl lg:text-2xl font-semibold text-neutral-900 mb-4 lg:mb-6">
            How Publishing Works
          </h2>
          <p className="text-sm lg:text-base text-neutral-700 mb-4 lg:mb-6 leading-relaxed">
            Publishing in WebNotes is simple and secure. Here&apos;s what you need to know:
          </p>
          <ul className="space-y-2 lg:space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-semibold">•</span>
              <span className="text-sm lg:text-base text-neutral-700">Only notes you explicitly publish are shared publicly</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-semibold">•</span>
              <span className="text-sm lg:text-base text-neutral-700">Your notes are automatically formatted for web viewing</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-semibold">•</span>
              <span className="text-sm lg:text-base text-neutral-700">You can unpublish notes at any time</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl lg:text-2xl font-semibold text-neutral-900 mb-4 lg:mb-6">
            Publishing Your First Note
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 lg:p-6">
            <p className="text-blue-800 text-sm lg:text-base leading-relaxed">
              This is where detailed publishing instructions would go. For now, this is placeholder content to demonstrate the chapter system.
            </p>
          </div>
        </section>
      </div>
    </>
  );

  const renderCustomizationContent = () => (
    <>
      <header className="mb-12 lg:mb-16">
        <h1 className="text-2xl lg:text-4xl font-bold text-neutral-900 mb-4 lg:mb-6 leading-tight">
          Your WebNotes Profile
        </h1>
        <p className="text-base lg:text-xl text-neutral-600 leading-relaxed">
          Customize your WebNotes experience and make your profile uniquely yours.
        </p>
      </header>

      <div className="space-y-8 lg:space-y-12">
        <section>
          <h2 className="text-xl lg:text-2xl font-semibold text-neutral-900 mb-4 lg:mb-6">
            Profile Settings
          </h2>
          <p className="text-sm lg:text-base text-neutral-700 mb-4 lg:mb-6 leading-relaxed">
            Your profile is how others discover your published notes. Here&apos;s what you can customize:
          </p>
          <ul className="space-y-2 lg:space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-semibold">•</span>
              <span className="text-sm lg:text-base text-neutral-700">Display name and bio</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-semibold">•</span>
              <span className="text-sm lg:text-base text-neutral-700">Profile picture and banner</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-semibold">•</span>
              <span className="text-sm lg:text-base text-neutral-700">Social links and contact information</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl lg:text-2xl font-semibold text-neutral-900 mb-4 lg:mb-6">
            Theme & Appearance
          </h2>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 lg:p-6">
            <p className="text-amber-800 text-sm lg:text-base leading-relaxed">
              This is where customization options would be explained. For now, this is placeholder content to demonstrate the chapter navigation system.
            </p>
          </div>
        </section>
      </div>
    </>
  );

  const renderChapterContent = () => {
    switch (activeChapter) {
      case 'getting-started':
        return renderGettingStartedContent();
      case 'publishing':
        return renderPublishingContent();
      case 'customization':
        return renderCustomizationContent();
      default:
        return renderGettingStartedContent();
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Navigation */}
      <div className="sticky top-0 z-20 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 lg:h-16 flex items-center justify-between">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm lg:text-base font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <LucideArrowLeft className="w-4 h-4 lg:w-5 lg:h-5" />
            Close Guide
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="lg:flex min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <div className="lg:w-80 lg:flex-shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-neutral-200">
            <div className="sticky top-14 lg:top-16 px-4 lg:px-6 py-4 lg:py-8">
              <Chapters
                chapters={chapters}
                activeChapter={activeChapter}
                onChapterChange={setActiveChapter}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 px-4 sm:px-6 lg:px-16 py-8 lg:py-12 bg-white">
            <div className="max-w-3xl mx-auto">
              {renderChapterContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
