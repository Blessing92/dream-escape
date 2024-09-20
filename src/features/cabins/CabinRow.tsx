import styled from "styled-components"
import { HiSquare2Stack, HiPencil } from "react-icons/hi2"
import { HiTrash } from "react-icons/hi"
import { CabinType } from "../../types"
import { formatCurrency } from "../../utils/helpers"
import CreateCabinForm from "./CreateCabinForm"
import { useDeleteCabin } from "./useDeleteCabin"
import { useCreateCabin } from "./useCreateCabin"
import Modal from "../../ui/Modal"
import ConfirmDelete from "../../ui/ConfirmDelete"
import Table from "../../ui/Table"
import Menus from "../../ui/Menus"

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
    <Table.Row>
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
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={cabinId.toString()} />
            <Menus.List id={cabinId.toString()}>
              {/* eslint-disable-next-line react/jsx-no-bind */}
              <Menus.Button
                icon={<HiSquare2Stack />}
                onClick={handleDuplicate}
                disabled={isCreating}
              >
                Duplicate
              </Menus.Button>

              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />} onClick={() => {}}>
                  Edit
                </Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />} onClick={() => {}}>
                  Delete
                </Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit">
              <CreateCabinForm cabinToEdit={cabin} />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName=""
                onConfirm={() => deleteCabin(cabinId)}
                disabled={isDeleting}
                onCloseModal={() => {}}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  )
}

export default CabinRow
