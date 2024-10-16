import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ICustomDialog {
  ButtonLabel: string;
  ButtonVariant?:
    | "confirm"
    | "greenFlag"
    | "destructiveOutline"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  ButtonClassName?: string;
  DialogTitleContent?: string;
  DialogDescriptionContent?: string;
}

export default function CustomDialog({
  ButtonLabel,
  ButtonVariant,
  DialogTitleContent,
  DialogDescriptionContent,
  ButtonClassName,
}: ICustomDialog) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={ButtonVariant ?? "outline"}
          className={ButtonClassName}
        >
          {ButtonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:min-w-[900px] py-8">
        <DialogHeader>
          <DialogTitle className="text-center text-4xl ">
            Booking Information
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="">
          Name, contact, email, bookingId, total amount, time: 9-11, total
          count, date of booking , date of event , package selected
        </div>
        <DialogFooter>
          <Button>Download</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
