import styled from "styled-components"
import { useState } from "react"
import { HiSquare2Stack, HiPencil } from "react-icons/hi2"
import { HiTrash } from "react-icons/hi"
import { CabinType } from "../../types"
import { formatCurrency } from "../../utils/helpers"
import CreateCabinForm from "./CreateCabinForm"
import { useDeleteCabin } from "./useDeleteCabin"
import { useCreateCabin } from "./useCreateCabin"

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  padding: 1.4rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`

type ImageProps = {
  src: string | File
  alt: string
}

const Img = styled.img<ImageProps>`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`

interface Props {
  cabin: CabinType
}

function CabinRow({ cabin }: Props) {
  const [showForm, setShowForm] = useState<boolean>(false)
  const { isDeleting, deleteCabin } = useDeleteCabin()
  const { isCreating, createACabin } = useCreateCabin()

  const {
    id: cabinId,
    name,
    maxCapacity,
    regularPrice,
    discount,
    image,
    description,
  } = cabin

  function handleDuplicate() {
    createACabin({
      name: `Copy of ${name}`,
      maxCapacity,
      regularPrice,
      discount,
      image,
      description,
    })
  }

  return (
    <>
      <TableRow role="row">
        <Img src={image} alt="" />
        <Cabin>{name}</Cabin>
        <div>Fits up tp {maxCapacity} guests</div>
        <Price>{formatCurrency(regularPrice)}</Price>
        {discount ? (
          <Discount>{formatCurrency(discount)}</Discount>
        ) : (
          <span>-</span>
        )}
        <div>
          <button type="button" disabled={isCreating} onClick={handleDuplicate}>
            <HiSquare2Stack />
          </button>
          <button type="button" onClick={() => setShowForm((show) => !show)}>
            <HiPencil />
          </button>
          <button
            type="button"
            onClick={() => deleteCabin(cabinId)}
            disabled={isDeleting}
          >
            <HiTrash />
          </button>
        </div>
      </TableRow>
      {showForm && <CreateCabinForm cabinToEdit={cabin} />}
    </>
  )
}

export default CabinRow
