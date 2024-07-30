import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { updateBooking } from "../../services/apiBookings"

export function useCheckout() {
  const queryClient = useQueryClient()

  const { mutate: checkout, isPending: isCheckingOut } = useMutation({
    mutationFn: (bookingId: string) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked out`, {
        autoClose: 2000,
      })
      queryClient.invalidateQueries()
    },
    onError: (err) => {
      toast.error(err.message, { autoClose: 2000 })
    },
  })

  return { checkout, isCheckingOut }
}
