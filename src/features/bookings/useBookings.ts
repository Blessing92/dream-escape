import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { getBookings } from "../../services/apiBookings"
import { PAGE_SIZE } from "../../utils/constants"

export const useBookings = () => {
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()

  // Filter
  const filterValue = searchParams.get("status")
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue }

  // SortBy
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc"
  const [field, direction] = sortByRaw.split("-")
  const sortBy = { field, direction }

  // Pagination
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"))

  const { isPending, data, error } = useQuery({
    queryKey: ["bookings", filter, sortBy, page],
    queryFn: () => getBookings({ filter, sortBy, page }),
  })

  // Prefetch next page
  const pageCount = data?.count ? Math.ceil(data.count / PAGE_SIZE) : 0

  if (page < pageCount) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page + 1],
      queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
    })
  }

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page - 1],
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
    })
  }

  const bookings = data?.data ?? []
  const count = data?.count ?? 0

  return { isPending, bookings, error, count }
}
