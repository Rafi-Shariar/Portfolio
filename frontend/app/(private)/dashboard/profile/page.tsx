"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  User,
  Share2,
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe,
  Code2,
} from "lucide-react";

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

import { useGetProfile, useProfileUpdate } from "@/hooks/profile.hook";
import { IUpdateProfile } from "@/types/profile.type";
import { FieldError } from "@/components/shared/Field-Error";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  headline: z.string().min(2, "Headline is required"),
  bio: z.string().min(5, "Bio is required"),
  aboutMe: z.string().min(10, "About me must be at least 10 characters"),
  resumeUrl: z.string().url("Must be a valid URL"),
  avatarUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number is required"),
  location: z.string().min(2, "Location is required"),
  github: z.string().url("Must be a valid URL").or(z.literal("")),
  linkedin: z.string().url("Must be a valid URL").or(z.literal("")),
  facebook: z.string().url("Must be a valid URL").or(z.literal("")),
  codeforces: z.string().url("Must be a valid URL").or(z.literal("")),
  leetcode: z.string().url("Must be a valid URL").or(z.literal("")),
});

export default function ProfilePage() {
  const { data: response, isLoading } = useGetProfile();
  const { mutate: updateProfile, isPending } = useProfileUpdate();

  const profile = response?.data;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2.5 px-5 py-3 rounded-[12px] bg-orange-50/80 border border-orange-200/60 text-orange-700 font-medium text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-orange-600" />
          <span>Loading profile information...</span>
        </div>
      </div>
    );
  }

  return (
    <ProfileForm
      defaultValues={profile}
      onUpdate={updateProfile}
      isPending={isPending}
    />
  );
}

interface ProfileFormProps {
  defaultValues: any;
  onUpdate: (payload: IUpdateProfile, options?: any) => void;
  isPending: boolean;
}

