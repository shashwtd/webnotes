interface CLIOutputProps {
  content: string;
}

export default function CLIOutput({ content }: CLIOutputProps) {
  return (
    <div className="my-8 overflow-hidden rounded-lg bg-[#1E1E1E] text-white font-mono text-sm">
      <div className="px-4 py-2 bg-[#2D2D2D] border-b border-[#404040] flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        <span className="text-neutral-400 text-xs ml-2">Terminal</span>
      </div>
      <div className="p-4 leading-relaxed whitespace-pre-wrap">
        <span className="text-green-400">➜</span> {content}
      </div>
    </div>
  );
}
