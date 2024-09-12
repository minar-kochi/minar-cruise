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
import { getPackageNavigation } from "@/db/data/dto/package";
import { cn } from "@/lib/utils";

export default async function MobileNavbar() {
  const packageDetails = await getPackageNavigation();

  if (!packageDetails) {
    return (
      // TODO: #LOW - Add a alternative to Image Gallery if not found / empty
      <></>
    );
  }
  return (
    <div>
      <Drawer>
        <DrawerTrigger>
          <Menu />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-center m-2">Navigations</DrawerTitle>
            <DrawerDescription className="py-5">
              <DrawerClose asChild>
                <Link href="/" className="cursor-pointer hover:text-red-500 ">
                  Home
                </Link>
              </DrawerClose>
              <hr className="border-gray-300 my-4" />

              <div>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="cursor-pointer  hover:text-red-500">
                      Packages
                    </AccordionTrigger>
                    <AccordionContent>
                      {packageDetails.map((item, i) => (
                        <div
                          className="border-2"
                          key={`a-${item.id}-Accordion-DrawerClose=${i}`}
                        >
                          <DrawerClose
                            asChild
                            key={`a-${item.id}-Accordion-DrawerClose=${i}-component`}
                          >
                            <Link href={`/package/${item.slug}`}>
                              <p className="hover:text-red-500  py-2">
                                {item.title}
                              </p>
                            </Link>
                          </DrawerClose>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <hr className="border-gray-300 my-4" />
              <DrawerClose asChild>
                <Link
                  href="/facilities"
                  className="cursor-pointer  hover:text-red-500 "
                >
                  Facilities
                </Link>
              </DrawerClose>

              <hr className="border-gray-300 my-4" />
              <DrawerClose asChild>
                <Link
                  href="/about"
                  className="cursor-pointer  hover:text-red-500 "
                >
                  About
                </Link>
              </DrawerClose>

              <hr className="border-gray-300 my-4" />

              <div>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Gallery</AccordionTrigger>
                    <AccordionContent>
                      <DrawerClose asChild>
                        <Link href="/gallery/family-gathering">
                          <p className="hover:text-red-500 py-2">
                            Family Gathering
                          </p>
                        </Link>
                      </DrawerClose>
                      <DrawerClose asChild>
                        <Link href="/gallery/celebration-gathering">
                          <p className="hover:text-red-500  py-2">
                            Celebration Events
                          </p>
                        </Link>
                      </DrawerClose>
                      <DrawerClose>
                        <Link href="/gallery/corporate-gathering">
                          <p className="hover:text-red-500  pt-2">
                            Corporate Events{" "}
                          </p>
                        </Link>
                      </DrawerClose>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <hr className="border-gray-300 my-4" />

              <DrawerClose>
                <Link
                  href="/contact"
                  className="cursor-pointer  hover:text-red-500 "
                >
                  Contact
                </Link>
              </DrawerClose>
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
