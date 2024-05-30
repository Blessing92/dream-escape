import supabase, { supabaseUrl } from "./supabase"
import { CabinType } from "../types"

export const getCabins = async () => {
  const { data, error } = await supabase.from("cabins").select("*")

  if (error) {
    throw new Error(`Unable to get cabins ${error}`)
  }

  return data
}

export const deleteCabinApi = async (cabinId: number) => {
  const { data, error } = await supabase
    .from("cabins")
    .delete()
    .eq("id", cabinId)

  if (error) {
    throw new Error(`Unable to delete cabin ${cabinId}`)
  }

  return data
}

export const createCabin = async (cabin: CabinType) => {
  let imagePath = cabin.image

  if (cabin.image instanceof File) {
    const imageName = `${Math.random()}-${cabin.image.name}`.replaceAll("/", "")
    imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`

    const { data, error } = await supabase
      .from("cabins")
      .insert([{ ...cabin, image: imagePath }])
      .select()
      .single()

    if (error) {
      throw new Error(`Cabin could not be created`)
    }

    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, cabin.image)

    if (storageError) {
      await supabase.from("cabins").delete().eq("id", data.id)
      throw new Error(
        `Cabin image could not be uploaded and cabin image was not created`,
      )
    }

    return data
  }
  return {}
}

export const editCabin = async (cabin: CabinType) => {
  let imagePath = cabin.image
  let imageName: string | undefined

  if (cabin.image instanceof File) {
    imageName = `${Math.random()}-${cabin.image.name}`.replaceAll("/", "")
    imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`
  }

  const { data, error: editError } = await supabase
    .from("cabins")
    .update({ ...cabin, image: imagePath })
    .eq("id", cabin.id)
    .select()
    .single()

  if (editError) {
    throw new Error(`Cabin could not be created`)
  }

  if (imageName && cabin.image instanceof File) {
    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, cabin.image)

    if (storageError) {
      await supabase.from("cabins").delete().eq("id", data.id)
      throw new Error(
        `Cabin image could not be uploaded and cabin image was not created`,
      )
    }
  }

  return data
}
