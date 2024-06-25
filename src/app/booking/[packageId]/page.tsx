import Bounded from "@/components/elements/Bounded";
import Package from "@/components/packages/Package";

interface BookingPage {
  params: {
    packageId: string;
  };
}

export default function PackagePage({ params }: BookingPage) {
  return (
    <main>
      <Package />
    </main>
  );
}
