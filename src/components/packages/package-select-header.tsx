import React from "react";
import { Anchor, Compass, MapPin, Star, Waves } from "lucide-react";

const CruisePackageHeader: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br  text- py-16 px-6 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 animate-bounce">
          <Anchor className="w-8 h-8 text-primary" />
        </div>
        <div className="absolute top-20 right-20 animate-pulse">
          <Compass className="w-6 h-6 text-primary" />
        </div>
        <div className="absolute bottom-16 left-1/4 animate-bounce delay-300">
          <Waves className="w-7 h-7 text-primary" />
        </div>
        <div className="absolute bottom-20 right-1/3 animate-pulse delay-500">
          <Star className="w-5 h-5 text-primary" />
        </div>
        <div className="absolute top-1/2 left-16 animate-bounce delay-700">
          <MapPin className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Decorative waves */}
      <div className="absolute bottom-0 left-0 right-0 h-6  opacity-20">
        <svg
          className="w-full h-full "
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C120,10 240,70 360,40 C480,10 600,70 720,40 C840,10 960,70 1080,40 C1140,25 1170,32.5 1200,40 L1200,120 L0,120 Z"
            fill="currentColor"
            className="animate-pulse text-blue-600"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/80 text-white backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/30">
          <Anchor className="w-4 h-4" />
          <span className="text-sm font-medium ">
            Premium Cruise Experiences
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          Find Your Perfect
          <br/>
          <span className=" bg-gradient-to-r from-red-400/80 to-red-600 bg-clip-text text-transparent">
            Adventure Package
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-black mb-8 max-w-2xl mx-auto leading-relaxed">
          Compare our carefully curated cruise packages and discover the journey
          that matches your dreams. From luxury Breakfast cruise to family adventures.
        </p>

        {/* Feature highlights */}

        {/* Call to action hint */}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
    </div>
  );
};

export default CruisePackageHeader;
