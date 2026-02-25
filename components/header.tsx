"use client";

import Image from "next/image";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Header() {
  return (
    <header className="border-b bg-primary text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex flex-col items-start">
          <Image
            src="/logo-yogurtland.svg"
            alt="Yogurtland"
            width={140}
            height={40}
            className="h-8 w-auto brightness-0 invert sm:h-10"
            priority
          />
          <p className="mt-1 text-xs text-white/80 sm:text-sm">
            Local Store Marketing Portal
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden text-right text-sm sm:block">
            <p className="font-semibold">Store #1234</p>
            <p className="text-white/80">Yogurtland - Downtown LA</p>
          </div>
          <Separator orientation="vertical" className="hidden h-10 bg-white/30 sm:block" />
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
