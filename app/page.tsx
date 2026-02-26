"use client";

import { Header } from "@/components/header";
import { DesignRequests } from "@/components/design-requests";
import { StoreHoursChanges } from "@/components/store-hours-changes";
import { PriceChanges } from "@/components/price-changes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, BookOpen, FolderOpen, Clock, DollarSign } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <Header />

      <main className="w-full flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <Tabs defaultValue="design-requests">
            <TabsList className="mb-6 w-full justify-start overflow-x-auto">
              <TabsTrigger value="design-requests">
                <Palette className="mr-2 h-4 w-4" />
                Design Requests
              </TabsTrigger>
              <TabsTrigger value="marketing-assets">
                <FolderOpen className="mr-2 h-4 w-4" />
                Marketing Assets
              </TabsTrigger>
              <TabsTrigger value="gift-cards">
                <BookOpen className="mr-2 h-4 w-4" />
                Gift Cards
              </TabsTrigger>
              <TabsTrigger value="store-hours">
                <Clock className="mr-2 h-4 w-4" />
                Store Hours Change
              </TabsTrigger>
              <TabsTrigger value="price-change">
                <DollarSign className="mr-2 h-4 w-4" />
                Price Change
              </TabsTrigger>
            </TabsList>

            <TabsContent value="design-requests">
              <DesignRequests />
            </TabsContent>

            <TabsContent value="marketing-assets">
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20">
                <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold text-muted-foreground">
                  Marketing Assets
                </h3>
                <p className="text-sm text-muted-foreground">
                  Coming Soon — Downloadable templates, logos, and brand assets.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="brand-guidelines">
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20">
                <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold text-muted-foreground">
                  Brand Guidelines
                </h3>
                <p className="text-sm text-muted-foreground">
                  Coming Soon — Official Yogurtland brand guidelines and usage rules.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="store-hours">
              <StoreHoursChanges />
            </TabsContent>

            <TabsContent value="price-change">
              <PriceChanges />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t px-4 py-4 text-center text-xs text-muted-foreground sm:px-6 sm:py-6 sm:text-sm">
        <p>&copy; 2026 Yogurtland Franchising, Inc.</p>
        <p className="mt-1">
          Need help? Contact:{" "}
          <a
            href="mailto:marketingdept@yogurtland.com"
            className="underline hover:text-foreground"
          >
            marketingdept@yogurtland.com
          </a>
        </p>
      </footer>
    </div>
  );
}
