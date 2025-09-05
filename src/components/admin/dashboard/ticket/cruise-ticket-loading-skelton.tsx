const CruiseTicketLoadingSkelton = ({
  size,
  loading = true,
}: {
  size?: "sm" | "lg";
  loading?: boolean;
}) => {
  return (
    <div className=" bg-gray-100 flex items-center justify-center z-50 p-2 sm:p-4 md:p-8">
      <div
        className="relative bg-white shadow-2xl overflow-hidden"
        style={{
          width: size === "sm" ? "150px" : "210mm",
          height: size === "sm" ? "200px" : "297mm",
          // maxWidth: "90vw",
          // maxHeight: "90vh",
          // aspectRatio: "210/297",
        }}
      >
        {/* Electric blue shiny glass animation */}
        {loading ? (
          <div
            className="absolute electric-shine-fullscreen opacity-40"
            style={{
              background:
                "linear-gradient(45deg, transparent 25%, rgba(59,130,246,0.3) 35%, rgba(147,197,253,0.7) 45%, rgba(255,255,255,0.95) 50%, rgba(147,197,253,0.7) 55%, rgba(59,130,246,0.3) 65%, transparent 75%)",
              width: "200%",
              height: "200%",
              top: "-50%",
              left: "-50%",
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default CruiseTicketLoadingSkelton;
