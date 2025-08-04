"use client";

import {
    LucideExternalLink,
    LucideDownload,
    LucideChevronRight,
} from "lucide-react";
import Image from "next/image";
import CLIOutput from "@/components/guide/CLIOutput";

interface GettingStartedProps {
    downloadLinks: {
        arm?: string;
        intel?: string;
    } | null;
    loadingDownloads: boolean;
    cliOutput: string;
}

export default function GettingStarted({
    downloadLinks,
    loadingDownloads,
    cliOutput,
}: GettingStartedProps) {
    return (
        <div className="font-sans">
            <header className="mb-12 lg:mb-16">
                <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-4 lg:mb-6 leading-tight">
                    Getting Started with Mynotes
                </h1>
                <p className="text-base lg:text-lg text-neutral-600 leading-relaxed">
                    Welcome to Mynotes! Before you can start publishing your
                    Apple Notes, you&apos;ll need to connect your Mac to our
                    service. This guide will walk you through the process step
                    by step.
                </p>
            </header>

            <div className="space-y-12 lg:space-y-16">
                <section>
                    <h2 className="text-lg lg:text-xl font-semibold text-neutral-900 mb-4 lg:mb-6">
                        Step 1: Download the Mac Client
                    </h2>
                    <p className="text-base text-neutral-700 mb-6 lg:mb-8 leading-relaxed">
                        First, you&apos;ll need our macOS client to sync your
                        notes. Choose the version that matches your Mac:
                    </p>

                    {loadingDownloads ? (
                        <div className="flex items-center justify-center py-6 lg:py-8 mb-6 lg:mb-8">
                            <div className="animate-spin rounded-full h-5 w-5 lg:h-6 lg:w-6 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-sm lg:text-base text-neutral-600">
                                Loading download links...
                            </span>
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
                                            <h3 className="text-base font-semibold text-neutral-900 mb-1">
                                                Apple Silicon (ARM)
                                            </h3>
                                            <p className="text-sm text-neutral-600 leading-relaxed mb-2">
                                                For M1, M2, M3, M4 Macs
                                            </p>
                                            <div className="flex items-center text-blue-600 text-sm font-medium">
                                                Download now
                                                <LucideChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ) : (
                                <div className="p-4 lg:p-6 rounded-xl border border-neutral-200 bg-neutral-50">
                                    <div className="text-center text-neutral-500">
                                        <p className="font-medium text-base">
                                            Apple Silicon Download
                                        </p>
                                        <p className="text-sm">
                                            Currently unavailable
                                        </p>
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
                                            <h3 className="text-base font-semibold text-neutral-900 mb-1">
                                                Intel Processor
                                            </h3>
                                            <p className="text-sm text-neutral-600 leading-relaxed mb-2">
                                                For older Intel-based Macs
                                            </p>
                                            <div className="flex items-center text-blue-600 text-sm font-medium">
                                                Download now
                                                <LucideChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ) : (
                                <div className="p-4 lg:p-6 rounded-xl border border-neutral-200 bg-neutral-50">
                                    <div className="text-center text-neutral-500">
                                        <p className="font-medium text-base">
                                            Intel Download
                                        </p>
                                        <p className="text-sm">
                                            Currently unavailable
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mb-6 lg:mb-8">
                        <a
                            href="https://github.com/shashwtd/webnotes/releases"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            <LucideExternalLink className="w-4 h-4" />
                            View all releases on GitHub
                        </a>
                    </div>

                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 lg:p-6 rounded-r-lg">
                        <h4 className="font-semibold text-amber-900 mb-2 lg:mb-3 text-base">
                            Not sure which version to download?
                        </h4>
                        <ul className="text-amber-800 space-y-2 text-base">
                            <li className="flex items-start gap-2">
                                <LucideChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>
                                    For M1, M2, M3, M4 Macs (Apple Silicon):
                                    Choose ARM version
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <LucideChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>
                                    For older Intel Macs: Choose Intel version
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <LucideChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>
                                    Check your Mac: Apple menu → About This Mac
                                </span>
                            </li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg lg:text-xl font-semibold text-neutral-900 mb-4 lg:mb-6">
                        Step 2: Running the Client
                    </h2>
                    <p className="text-base text-neutral-700 mb-6 lg:mb-8 leading-relaxed">
                        Once downloaded, you’ll notice a <b>zip</b> file.
                    </p>
                    <ol className="space-y-4 text-base text-neutral-700">
                        <li className="flex gap-4">
                            <span className="font-mono text-blue-600 font-semibold">
                                1.
                            </span>
                            <span>
                                Extract the <b>zip</b> file. In Finder, you can
                                do this by double-clicking the item.
                            </span>
                        </li>
                        <li className="flex gap-4">
                            <span className="font-mono text-blue-600 font-semibold">
                                2.
                            </span>
                            <span>
                                Once extracted, you should see a file titled{" "}
                                <b>MyNotes</b> with a special icon. Double-click
                                on the icon.
                            </span>
                        </li>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6 lg:mb-8">
                            <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                                <div className="flex w-full relative justify-center">
                                    <Image
                                        src="/images/tutorial/zip_file_after_download.jpg"
                                        alt="macOS permission dialog for Apple Notes access"
                                        width={600}
                                        height={400}
                                        className="max-w-full w-full! h-auto rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                        <li className="flex gap-4">
                            <span className="font-mono text-blue-600 font-semibold">
                                3.
                            </span>
                            <span>
                                Double click on the extracted <b>MyNotes</b>{" "}
                                file. MacOS will display a warning. We are going
                                to fix this in further steps. But for now, Press
                                the Done button that appears.
                            </span>
                        </li>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6 lg:mb-8">
                            <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                                <div className="flex w-full relative justify-center">
                                    <Image
                                        src="/images/tutorial/macos_prevents_app_launch.jpg"
                                        alt="macOS permission dialog for Apple Notes access"
                                        width={600}
                                        height={400}
                                        className="max-w-full w-full! h-auto rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                        <li className="flex gap-4">
                            <span className="font-mono text-blue-600 font-semibold">
                                4.
                            </span>
                            <span>
                                Open System Settings. Navigate to the{" "}
                                <b>Privacy and Security</b> tab and scroll all
                                the way down. Click on the Open Anyway button.
                            </span>
                        </li>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6 lg:mb-8">
                            <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                                <div className="flex w-full relative justify-center">
                                    <Image
                                        src="/images/tutorial/privacy_and_security_screen.jpg"
                                        alt="macOS permission dialog for Apple Notes access"
                                        width={600}
                                        height={400}
                                        className="max-w-full w-full! h-auto rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                        <li className="flex gap-4">
                            <span className="font-mono text-blue-600 font-semibold">
                                5.
                            </span>
                            <span>
                                Press the Open Anyway button that appears on the
                                warning prompt.
                            </span>
                        </li>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6 lg:mb-8">
                            <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                                <div className="flex w-full relative justify-center">
                                    <Image
                                        src="/images/tutorial/apple_unable_to_verify_open_anyway.jpg"
                                        alt="macOS permission dialog for Apple Notes access"
                                        width={600}
                                        height={400}
                                        className="max-w-full max-h-[400px] w-max h-auto rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                        <li className="flex gap-4">
                            <span className="font-mono text-blue-600 font-semibold">
                                6.
                            </span>
                            <span>
                                You may need to give administrator privileges.
                                If your Mac has Touch ID, you can usually use it
                                on this step.
                            </span>
                        </li>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6 lg:mb-8">
                            <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                                <div className="flex w-full relative justify-center">
                                    <Image
                                        src="/images/tutorial/admin_permission_screen.jpg"
                                        alt="macOS permission dialog for Apple Notes access"
                                        width={600}
                                        height={400}
                                        className="max-w-full max-h-[320px] w-max h-auto rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                        <li className="flex gap-4">
                            <span className="font-mono text-blue-600 font-semibold">
                                7.
                            </span>
                            <span>
                                A terminal will open. Copy the highlighted URL
                                it displays and paste it into your browser. If
                                given any, complete steps in the browser.
                            </span>
                        </li>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6 lg:mb-8">
                            <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                                <div className="flex w-full relative justify-center">
                                    <Image
                                        src="/images/tutorial/app_in_cli.jpg"
                                        alt="macOS permission dialog for Apple Notes access"
                                        width={600}
                                        height={400}
                                        className="max-w-full max-h-[320px] w-max h-auto rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                        <li className="flex gap-4">
                            <span className="font-mono text-blue-600 font-semibold">
                                8.
                            </span>
                            <span>
                                Once you complete the authorization, it should
                                look like the image provided below. The browser
                                will show an authorization successful page and
                                your terminal will indicate that it successfully
                                received the authorization. MacOS will give you
                                a consent screen to allow MyNotes to control
                                Notes. You&apos;re mostly done, now all you gotta do is just <b>Press Allow</b>.
                            </span>
                        </li>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6 lg:mb-8">
                            <div className="bg-white rounded-lg border border-blue-200 shadow-sm">
                                <div className="flex w-full relative justify-center">
                                    <Image
                                        src="/images/tutorial/auth_complete.jpg"
                                        alt="macOS permission dialog for Apple Notes access"
                                        width={600}
                                        height={500}
                                        className="max-w-full w-max h-auto w-full! rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </ol>
                    {/* <div className="mb-6 lg:mb-8">
                        <CLIOutput content={cliOutput} />
                    </div> */}
                </section>
                <section>
                    <h2 className="text-lg lg:text-xl font-semibold text-neutral-900 mb-4 lg:mb-6">
                        Step 3: Check Your Dashboard
                    </h2>
                    <p className="text-base text-neutral-700 mb-6 leading-relaxed">
                        Once the client is authorized and running, head to your
                        Mynotes dashboard. You should see:
                    </p>
                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-green-800 text-base">
                                Your Apple Notes appearing in the notes list
                            </span>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-green-800 text-base">
                                A notification showing &ldquo;X notes synced
                                successfully&rdquo;
                            </span>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-green-800 text-base">
                                The activity feed updating with the sync status
                            </span>
                        </div>
                    </div>

                    {/* <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <h4 className="font-semibold text-blue-900 mb-3 text-base">Keep the Client Running</h4>
            <p className="text-blue-800 text-base leading-relaxed">
              The macOS client needs to be running to sync changes from your Apple Notes. We recommend adding it to your startup items for the best experience.
            </p>
          </div> */}
                </section>
            </div>
        </div>
    );
}
