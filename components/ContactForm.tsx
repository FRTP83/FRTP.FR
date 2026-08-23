"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import Link from "next/link";
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

    try {
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
    } catch {
      setState("error");
      setMessage("La connexion au serveur a échoué. Vérifiez votre réseau puis réessayez.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form-panel grid gap-5 border border-zinc-200 bg-white p-4 shadow-technical md:p-7">
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
        <Field label="Nom" name="name" autoComplete="name" maxLength={120} required />
        <Field label="Société" name="company" autoComplete="organization" maxLength={160} />
        <Field label="Téléphone" name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={40} required />
        <Field label="Email" name="email" type="email" autoComplete="email" inputMode="email" maxLength={160} required />
        <Field label="Commune du chantier" name="city" autoComplete="address-level2" maxLength={120} required />
        <label className="grid gap-2 text-sm font-bold text-zinc-800">
          Type de travaux
          <select name="work_type" className="contact-field h-12 w-full border px-3 font-normal outline-none">
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
          maxLength={4000}
          className="contact-field resize-none border px-3 py-3 font-normal outline-none"
          placeholder="Décrivez le chantier, l'adresse, les contraintes d'accès et le délai souhaité."
        />
      </label>

      <p className="text-xs font-medium leading-6 text-zinc-600">
        FRTP utilise ces informations uniquement pour répondre à votre demande et préparer votre devis. Consultez notre{" "}
        <Link href="/politique-confidentialite" className="font-bold text-frtp-blue underline decoration-frtp-blue/30 underline-offset-4 hover:decoration-frtp-blue">
          politique de confidentialité
        </Link>.
      </p>

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
        className="inline-flex min-h-12 items-center justify-center gap-2 bg-frtp-orange px-5 py-4 text-sm font-black text-white transition hover:bg-frtp-orangeDark active:translate-y-px disabled:cursor-wait disabled:opacity-70"
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
  required = false,
  autoComplete,
  inputMode,
  maxLength
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "email" | "tel" | "text";
  maxLength?: number;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-zinc-800">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        className="contact-field h-12 w-full border px-3 font-normal outline-none"
      />
    </label>
  );
}
