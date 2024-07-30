import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { login as loginApi } from "../../services/apiAuth"
import { SignupProps } from "../../types"

export function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ email, password }: SignupProps) =>
      loginApi({ email, password }),
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user)
      navigate("/dashboard")
    },
    onError: (error) => {
      console.log("Error logging in", error)
      toast.error("Provided email or password is incorrect", {
        autoClose: 3000,
      })
    },
  })

  return { login, isPending }
}
