import { ComingSoon } from "@/components/ui/coming-soon";

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#737C85]/60 py-6">
      {/* Constrain to site content width and center the card */}
      <div className="w-full max-w-[1200px] px-4">
        <ComingSoon fullHeight />
      </div>
    </main>
  );
}
