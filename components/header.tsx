"use client";

import { CupSoda, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Header() {
  return (
    <header className="border-b bg-primary text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <CupSoda className="h-6 w-6 shrink-0 sm:h-8 sm:w-8" />
          <div>
            <h1 className="text-lg font-bold leading-tight sm:text-xl">Yogurtland</h1>
            <p className="text-xs text-white/80 sm:text-sm">
              Local Store Marketing Portal
            </p>
          </div>
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
