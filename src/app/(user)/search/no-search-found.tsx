import { useAppDispatch } from "@/hooks/adminStore/reducer";
import { clearPackageSearch } from "@/lib/features/client/packageClientSlice";
import { Calendar, Compass, Search, Ship } from "lucide-react";

export default function NoSearchFound() {
  const dispatch = useAppDispatch();
  return (
    <div className="flex items-center justify-center  px-4 py-6">
      <div className="text-center max-w-md mx-auto">
        {/* Animated ship icon with waves */}
        <div className="relative my-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              {/* Waves background */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
                  <div
                    className="w-3 h-3 bg-primary/80 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                  <div
                    className="w-3 h-3 bg-primary/80 rounded-full animate-pulse"
                    style={{ animationDelay: "0.6s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"
                    style={{ animationDelay: "0.8s" }}
                  ></div>
                </div>
              </div>
              {/* Ship icon */}
              <div className="bg-gradient-to-br from-primary/60 to-primary/80 p-4 rounded-full shadow-lg">
                <Ship size={40} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main heading */}
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 leading-tight">
          No Cruises Available
        </h3>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
          We couldn&apos;t find any cruise schedules for your selected dates and
          package.
        </p>

        {/* Suggestions */}
        <div className="space-y-2 mb-8">
          <div className="flex items-start space-x-2 text-left">
            <Calendar className="text-primary mt-0.5 flex-shrink-0" size={18} />
            <p className="text-sm text-gray-700">
              Try adjusting your travel dates or choosing flexible dates
            </p>
          </div>

          <div className="flex items-start space-x-2 text-left">
            <Search className="text-primary mt-0.5 flex-shrink-0" size={18} />
            <p className="text-sm text-gray-700">
              Consider different cruise packages or destinations
            </p>
          </div>

          <div className="flex items-start space-x-2 text-left">
            <Compass className="text-primary mt-0.5 flex-shrink-0" size={18} />
            <p className="text-sm text-gray-700">
              Check our featured cruises for alternative options
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="px-6 py-3 bg-primary/80 hover:bg-primary text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
            Modify Search
          </button>
          <button
            onClick={() => {
              dispatch(clearPackageSearch());
            }}
            className="px-6 py-3 bg-white hover:bg-gray-50 text-primary/80 font-medium rounded-lg border-2 border-primary/80 transition-colors duration-200"
          >
            View All Cruises
          </button>
        </div>

        {/* Help text */}
        <p className="text-xs text-gray-500 mt-6">
          Need help finding the perfect cruise? Contact our travel specialists
          for personalized recommendations.
        </p>
      </div>
    </div>
  );
}
