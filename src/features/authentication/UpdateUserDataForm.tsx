import React, { useState } from "react"

import Button from "../../ui/Button"
import FileInput from "../../ui/FileInput"
import Form from "../../ui/Form"
import FormRow from "../../ui/FormRow"
import Input from "../../ui/Input"

import { useUser } from "./useUser"
import { useUpdateUser } from "./useUpdateUser"

function UpdateUserDataForm() {
  const { user } = useUser()

  if (!user) return null
  const {
    email,
    user_metadata: { fullName: currentFullName },
  } = user

  const { updateUser, isUpdating } = useUpdateUser()

  const [fullName, setFullName] = useState(currentFullName)
  const [avatar, setAvatar] = useState<File | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!fullName) return

    updateUser(
      { fullName, avatar },
      {
        onSuccess: () => {
          setAvatar(null)

          const target = e.target as HTMLFormElement
          target.reset()
        },
      },
    )
  }

  function handleCancel() {
    setFullName(currentFullName)
    setAvatar(null)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          onChange={(e) => {
            const { files } = e.target
            if (files && files.length > 0) {
              setAvatar(files[0])
            }
          }}
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow>
        <Button
          size="medium"
          type="reset"
          variation="secondary"
          disabled={isUpdating}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button size="medium" variation="primary" disabled={isUpdating}>
          Update account
        </Button>
      </FormRow>
    </Form>
  )
}

export default UpdateUserDataForm
