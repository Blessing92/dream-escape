import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2"
import { Booking } from "../../types"
import Stat from "./Stat"
import { formatCurrency } from "../../utils/helpers"

interface StatsProps {
  bookings: Booking[]
  confirmedStays: Booking[]
  numDays: number
  cabinCount: number
}

function Stats({ bookings, confirmedStays, numDays, cabinCount }: StatsProps) {
  const numBookings = bookings.length

  const sales = bookings.reduce((acc, cur) => acc + cur.totalPrice, 0)

  const checkins = confirmedStays.length.toString()

  const occupation =
    confirmedStays.reduce((acc, cur) => acc + Number(cur.numNights), 0) /
    (numDays * cabinCount)

  return (
    <>
      <Stat
        icon={<HiOutlineBriefcase />}
        title="Bookings"
        value={numBookings.toString()}
        color="blue"
      />
      <Stat
        icon={<HiOutlineBanknotes />}
        title="Sales"
        value={formatCurrency(sales)}
        color="green"
      />
      <Stat
        icon={<HiOutlineCalendarDays />}
        title="Check-ins"
        value={checkins}
        color="indigo"
      />
      <Stat
        icon={<HiOutlineChartBar />}
        title="Occupancy rate"
        value={`${Math.round(occupation * 100).toString()}%`}
        color="yellow"
      />
    </>
  )
}

export default Stats
