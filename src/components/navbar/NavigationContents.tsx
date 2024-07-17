// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/ui/navigation-menu";
// import { getPackageNavigation } from "@/db/data/dto/package";

// import Link from "next/link";

// const NavigationContents = async () => {
//   const packageDetails = await getPackageNavigation();

//   if (!packageDetails) {
//     return (
//       // TODO: #LOW - Add a alternative to Image Gallery if not found / empty
//       <></>
//     );
//   }
//  // TODO: enhance this navigation
//   return (
//     <NavigationMenu >
//       <NavigationMenuList className="flex justify-between gap-3 w-full">
//         <NavigationMenuItem>
//           <ListItem href="/" title="Home" className="" />
//         </NavigationMenuItem>
//         <NavigationMenuItem>
//           <ListItem href="/facilities" title="Facilities" />
//         </NavigationMenuItem>
//         <NavigationMenuItem>
//           <ListItem href={"/about"} title="About" key={"about-0102"} />
//         </NavigationMenuItem>
//         <NavigationMenuItem>
//           <NavigationMenuTrigger>Packages</NavigationMenuTrigger>
//           <NavigationMenuContent>
//             <ul className="w-[300px] items-center	">
//               {packageDetails.map((item, i) => (
//                 <>
//                   <ListItem
//                     className=""
//                     href={`/booking/${item.slug}`}
//                     title={item.title}
//                     key={item.id + i}
//                   />
//                 </>
//               ))}
//             </ul>
//           </NavigationMenuContent>
//         </NavigationMenuItem>
//         <NavigationMenuItem>
//           <NavigationMenuTrigger>Gallery</NavigationMenuTrigger>
//           <NavigationMenuContent>
//             {/* Todo need styling for gallery dropdown  */}
//             <ul className="w-[300px] leading-9 grid place-content-center">
//               <ListItem
//                 href={"/gallery/family-gathering"}
//                 title="Family gathering"
//                 key={"Family gathering"}
//               />
//               <ListItem
//                 href={"/gallery/corporate-gathering"}
//                 title="Corporate gathering"
//               />
//               <ListItem
//                 href={"/gallery/celebration-gathering"}
//                 title="Celebration gathering"
//               />
//             </ul>
//           </NavigationMenuContent>
//         </NavigationMenuItem>
//         <NavigationMenuItem>
//           <ListItem href="/contact" key={"contact"} title="Contact" />
//         </NavigationMenuItem>
//       </NavigationMenuList>
//     </NavigationMenu>
//   );
// };

// function ListItem({
//   href,
//   children,
//   className,
//   title,
//   ...props
// }: {
//   href: string;
//   title: string;
//   className?: string;
//   children?: React.ReactNode;
// }) {
//   return (
//     <NavigationMenuLink asChild>
//       <Link href={href}>
//         <p className="">{title}</p>
//       </Link>
//     </NavigationMenuLink>
//   );
// }

// export default NavigationContents;
