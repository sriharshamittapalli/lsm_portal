"use client";

import { Header } from "@/components/header";
import { DesignRequests } from "@/components/design-requests";
import { StoreHoursChanges } from "@/components/store-hours-changes";
import { PriceChanges } from "@/components/price-changes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, BookOpen, Folder, FolderOpen, Clock, DollarSign, ClipboardList, Loader2, ShoppingBag, ExternalLink, UtensilsCrossed, GraduationCap, Trophy, Briefcase, Clock3 } from "lucide-react";
import { useState } from "react";

const MARKETING_FOLDERS = [
  { label: "Catering", icon: UtensilsCrossed },
  { label: "Schools", icon: GraduationCap },
  { label: "Sports", icon: Trophy },
  { label: "Businesses", icon: Briefcase },
  { label: "Hours Signs", icon: Clock3 },
];

export default function Home() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

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
              <TabsTrigger value="evergreen-order-form">
                <ClipboardList className="mr-2 h-4 w-4" />
                Evergreen Order Form
              </TabsTrigger>
              <TabsTrigger value="uniforms-catering-bags">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Uniforms &amp; Catering Bags
              </TabsTrigger>
            </TabsList>

            <TabsContent value="design-requests">
              <DesignRequests />
            </TabsContent>

            <TabsContent value="marketing-assets">
              <div className="flex rounded-lg border bg-background overflow-hidden min-h-[480px]">
                {/* Left: folder list */}
                <div className="w-56 shrink-0 border-r bg-muted/30">
                  <nav className="flex flex-col">
                    {MARKETING_FOLDERS.map(({ label, icon: Icon }) => {
                      const isActive = activeFolder === label;
                      return (
                        <button
                          key={label}
                          onClick={() => setActiveFolder(label)}
                          className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left w-full ${isActive
                              ? "bg-primary/10 text-primary font-medium border-r-2 border-primary"
                              : "text-foreground hover:bg-muted"
                            }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {label}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Right: contents */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                  {activeFolder ? (
                    <>
                      <FolderOpen className="h-10 w-10 text-muted-foreground/40 mb-3" />
                      <p className="text-sm font-medium text-muted-foreground">Coming Soon</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        SharePoint assets for <span className="font-medium">{activeFolder}</span> will appear here.
                      </p>
                    </>
                  ) : (
                    <>
                      <FolderOpen className="h-10 w-10 text-muted-foreground/30 mb-3" />
                      <p className="text-sm">Select a category on the left to view assets.</p>
                    </>
                  )}
                </div>
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

            <TabsContent value="evergreen-order-form">
              <div className="relative h-[80vh] w-full rounded-lg overflow-hidden">
                {!iframeLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-3 text-sm text-muted-foreground">Loading Evergreen Order Form...</p>
                  </div>
                )}
                <iframe
                  src={process.env.NEXT_PUBLIC_JOTFORM_URL}
                  className="h-full w-full border-0"
                  allow="fullscreen"
                  title="Evergreen Order Form"
                  onLoad={() => setIframeLoaded(true)}
                />
              </div>
            </TabsContent>
            <TabsContent value="uniforms-catering-bags">
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 gap-4">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Uniforms &amp; Catering Bags</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Order uniforms and catering bags through the Yogurtland Crew store.
                  </p>
                </div>
                <a
                  href="https://yogurtlandcrew.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                >
                  Go to Yogurtland Crew Store
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
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
