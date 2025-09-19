import Image from "next/image";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: ReactNode;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="relative z-10 flex flex-col items-center w-full">
      {/* Gradient section with logo on top */}
      <div className="relative w-full mt-8 h-56 sm:h-64">
        {/* Restore original rainbow gradient rectangle at the top */}
        <div className="absolute top-0 left-0 right-0 h-40 filter blur-2xl">
          <div className="h-full w-full bg-header-gradient opacity-80" />
        </div>

        {/* Logo placed over the gradient */}
        <div className="absolute left-1/2 top-8 z-10 -translate-x-1/2 transform">
          <div className="bg-white rounded-full shadow-lg flex items-center justify-center w-[96px] h-[96px] md:w-[130px] md:h-[130px] border border-gray-200">
            <Image
              src="/logo.png"
              alt="Logo"
              width={102}
              height={102}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Text section below the gradient + logo */}
      <div className="w-full px-4 text-center">
        <h1 className="text-black font-open-sans font-semibold text-2xl sm:text-3xl md:text-5xl leading-tight sm:leading-[2.5rem] md:leading-[60px] mb-2 sm:mb-3">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-neutral-800/90 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
