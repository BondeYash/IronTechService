"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { careerSchema, type CareerInput } from "@/lib/schemas";
import { Field, inputClass } from "./form-field";
import { contact } from "@/data/site";

export function CareerForm() {
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CareerInput>({ resolver: zodResolver(careerSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setFailed(null);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, kind: "career" }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setSent(true);
      reset();
    } catch (err) {
      setFailed(err instanceof Error ? err.message : "Something went wrong.");
    }
  });

  if (sent) {
    return (
      <div className="border-primary/40 bg-primary/5 rounded-2xl border p-10 text-center">
        <CheckCircle2 className="text-primary mx-auto size-10" />
        <h3 className="mt-5 text-2xl [--heading-weight:700]">Application received</h3>
        <p className="text-muted-foreground mt-3 text-sm">
          Send your portfolio or sample drawings to{" "}
          <a href={`mailto:${contact.email}`} className="text-primary">
            {contact.email}
          </a>{" "}
          and we will review both together.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" required error={errors.name?.message}>
          <input {...register("name")} className={inputClass} autoComplete="name" />
        </Field>
        <Field label="Email" required error={errors.email?.message}>
          <input {...register("email")} type="email" className={inputClass} autoComplete="email" />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input {...register("phone")} className={inputClass} autoComplete="tel" />
        </Field>
        <Field label="Role" required error={errors.role?.message}>
          <select {...register("role")} className={inputClass} defaultValue="">
            <option value="" disabled>
              Select a role
            </option>
            <option value="detailer">Steel detailer</option>
            <option value="checker">Checker</option>
            <option value="modeller">3D modeller</option>
            <option value="trainee">Trainee / fresher</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Experience" required error={errors.experience?.message}>
          <input {...register("experience")} className={inputClass} placeholder="e.g. 4 years" />
        </Field>
        <Field label="Software" hint="optional">
          <input
            {...register("software")}
            className={inputClass}
            placeholder="SDS/2, Tekla, AutoCAD…"
          />
        </Field>
      </div>

      <Field label="Portfolio link" hint="optional" error={errors.portfolio?.message}>
        <input {...register("portfolio")} className={inputClass} placeholder="https://…" />
      </Field>

      <Field label="Anything else" hint="optional">
        <textarea {...register("message")} rows={4} className={inputClass} />
      </Field>

      <input
        {...register("website")}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="pointer-events-none absolute -left-[9999px] size-0 opacity-0"
      />

      {failed ? <p className="text-destructive text-sm">{failed}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="group bg-primary text-primary-foreground hover:bg-molten-400 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-colors disabled:opacity-60"
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        )}
        {isSubmitting ? "Sending…" : "Apply now"}
      </button>
    </form>
  );
}
