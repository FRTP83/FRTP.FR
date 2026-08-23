import { getSupabaseAdmin } from "@/lib/supabase";

export async function hasAdminAccess(userId: string, email?: string | null) {
  const supabase = getSupabaseAdmin();

  if (!supabase) return false;

  const { data, error } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!error) return Boolean(data);

  const tableIsMissing = error.code === "PGRST205" || error.message.includes("Could not find the table");

  if (!tableIsMissing || !email) return false;

  const allowedEmails = [
    ...(process.env.ADMIN_EMAILS ?? "").split(","),
    process.env.CONTACT_MAIL_TO ?? "",
    process.env.SMTP_USER ?? ""
  ]
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return allowedEmails.includes(email.toLowerCase());
}
