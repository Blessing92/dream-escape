import { SubmitHandler, useForm } from "react-hook-form"
import Button from "../../ui/Button.js"
import Form from "../../ui/Form.js"
import FormRow from "../../ui/FormRow"
import Input from "../../ui/Input"
import { useSignup } from "./useSignup"

interface SignupFormProps {
  fullName: string
  email: string
  password: string
  passwordConfirm: string
}

function SignupForm() {
  const { signup, isPending } = useSignup()

  const { register, formState, getValues, handleSubmit, reset } =
    useForm<SignupFormProps>()
  const { errors } = formState

  const onSubmit: SubmitHandler<SignupFormProps> = ({
    fullName,
    email,
    password,
  }) => {
    signup(
      { fullName, email, password },
      {
        onSettled: () => {
          reset()
        },
      },
    )
  }

  function handleCancel() {
    reset()
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isPending}
          {...register("fullName", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isPending}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please prove a valid email address",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          disabled={isPending}
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>

      <FormRow label="Repeat password" error={errors?.passwordConfirm?.message}>
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isPending}
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (value) =>
              value === getValues().password || "Passwords need to match",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          size="medium"
          variation="secondary"
          type="reset"
          disabled={isPending}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button size="medium" variation="primary" disabled={isPending}>
          Create new user
        </Button>
      </FormRow>
    </Form>
  )
}

export default SignupForm
