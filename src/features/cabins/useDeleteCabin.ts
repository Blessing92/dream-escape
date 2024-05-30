import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { deleteCabinApi } from "../../services/apiCabins"

export const useDeleteCabin = () => {
  const queryClient = useQueryClient()

  const { isPending: isDeleting, mutate: deleteCabin } = useMutation({
    mutationFn: deleteCabinApi,
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: ["cabins"],
        })
        .then(() => {
          toast.success("Cabins deleted successfully.", {
            autoClose: 3000,
          })
        })
    },
    onError: (err) => toast.error(err.message, { autoClose: 5000 }),
  })

  return { isDeleting, deleteCabin }
}
