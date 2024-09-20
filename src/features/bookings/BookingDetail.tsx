import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import BookingDataBox from "./BookingDataBox"
import Row from "../../ui/Row"
import Heading from "../../ui/Heading"
import Tag from "../../ui/Tag"
import ButtonGroup from "../../ui/ButtonGroup"
import Button from "../../ui/Button"
import ButtonText from "../../ui/ButtonText"

import { useMoveBack } from "../../hooks/useMoveBack"
import { useBooking } from "./useBooking"
import Spinner from "../../ui/Spinner"
import { Booking } from "../../types"
import { useCheckout } from "../check-in-out/useCheckout"
import { useDeleteBooking } from "./useDeleteBooking"
import Modal from "../../ui/Modal"
import ConfirmDelete from "../../ui/ConfirmDelete"
import Empty from "../../ui/Empty"

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`

function BookingDetail() {
  const { booking, isPending } = useBooking()
  const { checkout, isCheckingOut } = useCheckout()
  const { isDeleting, deleteBooking } = useDeleteBooking()

  const moveBack = useMoveBack()
  const navigate = useNavigate()

  if (isPending) return <Spinner />
  if (!booking) return <Empty resourceName="booking" />

  const { status, id: bookingId } = booking as Booking

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  }

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{bookingId}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {booking.status === "unconfirmed" && (
          <Button
            size="medium"
            variation="primary"
            onClick={() => navigate(`/checkin/${booking.id}`)}
          >
            Check in
          </Button>
        )}

        {booking.status === "checked-in" && (
          <Button
            size="medium"
            variation="primary"
            onClick={() => checkout(booking.id)}
            disabled={isCheckingOut}
          >
            Check out
          </Button>
        )}

        <Modal>
          <Modal.Open opens="delete">
            <Button size="medium" variation="danger" onClick={() => {}}>
              Delete
            </Button>
          </Modal.Open>
          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="booking"
              onConfirm={() =>
                deleteBooking(booking.id, {
                  onSettled: () => navigate("/bookings"),
                })
              }
              disabled={isDeleting}
              onCloseModal={() => {}}
            />
          </Modal.Window>
        </Modal>

        <Button size="medium" variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  )
}

export default BookingDetail
