import supabase from "./supabase"
import { SettingsUpdate } from "../types"

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single()

  if (error) {
    console.error(error)
    throw new Error("Settings could not be loaded")
  }
  return data
}

export async function updateSettingApi(newSetting: object) {
  const { data, error } = await supabase
    .from("settings")
    .update(newSetting)
    .eq("id", 1)
    .single()

  if (error) {
    console.error(error)
    throw new Error("Settings could not be updated")
  }
  return data
}