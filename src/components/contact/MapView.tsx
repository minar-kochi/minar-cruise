import { GoogleMapsEmbed } from "@next/third-parties/google";

const MapView = () => {
  return (
    <div className="">
      <GoogleMapsEmbed
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!}
        height={600}
        width="100%"
        mode="place"
        q="Minar+Cruise+Cochin,cochin"   
      />
    </div>
  );
};

export default MapView;
