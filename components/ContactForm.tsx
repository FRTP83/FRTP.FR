"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { contactTypes } from "@/lib/data";

type FormState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData.entries())),
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json().catch(() => null);

    if (response.ok) {
      form.reset();
      setState("success");
      setMessage(
        data?.mailError
          ? "Votre demande a bien été enregistrée. L'email de notification doit encore être configuré."
          : "Votre demande a bien été envoyée."
      );
      return;
    }

    setState("error");
    setMessage(data?.error ?? "La demande n'a pas pu être envoyée.");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 border border-zinc-200 bg-white p-4 shadow-technical md:p-8">
      {/* Champ piège anti-spam : invisible pour les humains, ignoré côté serveur. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Nom" name="name" required />
        <Field label="Société" name="company" />
        <Field label="Téléphone" name="phone" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Commune du chantier" name="city" required />
        <label className="grid gap-2 text-sm font-bold text-zinc-800">
          Type de travaux
          <select name="work_type" className="h-12 w-full border border-zinc-300 bg-white px-3 font-normal outline-none focus:border-frtp-blue">
            {contactTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-zinc-800">
        Message
        <textarea
          name="message"
          required
          rows={6}
          className="resize-none border border-zinc-300 px-3 py-3 font-normal outline-none focus:border-frtp-blue"
          placeholder="Décrivez le chantier, l'adresse, les contraintes d'accès et le délai souhaité."
        />
      </label>

      <p
        role="status"
        aria-live="polite"
        className={
          !message
            ? "sr-only"
            : state === "error"
              ? "text-sm font-semibold text-red-700"
              : "text-sm font-semibold text-frtp-blue"
        }
      >
        {message}
      </p>

      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex items-center justify-center gap-2 bg-frtp-orange px-5 py-4 text-sm font-black text-white transition hover:bg-frtp-orangeDark active:translate-y-px disabled:cursor-wait disabled:opacity-70"
      >
        <Send size={18} />
        {state === "loading" ? "Envoi en cours" : "Envoyer la demande"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-zinc-800">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="h-12 w-full border border-zinc-300 px-3 font-normal outline-none focus:border-frtp-blue"
      />
    </label>
  );
}
