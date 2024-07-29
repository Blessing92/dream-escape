import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { updateBooking } from "../../services/apiBookings"

interface CheckinProps {
  bookingId: string
  breakfast?: {
    hasBreakfast: boolean
    extrasPrice: number
    totalPrice: number
  }
}

export function useChecking() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: checkin, isPending: isCheckingIn } = useMutation({
    mutationFn: ({ bookingId, breakfast }: CheckinProps) =>
      updateBooking(bookingId, {
        status: "checked-in",
        isPaid: true,
        ...breakfast,
      }),
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked in`, {
        autoClose: 2000,
      })
      queryClient.invalidateQueries()

      navigate("/")
    },
    onError: (err) => {
      toast.error(err.message, { autoClose: 2000 })
    },
  })

  return { checkin, isCheckingIn }
}