function ProfileForm({ defaultValues, onUpdate, isPending }: ProfileFormProps) {
  const form = useForm({
    defaultValues: {
      name: defaultValues?.name || "",
      headline: defaultValues?.headline || "",
      bio: defaultValues?.bio || "",
      aboutMe: defaultValues?.aboutMe || "",
      resumeUrl: defaultValues?.resumeUrl || "",
      avatarUrl: defaultValues?.avatarUrl || "",
      email: defaultValues?.email || "",
      phone: defaultValues?.phone || "",
      location: defaultValues?.location || "",
      github: defaultValues?.github || "",
      linkedin: defaultValues?.linkedin || "",
      facebook: defaultValues?.facebook || "",
      codeforces: defaultValues?.codeforces || "",
      leetcode: defaultValues?.leetcode || "",
    },
    validators: {
      onChange: profileSchema,
    },
    onSubmit: async ({ value }) => {
      // Empty string গুলোকে null এ কনভার্ট করা যাতে ব্যাকএন্ড স্কিমার সাথে মেলে
      const sanitizedPayload = Object.entries(value).reduce(
        (acc, [key, val]) => {
          acc[key as keyof IUpdateProfile] = val === "" ? null : (val as any);
          return acc;
        },
        {} as Record<keyof IUpdateProfile, any>
      );

      onUpdate(sanitizedPayload as IUpdateProfile, {
        onSuccess: () => {
          toast.success("Profile Updated", {
            description: "Your portfolio information has been saved successfully.",
          });
        },
        onError: (err: any) => {
          toast.error("Update Failed", {
            description:
              err?.message || "Could not update profile. Please try again.",
          });
        },
      });
    },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-14">
      {/* Header */}
      <div>
        <span className="text-xs font-bold tracking-widest text-orange-600 uppercase">
          Profile Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mt-1">
          Manage Identity & Bio<span className="text-orange-600">.</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Modify headline, contact details, competitive programming links, and long-form bio.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        {/* SECTION 1: PRIMARY IDENTITY */}
        <Card className="border-orange-200/80 bg-white shadow-xs rounded-[12px] overflow-hidden">
          <CardHeader className="bg-[#FFFDF9] border-b border-orange-100/80 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-[8px] bg-orange-100/70 text-orange-600">
                <User className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-neutral-900">
                  Core Identity
                </CardTitle>
                <CardDescription className="text-xs text-neutral-500">
                  Basic identifying details showcased on top of the hero banner.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <form.Field name="name">
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
                        Full Name
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className={`rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border transition-all ${
                          isInvalid
                            ? "border-red-400 focus-visible:ring-red-400"
                            : "border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                        }`}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </div>
                  );
                }}
              </form.Field>

              <form.Field name="headline">
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
                        Headline (Designation)
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className={`rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border transition-all ${
                          isInvalid
                            ? "border-red-400 focus-visible:ring-red-400"
                            : "border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                        }`}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </div>
                  );
                }}
              </form.Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <form.Field name="bio">
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
                        One-Line Subtitle Bio
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className={`rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border transition-all ${
                          isInvalid
                            ? "border-red-400 focus-visible:ring-red-400"
                            : "border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                        }`}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </div>
                  );
                }}
              </form.Field>

              <form.Field name="avatarUrl">
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
                        Avatar URL (Optional)
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="https://..."
                        className={`rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border transition-all ${
                          isInvalid
                            ? "border-red-400 focus-visible:ring-red-400"
                            : "border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                        }`}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </div>
                  );
                }}
              </form.Field>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: CONTACT & PROFILES */}
        <Card className="border-orange-200/80 bg-white shadow-xs rounded-[12px] overflow-hidden">
          <CardHeader className="bg-[#FFFDF9] border-b border-orange-100/80 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-[8px] bg-orange-100/70 text-orange-600">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-neutral-900">
                  Contact & Online Presence
                </CardTitle>
                <CardDescription className="text-xs text-neutral-500">
                  Direct channels, social profiles, and coding handles.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            {/* Contact row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor={field.name}
                        className="text-xs font-semibold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5 text-orange-500" /> Email
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className={`rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border transition-all ${
                          isInvalid
                            ? "border-red-400 focus-visible:ring-red-400"
                            : "border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                        }`}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </div>
                  );
                }}
              </form.Field>

              <form.Field name="phone">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor={field.name}
                        className="text-xs font-semibold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-orange-500" /> Phone
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className={`rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border transition-all ${
                          isInvalid
                            ? "border-red-400 focus-visible:ring-red-400"
                            : "border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                        }`}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </div>
                  );
                }}
              </form.Field>

              <form.Field name="location">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor={field.name}
                        className="text-xs font-semibold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5 text-orange-500" /> Location
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className={`rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border transition-all ${
                          isInvalid
                            ? "border-red-400 focus-visible:ring-red-400"
                            : "border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                        }`}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </div>
                  );
                }}
              </form.Field>
            </div>

            {/* Social profiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1">
              <form.Field name="github">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className="text-xs font-semibold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5 text-neutral-400" /> GitHub URL
                    </Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="linkedin">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className="text-xs font-semibold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5 text-neutral-400" /> LinkedIn URL
                    </Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="facebook">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className="text-xs font-semibold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5 text-neutral-400" /> Facebook URL
                    </Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                    />
                  </div>
                )}
              </form.Field>
            </div>

            {/* Competitive Programming Handles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              <form.Field name="codeforces">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className="text-xs font-semibold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5"
                    >
                      <Code2 className="w-3.5 h-3.5 text-neutral-400" /> Codeforces URL
                    </Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="https://codeforces.com/profile/..."
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="leetcode">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className="text-xs font-semibold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5"
                    >
                      <Code2 className="w-3.5 h-3.5 text-neutral-400" /> LeetCode URL
                    </Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="https://leetcode.com/u/..."
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                    />
                  </div>
                )}
              </form.Field>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: EXTENDED BIO & RESUME */}
        <Card className="border-orange-200/80 bg-white shadow-xs rounded-[12px] overflow-hidden">
          <CardHeader className="bg-[#FFFDF9] border-b border-orange-100/80 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-[8px] bg-orange-100/70 text-orange-600">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-neutral-900">
                  Biography & Documentation
                </CardTitle>
                <CardDescription className="text-xs text-neutral-500">
                  In-depth about section and direct resume link.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            <form.Field name="resumeUrl">
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
                      Resume Link (Google Drive / Cloud PDF)
                    </Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className={`rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border transition-all ${
                        isInvalid
                          ? "border-red-400 focus-visible:ring-red-400"
                          : "border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                      }`}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </div>
                );
              }}
            </form.Field>

            <form.Field name="aboutMe">
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
                      About Me (Long-form Journey & Goals)
                    </Label>
                    <textarea
                      id={field.name}
                      name={field.name}
                      rows={6}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className={`w-full rounded-[12px] p-3.5 text-sm bg-neutral-50/40 border outline-none transition-all leading-relaxed ${
                        isInvalid
                          ? "border-red-400 focus:ring-2 focus:ring-red-400"
                          : "border-neutral-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      }`}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </div>
                );
              }}
            </form.Field>
          </CardContent>
        </Card>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-4 z-20 flex justify-end">
          <div className="p-2 rounded-[14px] bg-white/95 backdrop-blur-md border border-orange-200/80 shadow-lg shadow-orange-950/10">
            <Button
              disabled={isPending}
              type="submit"
              className="rounded-[10px] px-6 h-10 bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm transition-all shadow-md shadow-orange-600/20 active:scale-95"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Profile
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}