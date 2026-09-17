/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { ArrowRight, Loader2, Lock, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldError } from "@/components/shared/Field-Error";
import { useLogin } from "@/hooks/auth.hook";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Validation Schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {mutate: login} = useLogin()

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setIsPending(true);
      try {
        
        const loginData = {
        email: value.email,
        password: value.password,
      };

       login(loginData, {
        onSuccess: (_res) => {
          router.push("/dashboard");
          toast.success("Login Successful.", {
            description: "Welcome back",
            position: "top-right",
          });
        },
        onError: (err: any) => {
          const errorDescription =
            err?.data?.message ||
            err?.message ||
            "Something went wrong. Please try again";

          toast.error("Login Failed.", {
            description: errorDescription,
            position: "top-right",
          });
        },
      });


      } finally {
        setIsPending(false);
      }
    },
  });

  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-orange-200/80 bg-white/95 rounded-[12px] shadow-xl shadow-orange-950/5">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto inline-flex items-center justify-center w-12 h-12 rounded-[12px] bg-orange-100/70 text-orange-600 mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-neutral-900">
            Welcome Back<span className="text-orange-600">.</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-neutral-500">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            {/* Email Field */}
            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0;
                return (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className="text-xs font-semibold uppercase tracking-wider text-neutral-700"
                    >
                      Email Address
                    </Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      autoComplete="email"
                      placeholder="name@example.com"
                      className={`rounded-[12px] h-11 px-4 text-sm bg-neutral-50/50 border transition-all ${
                        isInvalid
                          ? "border-red-400 focus-visible:ring-red-400"
                          : "border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                      }`}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </div>
                );
              }}
            </form.Field>

            {/* Password Field */}
            <form.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0;
                return (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={field.name}
                        className="text-xs font-semibold uppercase tracking-wider text-neutral-700"
                      >
                        Password
                      </Label>
                    </div>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type={showPassword ? "text" : "password"}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        autoComplete="current-password"
                        placeholder="••••••••••••"
                        className={`rounded-[12px] h-11 pl-4 pr-11 text-sm bg-neutral-50/50 border transition-all ${
                          isInvalid
                            ? "border-red-400 focus-visible:ring-red-400"
                            : "border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </div>
                );
              }}
            </form.Field>

            {/* Login Button */}
            <Button
              disabled={isPending}
              type="submit"
              className="group relative w-full h-11 rounded-[12px] bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium text-sm transition-all duration-300 shadow-[0_4px_16px_rgba(234,88,12,0.25)] hover:shadow-[0_6px_22px_rgba(234,88,12,0.35)] active:scale-[0.98] mt-2 overflow-hidden"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  Sign In
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
