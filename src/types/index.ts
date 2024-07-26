export interface CabinType {
  id: number
  created_at: string
  name: string
  maxCapacity: number
  regularPrice: number
  discount: number
  description: string
  image: string | File
}

export interface CabinCreationType {
  name: string
  maxCapacity: number
  regularPrice: number
  discount: number
  description: string
  image: string | File
}

export interface Settings {
  id: string
  created_at: string
  minBookingLength: number
  maxBookingLength: number
  maxGuestsPerBooking: number
  breakfastPrice: number
}

export interface SettingsUpdate {
  id: string
  created_at: string
  minBookingLength: number
  maxBookingLength: number
  maxGuestsPerBooking: number
  breakfastPrice: number
}

export interface Guest {
  id: string
  created_at: string
  fullName: string
  email: string
  nationality: string
  countryFlag: string
  nationalID: string
}

export type Status = "unconfirmed" | "checked-in" | "checked-out"

export interface Booking {
  id: string
  created_at: string
  startDate: string
  endDate: string
  numNights: string
  numGuests: number
  cabinPrice: number
  extrasPrice: number
  totalPrice: number
  status: Status
  guests: Guest
  cabins: CabinType
  hasBreakfast: boolean
  observations: string
  isPaid: boolean
}
