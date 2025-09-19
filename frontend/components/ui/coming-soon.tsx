'use client'
import Image from "next/image";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Song_Myung } from "next/font/google";

// Load Song Myung font for brand text only
const songMyung = Song_Myung({ weight: "400" });

interface ComingSoonProps {
  title?: string;
  subtitle?: string;
  imageSrc?: string;
  showBrand?: boolean;
  actions?: ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export function ComingSoon({
  title = "Coming Soon",
  subtitle = "Will come with performance in design",
  imageSrc = "/coming-soon-robot.png",
  showBrand = true,
  actions,
  className,
  fullHeight = false,
}: ComingSoonProps) {
  const pathname = usePathname();
  
  // Check if current route is in settings section
  const isSettingsRoute = pathname?.startsWith('/dashboard/settings');
  
  // Determine minimum height based on route
  const minHeight = isSettingsRoute ? 'min-h-[80vh]' : 'min-h-[95vh] lg:min-h-[90vh]';
  
  return (
    
      
      <div className={`w-full flex ${minHeight} md:rounded-[16px] bg-white items-center justify-center`}>
        <div className="flex flex-col md:flex-row md:justify-center justify-start items-center xl:gap-5 w-full">
          {/* Left: Text */}
          <div className=" md:w-3/5 xl:w-auto text-center w-full">
            {showBrand && (
              <div className="flex items-center justify-center md:justify-center gap-3 mb-6 w-3/5 md:w-full">
                <img src="/logo.png" alt="Scalebuild.ai Logo" className="w-10 h-10 rounded-full" />
                <span
                  className={cn(songMyung.className, "text-gray-900 font-normal text-xl md:text-2xl")}
                >
                  Hyperscaler
                </span>
              </div>
            )}

            <h1
              className="w-3/5 md:w-full tracking-tight font-medium text-2xl text-primary-700 md:text-[52px] xl:text-[72px] md:font-semibold"
              
            >
              {title}
            </h1>
            <p
              className="w-3/5 md:w-full mt-2 md:mt-8 text-gray-600 text-base md:text-lg"
              
            >
              {subtitle}
            </p>

            {actions && <div className="mt-6">{actions}</div>}
          </div>

          {/* Right: Illustration */}
          <div className="w-1/2 xl:w-auto md:w-2/5 flex flex-col gap-[2px] items-center justify-center relative">
            {/* Soft ellipse shadow below the robot's waist */}
            <Image
              src={imageSrc}
              alt="Robot illustration"
              width={500}
              height={520}
              priority
              className="relative z-10 w-full max-w-[420px] md:max-w-[520px] h-auto select-none -right-24 -top-[140px] md:right-0 md:top-0"
            />
            <div className="relative -right-24 -top-[150px] pointer-events-none translate-y-[20%] w-[48%] h-[11px] rounded-[100px] bg-[#1A1A1A] blur-[10px] ml-7 md:right-0 md:top-0"></div>
          </div>
        </div>
      </div>
    
  );
}

export default ComingSoon;

