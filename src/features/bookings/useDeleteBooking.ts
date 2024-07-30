import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { deleteBookingApi } from "../../services/apiBookings"

export const useDeleteBooking = () => {
  const queryClient = useQueryClient()

  const { isPending: isDeleting, mutate: deleteBooking } = useMutation({
    mutationFn: deleteBookingApi,
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: ["bookings"],
        })
        .then(() => {
          toast.success("Booking deleted successfully.", {
            autoClose: 3000,
          })
        })
    },
    onError: (err) => toast.error(err.message, { autoClose: 3000 }),
  })

  return { isDeleting, deleteBooking }
}
