"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ChevronLeftIcon from "@/components/icons/ChevronLeftIcon";

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
  inline?: boolean;
}

export function BackButton({ onClick, className, inline = false }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  if (inline) {
    return (
      <Button
        onClick={handleClick}
        variant="outline"
        size="icon"
        className={`w-12 h-12 rounded-full border-primary-200 bg-primary-50 hover:bg-primary-100 ${className || ""}`}
      >
        <ChevronLeftIcon size={24} color="#9e32dd" />
      </Button>
    );
  }

  return (
    <div className={`relative w-full bg-white rounded-t-[20px] py-6 ${className || ""}`}>
      <Button
        onClick={handleClick}
        variant="outline"
        size="icon"
        className="w-12 h-12 rounded-full border-primary-200 bg-primary-50 hover:bg-primary-100"
      >
        <ChevronLeftIcon size={24} color="#1C274C" />
      </Button>
    </div>
  );
}
