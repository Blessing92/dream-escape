import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { editCabin } from "../../services/apiCabins"

export const useEditCabin = () => {
  const queryClient = useQueryClient()

  const { mutate: editACabin, isPending: isEditing } = useMutation({
    mutationFn: editCabin,
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: ["cabins"],
        })
        .then(() => {
          toast.success("Cabin edited successfully.", { autoClose: 3000 })
        })
    },
    onError: (err) => {
      toast.error(err.message, { autoClose: 5000 })
    },
  })

  return { editACabin, isEditing }
}
