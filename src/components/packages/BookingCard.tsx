import { cn } from "@/lib/utils"

const BookingCard = ({ className }:{
  className?: string; 
}) => {
  return (
    <section className={cn("", className)}>Bookingcard</section>
  )
}

export default BookingCard