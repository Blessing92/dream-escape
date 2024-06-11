import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { updateSettingApi } from "../../services/apiSettings"

export const useUpdateSettings = () => {
  const queryClient = useQueryClient()

  const { mutate: updateSetting, isPending: isUpdating } = useMutation({
    mutationFn: updateSettingApi,
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: ["settings"],
        })
        .then(() => {
          toast.success("Setting edited successfully.", { autoClose: 2000 })
        })
    },
    onError: (err) => {
      toast.error(err.message, { autoClose: 5000 })
    },
  })

  return { updateSetting, isUpdating }
}
