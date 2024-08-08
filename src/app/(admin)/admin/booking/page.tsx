import AllSchedules from "@/components/admin/booking/AllSchedules";

export default function page() {
  return (
    <div className="">
      <h2 className="text-xl md:text-3xl font-bold border  flex justify-center py-8 border-b">
        Select a schedule
      </h2>
      <div className="">
        {/* //add something else */}
        <AllSchedules />
      </div>
    </div>
  );
}
