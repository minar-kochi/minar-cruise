import { Button } from "@/components/ui/button";
import { TOfflineBookingFormSchema } from "@/lib/validators/offlineBookingValidator";
import { UseFormSetValue } from "react-hook-form";
import { faker } from "@faker-js/faker";

interface IPrefillButtonProps {
  setValue: UseFormSetValue<TOfflineBookingFormSchema>;
}
export default function PrefillButton({ setValue }: IPrefillButtonProps) {
  function handlePrefill() {
    setValue("name", (() => faker.person.fullName())());
    setValue("phone", "9498332210");
    setValue("email", (() => faker.internet.email())());
    setValue("adultCount", (() => faker.number.int({ max: 7, min: 1 }))());
    setValue("childCount", (() => faker.number.int({ max: 4 }))());
    setValue("babyCount", (() => faker.number.int({ max: 3 }))());
    setValue("discount", 200);
    setValue("paymentMode", "GPAY");
    setValue("advanceAmount", 2000);
    setValue("billAmount", 2000);
    setValue("description", (() => faker.lorem.words({ max: 5, min: 2 }))());
  }

  return (
    <Button variant={"link"} onClick={handlePrefill}>
      <p className="font-bold text-xl text-blue-300">Prefill Random details</p>
    </Button>
  );
}
