import { Menu } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { TPackageNavigation } from "@/db/types/TPackage";

// Define TypeScript interfaces for our data structures
interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}

interface PackageItem {
  id: string;
  title: string;
  slug: string;
}

interface Props {
  packages: TPackageNavigation[];
}

const navigation: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Gallery",
    href: "#",
    children: [
      {
        title: "Family Gathering",
        href: "/gallery/family-gathering",
      },
      {
        title: "Celebration Events",
        href: "/gallery/celebration-gathering",
      },
      {
        title: "Corporate Events",
        href: "/gallery/corporate-gathering",
      },
    ],
  },
  {
    title: "Facilities",
    href: "/facilities",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

export default function MobileNavbar({ packages }: Props) {
  return (
    <div className="lg:hidden">
      <Drawer>
        <DrawerTrigger asChild>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </DrawerTrigger>

        <DrawerContent className="fixed inset-x-0 bottom-0 h-[96vh] flex flex-col ">
          <DrawerHeader className="flex-none border-b">
            <DrawerTitle className="text-2xl font-bold text-center">
              Navigation
            </DrawerTitle>
            <DrawerDescription className="text-base text-center">
              Discover your perfect cruise experience
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 py-6 space-y-6 flex-1 overflow-y-auto">
            {/* Primary CTA */}
            <DrawerClose asChild>
              <Link
                href="/"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full text-center text-lg",
                )}
              >
                Find Your Cruise
              </Link>
            </DrawerClose>
            {
              <div className="pt-4">
                <Accordion type="single" collapsible>
                  <AccordionItem value="packages">
                    <AccordionTrigger className="text-lg font-medium">
                      Available Packages
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {packages.map((pkg) => (
                          <DrawerClose key={pkg.id} asChild>
                            <Link
                              href={`/package/${pkg.slug}`}
                              className="block px-4 py-2 text-base hover:text-primary transition-colors"
                            >
                              {pkg.title}
                            </Link>
                          </DrawerClose>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            }
            <hr/>
            {/* Main Navigation */}
            <nav className="space-y-1">
              {navigation.map((item) =>
                item.children ? (
                  <Accordion
                    key={item.title}
                    type="single"
                    collapsible
                    className="border-b border-gray-200"
                  >
                    <AccordionItem value={item.title}>
                      <AccordionTrigger className="py-3 text-lg font-medium hover:text-primary">
                        {item.title}
                      </AccordionTrigger>
                      <AccordionContent className="pb-2">
                        <div className="space-y-2">
                          {item.children.map((child) => (
                            <DrawerClose key={child.href} asChild>
                              <Link
                                href={child.href}
                                className="block px-4 py-2 text-base hover:text-primary transition-colors"
                              >
                                {child.title}
                              </Link>
                            </DrawerClose>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <DrawerClose key={item.href} asChild>
                    <Link
                      href={item.href}
                      className="block py-3 text-lg font-medium hover:text-primary transition-colors border-b border-gray-200"
                    >
                      {item.title}
                    </Link>
                  </DrawerClose>
                ),
              )}
            </nav>

            {/* Packages Section */}
          </div>

          <DrawerFooter className="flex-none border-t">
            <p className="text-sm text-center text-gray-500">
              © 2025 Your Cruise Company
            </p>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
