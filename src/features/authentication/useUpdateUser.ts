import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { updateCurrentUser } from "../../services/apiAuth"

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(["user"], user)
      toast.success("User account updated successfully.", {
        autoClose: 2000,
      })
    },
    onError: (err) => {
      toast.error(err.message, { autoClose: 5000 })
    },
  })

  return { updateUser, isUpdating }
}
