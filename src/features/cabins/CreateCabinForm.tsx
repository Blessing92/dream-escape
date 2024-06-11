import { useForm } from "react-hook-form"
import Input from "../../ui/Input"
import Form from "../../ui/Form"
import Button from "../../ui/Button"
import FileInput from "../../ui/FileInput"
import Textarea from "../../ui/Textarea"
import FormRow from "../../ui/FormRow"
import { CabinType } from "../../types"
import { useCreateCabin } from "./useCreateCabin"
import { useEditCabin } from "./useEditCabin"

interface CreateCabinFormProps {
  cabinToEdit?: CabinType
  onCloseModal?: () => void
}

interface CabinFormData {
  name: string
  maxCapacity: number
  regularPrice: number
  discount: number
  description: string
  image: FileList | string
}

function CreateCabinForm({ cabinToEdit, onCloseModal }: CreateCabinFormProps) {
  const { id: editId, ...editValues } = cabinToEdit || {}
  const isEditSession = Boolean(editId)

  const { register, handleSubmit, reset, getValues, formState } =
    useForm<CabinFormData>({
      defaultValues: isEditSession ? editValues : {},
    })
  const { errors } = formState

  const { isCreating, createACabin } = useCreateCabin()
  const { isEditing, editACabin } = useEditCabin()

  const isWorking = isCreating || isEditing

  function onSubmit(data: any) {
    const imageFileOrString =
      typeof data.image === "string" ? data.image : data.image[0]

    if (isEditSession) {
      editACabin(
        { ...data, id: editId, image: imageFileOrString },
        {
          onSuccess: () => {
            reset()
            if (onCloseModal) {
              onCloseModal()
            }
          },
        },
      )
    } else {
      createACabin(
        { ...data, image: data.image[0] },
        {
          onSuccess: () => {
            reset()
            if (onCloseModal) {
              onCloseModal()
            }
          },
        },
      )
    }
  }

  function onError(newErrors: any) {}

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="MaxCapacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("maxCapacity", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="RegularPrice" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regularPrice", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            validate: (value) =>
              value <= getValues().regularPrice ||
              "Discount should be less than the regular price",
          })}
        />
      </FormRow>

      <FormRow
        label="Description for Website"
        error={errors?.description?.message}
      >
        <Textarea
          type="number"
          id="description"
          disabled={isWorking}
          defaultValue=""
          {...register("description", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Cabin photo">
        <FileInput
          id="image"
          accept="image/*"
          type="file"
          {...register("image", {
            required: isEditSession ? false : "This field is required",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          size="medium"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button variation="primary" size="medium" disabled={isWorking}>
          {isEditSession ? "Edit cabin" : "Create new cabin"}
        </Button>
      </FormRow>
    </Form>
  )
}

export default CreateCabinForm
