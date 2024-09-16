import { getToday } from "../utils/helpers"
import supabase from "./supabase"
import { Booking } from "../types"
import { PAGE_SIZE } from "../utils/constants"

interface GetBookingsProp {
  filter: { field: string; value: string; method?: FilterMethod } | null
  sortBy: { field: string; direction: string }
  page: number
}

interface GetBookingsResponse {
  data: Booking[]
  count: number | null
}

type FilterMethod =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "like"
  | "ilike"

export const getBookings = async (
  props: GetBookingsProp,
): Promise<GetBookingsResponse> => {
  let query = supabase
    .from("bookings")
    .select("*, cabins(name), guests(fullName, email)", { count: "exact" })

  if (props.filter) {
    const method = props.filter.method || "eq"
    query = (query[method] as (field: string, value: string) => typeof query)(
      props.filter.field,
      props.filter.value,
    )
  }

  if (props.sortBy) {
    query = query.order(props.sortBy.field, {
      ascending: props.sortBy.direction === "asc",
    })
  }

  if (props.page) {
    const from = (props.page - 1) * (PAGE_SIZE - 1)
    const to = from + PAGE_SIZE - 1
    query = query.range(from, to)
  }

  const { data, error, count } = await query

  if (error) {
    throw new Error(`Unable to get bookings ${error}`)
  }

  return { data: data as Booking[], count }
}

export async function getBooking(id: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single()

  if (error) {
    console.error(error)
    throw new Error("Booking not found")
  }

  return data
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    // .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }))

  if (error) {
    console.error(error)
    throw new Error("Bookings could not get loaded")
  }

  return data
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday())

  if (error) {
    console.error(error)
    throw new Error("Bookings could not get loaded")
  }

  return data
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`,
    )
    .order("created_at")

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error)
    throw new Error("Bookings could not get loaded")
  }
  return data
}

type UpdateBookingFields = Partial<Omit<Booking, "id">>

export async function updateBooking(id: string, obj?: UpdateBookingFields) {
  if (!id) {
    throw new Error("Booking ID is required")
  }
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(error)
    throw new Error("Booking could not be updated")
  }
  return data as Booking
}

export async function deleteBookingApi(bookingId: string) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId)

  if (error) {
    console.error(error)
    throw new Error("Booking could not be deleted")
  }
  return data
}
