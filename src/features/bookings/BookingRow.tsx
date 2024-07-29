import styled from "styled-components"
import { format, isToday } from "date-fns"

import { HiEye } from "react-icons/hi"
import { useNavigate } from "react-router-dom"
import { HiArrowDownOnSquare } from "react-icons/hi2"
import Tag from "../../ui/Tag"
import Table from "../../ui/Table"

import { formatCurrency, formatDistanceFromNow } from "../../utils/helpers"
import { Booking, Status } from "../../types"
import Menus from "../../ui/Menus"

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`

function BookingRow({ booking }: { booking: Booking }) {
  const navigate = useNavigate()

  const statusToTagName: { [key in Status]: string } = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  }

  return (
    <Table.Row>
      <Cabin>{booking.cabins.name}</Cabin>

      <Stacked>
        <span>{booking.guests.fullName}</span>
        <span>{booking.guests.email}</span>
      </Stacked>

      <Stacked>
        <span>
          {isToday(new Date(booking.startDate))
            ? "Today"
            : formatDistanceFromNow(booking.startDate)}{" "}
          &rarr; {booking.numNights} night stay
        </span>
        <span>
          {format(new Date(booking.startDate), "MMM dd yyyy")} &mdash;{" "}
          {format(new Date(booking.endDate), "MMM dd yyyy")}
        </span>
      </Stacked>

      <Tag type={statusToTagName[booking.status]}>
        {booking.status.replace("-", " ")}
      </Tag>

      <Amount>{formatCurrency(booking.totalPrice)}</Amount>

      <Menus.Menu>
        <Menus.Toggle id={booking.id} />
        <Menus.List id={booking.id}>
          <Menus.Button
            icon={<HiEye />}
            onClick={() => navigate(`/bookings/${booking.id}`)}
          >
            See details
          </Menus.Button>

          {booking.status === "unconfirmed" && (
            <Menus.Button
              icon={<HiArrowDownOnSquare />}
              onClick={() => navigate(`/checkin/${booking.id}`)}
            >
              Check in
            </Menus.Button>
          )}
        </Menus.List>
      </Menus.Menu>
    </Table.Row>
  )
}

export default BookingRow
