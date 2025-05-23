// "use client"; // Runs only on the client side

// import { useEffect, useRef } from "react";
// import Image from "next/image";
// type {
//     allImages:  {
//         url: string;
//         alt: string;
//     }[]
// }
// const ParallaxGallery = ({ allImages }) => {
//   const galleryRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (!galleryRef.current) return;

//       const scrollY = window.scrollY;
//       const images = galleryRef.current.querySelectorAll(".parallax-image");

//       images.forEach((image, index) => {
//         const imgElement = image as HTMLElement; // ✅ Cast Element to HTMLElement
//         const speed = 0.2 + index * 0.05; // Different speeds for depth effect
//         imgElement.style.transform = `translateY(${scrollY * speed}px) scale(1.1)`;
//       });
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <div className="relative overflow-hidden py-20">
//       <p className="text-slate-500 mx-auto md:px-28 mb-16 text-center text-lg">
//         Explore the gallery with a smooth parallax effect.
//       </p>
//       <div
//         ref={galleryRef}
//         className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 md:px-16"
//         style={{ perspective: "1000px" }}
//       >
//         {allImages.map(({ url }, i) => (
//           <div
//             key={url}
//             className="relative overflow-hidden rounded-xl parallax-image"
//           >
//             <Image
//               src={url}
//               alt="gallery image"
//               width={1000}
//               height={600}
//               className="object-cover w-full h-full rounded-xl transition-transform duration-500"
//               style={{ transformOrigin: "center" }}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ParallaxGallery;
