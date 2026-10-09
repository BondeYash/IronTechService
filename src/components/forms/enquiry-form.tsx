"use client";

import { submissionDelivered } from "@/lib/submission-result";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { enquirySchema, type EnquiryInput } from "@/lib/schemas";
import { contact } from "@/data/site";
import { Field, inputClass } from "./form-field";

export function EnquiryForm() {
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EnquiryInput>({ resolver: zodResolver(enquirySchema) });

  const onSubmit = handleSubmit(async (values) => {
    setFailed(null);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, kind: "enquiry" }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      if (!submissionDelivered(await res.json())) {
        throw new Error(
          "Email delivery is currently unavailable. Your details have not been sent. Please email us directly.",
        );
      }
      setSent(true);
      reset();
    } catch (err) {
      setFailed(err instanceof Error ? err.message : "Something went wrong — email us instead.");
    }
  });

  if (sent) {
    return (
      <div
        role="status"
        className="border-primary/40 bg-primary/5 rounded-2xl border p-10 text-center"
      >
        <CheckCircle2 className="text-primary mx-auto size-10" />
        <h3 className="mt-5 text-2xl [--heading-weight:700]">Enquiry received</h3>
        <p className="text-muted-foreground mt-3 text-sm">
          We will come back with questions on scope and a detailing estimate.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="text-primary mt-6 text-sm underline underline-offset-4"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" required error={errors.name?.message}>
          <input
            {...register("name")}
            className={inputClass}
            placeholder="Your name"
            autoComplete="name"
          />
        </Field>
        <Field label="Email" required error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            className={inputClass}
            placeholder="you@company.com"
            autoComplete="email"
          />
        </Field>
        <Field label="Company" error={errors.company?.message}>
          <input
            {...register("company")}
            className={inputClass}
            placeholder="Fabricator / erector"
            autoComplete="organization"
          />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input
            {...register("phone")}
            className={inputClass}
            placeholder="+1 …"
            autoComplete="tel"
          />
        </Field>
        <Field label="Scope" error={errors.scope?.message}>
          <select {...register("scope")} className={inputClass} defaultValue="">
            <option value="">Select scope</option>
            <option value="structural">Structural steel</option>
            <option value="miscellaneous">Miscellaneous steel</option>
            <option value="both">Both</option>
            <option value="other">Something else</option>
          </select>
        </Field>
        <Field label="Approx. tonnage" hint="optional">
          <input
            {...register("tonnage")}
            className={inputClass}
            placeholder="e.g. 250"
            inputMode="numeric"
          />
        </Field>
      </div>

      <Field label="Project details" required error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={5}
          className={inputClass}
          placeholder="Building type, location, schedule, drawing set status, software required…"
        />
      </Field>

      <input
        {...register("website")}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="pointer-events-none absolute -left-[9999px] size-0 opacity-0"
      />

      {failed ? (
        <p role="alert" className="text-destructive text-sm">
          {failed}{" "}
          <a className="underline" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="group bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-colors disabled:opacity-60"
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        )}
        {isSubmitting ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
