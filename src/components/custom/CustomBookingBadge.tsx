"use client"


interface ICustomBookingBadgeProps {
    label: string
    bookingId: string
}
export default function CustomBookingBadge({ label, bookingId }: ICustomBookingBadgeProps) {
  return (
    <div>{label}</div>
  )
}
