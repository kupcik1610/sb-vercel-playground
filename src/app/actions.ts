"use server";

// Server Actions: every mutation runs HERE, on the server, never in the
// browser. The browser only submits a form; the server decides what happens.
// This is the safe pattern and mirrors MESync's "client collects input, server
// owns the rules" boundary.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ---- Auth ------------------------------------------------------------------

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ---- Equipment CRUD --------------------------------------------------------

export async function addEquipment(formData: FormData) {
  const supabase = await createClient();
  const interval = Number(formData.get("interval_days")) || 365;
  // We don't set `owner` — the DB default (auth.uid()) handles it, and RLS
  // would reject an insert for anyone else's id anyway.
  const { error } = await supabase.from("equipment").insert({
    name: String(formData.get("name")),
    facility_name: String(formData.get("facility_name") || ""),
    interval_days: interval,
    last_serviced_on: (formData.get("last_serviced_on") as string) || null,
  });
  if (error) throw error;
  revalidatePath("/");
}

export async function markServiced(formData: FormData) {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const { error } = await supabase
    .from("equipment")
    .update({ last_serviced_on: today })
    .eq("id", String(formData.get("id")));
  // No need to check owner here — RLS guarantees you can only update your own.
  if (error) throw error;
  revalidatePath("/");
}

export async function deleteEquipment(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("equipment")
    .delete()
    .eq("id", String(formData.get("id")));
  if (error) throw error;
  revalidatePath("/");
}
