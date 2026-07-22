"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  projectType: z.string().min(1, "Please select a project type"),
  budget: z.string().min(1, "Please select a budget range"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      projectType: "",
      budget: "",
    },
  });

  const nextStep = async (fieldsToValidate: (keyof ContactFormValues)[]) => {
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) setStep((prev) => prev + 1);
  };

  const onSubmit = (data: ContactFormValues) => {
    console.log("Form submitted", data);
    // Real implementation would send to API route
    setIsSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 pt-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sapphire-alt/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-2xl w-full z-10 relative">
        <Link href="/" className="text-brass hover:text-brass-alt transition-colors font-body text-sm uppercase tracking-widest mb-12 inline-block">
          ← Back to Portfolio
        </Link>
        
        {isSubmitted ? (
          <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <CheckCircle2 className="w-20 h-20 text-brass mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-heading text-neutral-cream mb-4">
              Received.
            </h1>
            <p className="text-xl text-neutral-grayBeige font-body font-light">
              We will review your inquiry and get back to you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            
            {/* Step 1: Basics */}
            <div className={`transition-all duration-700 ${step === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 absolute translate-y-8 pointer-events-none'}`}>
              <h1 className="text-4xl md:text-5xl font-heading text-neutral-cream mb-8">
                Let's start with the basics.
              </h1>
              
              <div className="space-y-8">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-body text-neutral-grayBeige uppercase tracking-widest">
                    Your Name
                  </label>
                  <input
                    {...register("name")}
                    className="bg-transparent border-b border-muted focus:border-brass outline-none py-3 text-2xl font-light text-white transition-colors"
                    placeholder="Jane Doe"
                  />
                  {errors.name && <span className="text-destructive text-sm">{errors.name.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-body text-neutral-grayBeige uppercase tracking-widest">
                    Your Email
                  </label>
                  <input
                    {...register("email")}
                    className="bg-transparent border-b border-muted focus:border-brass outline-none py-3 text-2xl font-light text-white transition-colors"
                    placeholder="jane@example.com"
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
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Step 2: Project Details */}
            <div className={`transition-all duration-700 ${step === 2 ? 'opacity-100 translate-y-0 relative' : 'opacity-0 absolute translate-y-8 pointer-events-none'}`}>
              <h1 className="text-4xl md:text-5xl font-heading text-neutral-cream mb-8">
                Tell us about the project.
              </h1>
              
              <div className="space-y-8">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-body text-neutral-grayBeige uppercase tracking-widest">
                    Project Type
                  </label>
                  <select
                    {...register("projectType")}
                    className="bg-transparent border-b border-muted focus:border-brass outline-none py-3 text-xl font-light text-white transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-background text-white">Select a type</option>
                    <option value="commercial" className="bg-background text-white">Commercial</option>
                    <option value="documentary" className="bg-background text-white">Documentary</option>
                    <option value="branded_content" className="bg-background text-white">Branded Content</option>
                  </select>
                  {errors.projectType && <span className="text-destructive text-sm">{errors.projectType.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-body text-neutral-grayBeige uppercase tracking-widest">
                    Estimated Budget
                  </label>
                  <select
                    {...register("budget")}
                    className="bg-transparent border-b border-muted focus:border-brass outline-none py-3 text-xl font-light text-white transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-background text-white">Select a range</option>
                    <option value="25k-50k" className="bg-background text-white">$25,000 - $50,000</option>
                    <option value="50k-100k" className="bg-background text-white">$50,000 - $100,000</option>
                    <option value="100k+" className="bg-background text-white">$100,000+</option>
                  </select>
                  <p className="text-xs text-neutral-grayBeige/50 mt-1">Minimum engagement fee begins at $25k.</p>
                  {errors.budget && <span className="text-destructive text-sm">{errors.budget.message}</span>}
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="rounded-none px-8 h-14 uppercase tracking-widest text-sm border-muted text-white"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="rounded-none px-8 h-14 uppercase tracking-widest text-sm"
                >
                  Submit Inquiry
                </Button>
              </div>
            </div>

          </form>
        )}
      </div>
    </main>
  );
}
