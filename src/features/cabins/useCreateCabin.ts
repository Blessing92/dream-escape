import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { createCabin } from "../../services/apiCabins"

export const useCreateCabin = () => {
  const queryClient = useQueryClient()

  const { mutate: createACabin, isPending: isCreating } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: ["cabins"],
        })
        .then(() => {
          toast.success("New cabin created successfully.", { autoClose: 2000 })
        })
    },
    onError: (err) => {
      toast.error(err.message, { autoClose: 2000 })
    },
  })

  return { createACabin, isCreating }
}
