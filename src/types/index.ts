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
