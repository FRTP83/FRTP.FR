import "server-only";
import { revalidatePath } from "next/cache";

export function refreshPublicContent() {
  // Shared settings, references and images can appear on several public pages.
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
}
