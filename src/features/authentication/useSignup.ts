import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { signup as signupApi } from "../../services/apiAuth"

export function useSignup() {
  const { mutate: signup, isPending } = useMutation({
    mutationFn: signupApi,
    onSuccess: () => {
      toast.success(
        "Account created successfully! Please verify the new account from the user's email address",
        { autoClose: 2000 },
      )
    },
  })

  return { signup, isPending }
}
