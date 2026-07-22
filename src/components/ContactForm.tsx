"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function ContactForm() {
  const t = useTranslations("Contact");
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const contactSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t("nameRequired")),
        email: z.string().email(t("emailInvalid")),
        projectType: z.string().min(1, t("projectTypeRequired")),
        otherProjectType: z.string().optional(),
        description: z.string().min(1, t("descriptionRequired")),
      }).superRefine((data, ctx) => {
        if (data.projectType === "other" && (!data.otherProjectType || data.otherProjectType.trim() === "")) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("otherProjectTypeRequired"),
            path: ["otherProjectType"],
          });
        }
      }),
    [t]
  );

  type ContactFormValues = z.infer<typeof contactSchema>;

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      projectType: "",
      otherProjectType: "",
      description: "",
    },
  });

  const projectType = watch("projectType");

  const nextStep = async (fieldsToValidate: (keyof ContactFormValues)[]) => {
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) setStep((prev) => prev + 1);
  };

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit form");
      }

      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Form submission error:", error);
      setSubmitError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 pt-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sapphire-alt/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-2xl w-full z-10 relative">
        <Link href="/" className="text-brass hover:text-brass-alt transition-colors font-body text-sm uppercase tracking-widest mb-12 inline-block">
          {t("backLink")}
        </Link>

        {isSubmitted ? (
          <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <CheckCircle2 className="w-20 h-20 text-brass mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-heading text-neutral-cream mb-4">
              {t("successHeading")}
            </h1>
            <p className="text-xl text-neutral-grayBeige font-body font-light">
              {t("successBody")}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">

            {/* Step 1: Basics */}
            <div className={`transition-all duration-700 ${step === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 absolute translate-y-8 pointer-events-none'}`}>
              <h1 className="text-4xl md:text-5xl font-heading text-neutral-cream mb-8">
                {t("step1Heading")}
              </h1>

              <div className="space-y-8">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-body text-neutral-grayBeige uppercase tracking-widest">
                    {t("nameLabel")}
                  </label>
                  <input
                    {...register("name")}
                    className="bg-transparent border-b border-muted focus:border-brass outline-none py-3 text-2xl font-light text-white transition-colors"
                    placeholder={t("namePlaceholder")}
                  />
                  {errors.name && <span className="text-destructive text-sm">{errors.name.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-body text-neutral-grayBeige uppercase tracking-widest">
                    {t("emailLabel")}
                  </label>
                  <input
                    {...register("email")}
                    className="bg-transparent border-b border-muted focus:border-brass outline-none py-3 text-2xl font-light text-white transition-colors"
                    placeholder={t("emailPlaceholder")}
                  />
                  {errors.email && <span className="text-destructive text-sm">{errors.email.message}</span>}
                </div>
              </div>

              <div className="mt-12">
                <Button
                  type="button"
                  onClick={() => nextStep(["name", "email"])}
                  className="rounded-none px-8 h-14 uppercase tracking-widest text-sm"
                >
                  {t("continue")} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Step 2: Project Details */}
            <div className={`transition-all duration-700 ${step === 2 ? 'opacity-100 translate-y-0 relative' : 'opacity-0 absolute translate-y-8 pointer-events-none'}`}>
              <h1 className="text-4xl md:text-5xl font-heading text-neutral-cream mb-8">
                {t("step2Heading")}
              </h1>

              <div className="space-y-8">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-body text-neutral-grayBeige uppercase tracking-widest">
                    {t("projectTypeLabel")}
                  </label>
                  <select
                    {...register("projectType")}
                    className="bg-transparent border-b border-muted focus:border-brass outline-none py-3 text-xl font-light text-white transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-background text-white">{t("selectType")}</option>
                    <option value="commercial" className="bg-background text-white">{t("typeCommercial")}</option>
                    <option value="documentary" className="bg-background text-white">{t("typeDocumentary")}</option>
                    <option value="branded_content" className="bg-background text-white">{t("typeBranded")}</option>
                    <option value="other" className="bg-background text-white">{t("typeOther")}</option>
                  </select>
                  {errors.projectType && <span className="text-destructive text-sm">{errors.projectType.message}</span>}
                </div>

                {projectType === "other" && (
                  <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
                    <input
                      {...register("otherProjectType")}
                      className="bg-transparent border-b border-muted focus:border-brass outline-none py-3 text-xl font-light text-white transition-colors"
                      placeholder={t("otherProjectTypePlaceholder")}
                    />
                    {errors.otherProjectType && <span className="text-destructive text-sm">{errors.otherProjectType.message}</span>}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-body text-neutral-grayBeige uppercase tracking-widest">
                    {t("descriptionLabel")}
                  </label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    className="bg-transparent border-b border-muted focus:border-brass outline-none py-3 text-xl font-light text-white transition-colors resize-none"
                    placeholder={t("descriptionPlaceholder")}
                  />
                  {errors.description && <span className="text-destructive text-sm">{errors.description.message}</span>}
                </div>
              </div>

              <div className="mt-12 flex flex-col gap-4">
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="rounded-none px-8 h-14 uppercase tracking-widest text-sm border-muted text-white"
                    disabled={isSubmitting}
                  >
                    {t("back")}
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-none px-8 h-14 uppercase tracking-widest text-sm relative"
                    disabled={isSubmitting}
                  >
                    <span className={isSubmitting ? "opacity-0" : "opacity-100"}>{t("submit")}</span>
                    {isSubmitting && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </Button>
                </div>
                {submitError && (
                  <p className="text-destructive text-sm font-body">{submitError}</p>
                )}
              </div>
            </div>

          </form>
        )}
      </div>
    </main>
  );
}
