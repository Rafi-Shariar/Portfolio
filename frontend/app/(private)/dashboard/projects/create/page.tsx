"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  Loader2,
  Upload,
  X,
  FolderGit2,
  Code2,
  ListChecks,
  Image as ImageIcon,
  Save,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useCreateProject } from "@/hooks/project.hook";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";
import { FieldError } from "@/components/shared/Field-Error";

interface SelectedImage {
  file: File;
  previewUrl: string;
  caption: string;
}

export default function CreateProjectPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createProject, isPending: isSubmittingProject } =
    useCreateProject();
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  // Local Image Selection & Preview
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: SelectedImage[] = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      caption: "",
    }));

    setSelectedImages((prev) => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleCaptionChange = (index: number, caption: string) => {
    setSelectedImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, caption } : img)),
    );
  };

  const parseLinesToArray = (text?: string): string[] => {
    if (!text) return [];
    return text
      .split("\n")
      .map((line) => line.replace(/^[\*\-\•]\s*/, "").trim())
      .filter(Boolean);
  };

  const parseList = (str?: string) =>
    str
      ? str
          .split(/[\n,]+/)
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const form = useForm({
    defaultValues: {
      name: "",
      type: "Full-Stack Web App",
      shortDescription: "",
      description: "",
      frontendTech: "",
      backendTech: "",
      tools: "",
      githubClient: "",
      githubServer: "",
      liveUrl: "",
      walkthroughVideoUrl: "",
      keyFeatures: "",
      challengesFaced: "",
      futurePlans: "",
      isFeatured: false,
      isPublished: true,
    },
    onSubmit: async ({ value }) => {
      // Client validation for required URLs
      if (!value.name?.trim()) {
        toast.error("Project name is required!");
        return;
      }
      if (!value.githubClient?.trim()) {
        toast.error("GitHub Client URL is required!");
        return;
      }
      if (!value.githubServer?.trim()) {
        toast.error("GitHub Server URL is required by backend!");
        return;
      }
      if (!value.liveUrl?.trim()) {
        toast.error("Live Demo URL is required!");
        return;
      }

      setIsUploadingImages(true);

      try {
        // ১. ক্লাউডিনারিতে ছবি আপলোড
        const uploadedImages: Array<{ imageUrl: string; caption?: string }> =
          [];

        for (const item of selectedImages) {
          const cloudUrl = await uploadImageToCloudinary(item.file);
          if (cloudUrl) {
            const imgObj: { imageUrl: string; caption?: string } = {
              imageUrl: cloudUrl,
            };
            // caption যদি থাকে তবেই পাঠানো হবে, null পাঠানো যাবে না
            if (item.caption && item.caption.trim() !== "") {
              imgObj.caption = item.caption.trim();
            }
            uploadedImages.push(imgObj);
          }
        }

        // ২. পে-লোড তৈরি (কোনো null ছাড়া)
        const payload: any = {
          name: value.name.trim(),
          type: value.type.trim(),
          shortDescription: value.shortDescription.trim(),
          description: value.description.trim(),
          frontendTech: parseList(value.frontendTech),
          backendTech: parseList(value.backendTech),
          tools: parseList(value.tools),
          githubClient: value.githubClient.trim(),
          githubServer: value.githubServer.trim(),
          liveUrl: value.liveUrl.trim(),
          keyFeatures: parseLinesToArray(value.keyFeatures),
          challengesFaced: parseLinesToArray(value.challengesFaced),
          futurePlans: parseLinesToArray(value.futurePlans),
          isFeatured: Boolean(value.isFeatured),
          isPublished: Boolean(value.isPublished),
        };

        // walkthroughVideoUrl কেবল ভ্যালু থাকলেই পাঠানো হবে (কখনোই null না)
        if (
          value.walkthroughVideoUrl &&
          value.walkthroughVideoUrl.trim() !== ""
        ) {
          payload.walkthroughVideoUrl = value.walkthroughVideoUrl.trim();
        }

        // images কেবল ছবি সিলেক্ট করা থাকলে পাঠানো হবে
        if (uploadedImages.length > 0) {
          payload.images = uploadedImages;
        }

        console.log("Clean payload without nulls:", payload);

        createProject(payload, {
          onSuccess: () => {
            toast.success("Project published successfully!");
            router.push("/dashboard/projects");
          },
          onError: (err: any) => {
            console.error("Backend Error Details:", err);
            toast.error(err?.message || "Failed to save project.");
          },
        });
      } catch (err: any) {
        console.error("Upload error:", err);
        toast.error("Image upload failed. Please try again.");
      } finally {
        setIsUploadingImages(false);
      }
    },
  });

  const isPending = isSubmittingProject || isUploadingImages;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-orange-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to projects
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            Create New Project<span className="text-orange-600">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Showcase your development architecture, features, repositories, and
            screenshots.
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        {/* 1. GENERAL INFORMATION */}
        <Card className="border-orange-200/80 bg-white shadow-xs rounded-[12px] overflow-hidden">
          <CardHeader className="bg-[#FFFDF9] border-b border-orange-100/80 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-[8px] bg-orange-100/80 text-orange-600">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-neutral-900">
                  Basic Project Info
                </CardTitle>
                <CardDescription className="text-xs text-neutral-500">
                  Core identity, categorical type, and brief synopsis.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <form.Field name="name">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className="text-xs font-bold uppercase tracking-wider text-orange-700/90 flex items-center gap-1"
                    >
                      Project Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={field.name}
                      placeholder="e.g. ShareGear, Wedlyn"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                    />
                    {field.state.value && (
                      <p className="text-[11px] text-neutral-400 font-mono">
                        Slug:{" "}
                        <span className="text-orange-600 font-medium">
                          /{generateSlug(field.state.value)}
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="type">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className="text-xs font-bold uppercase tracking-wider text-orange-700/90 flex items-center gap-1"
                    >
                      Project Type / Classification{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={field.name}
                      placeholder="e.g. Full-Stack Web Application, Mobile App"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                    />
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="shortDescription">
              {(field) => (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor={field.name}
                      className="text-xs font-bold uppercase tracking-wider text-orange-700/90 flex items-center gap-1"
                    >
                      Short Description (Card Banner){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {field.state.value.length}/280
                    </span>
                  </div>
                  <Input
                    id={field.name}
                    placeholder="Concise overview highlighting core problem solved..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    maxLength={280}
                    className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <div className="space-y-1.5">
                  <Label
                    htmlFor={field.name}
                    className="text-xs font-bold uppercase tracking-wider text-orange-700/90 flex items-center gap-1"
                  >
                    Full In-depth Description{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id={field.name}
                    rows={5}
                    placeholder="Comprehensive project overview, motivation, architecture..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="w-full rounded-[12px] p-3.5 text-sm bg-neutral-50/40 border border-neutral-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all leading-relaxed"
                  />
                </div>
              )}
            </form.Field>
          </CardContent>
        </Card>

        {/* 2. TECH STACK & URLS */}
        <Card className="border-orange-200/80 bg-white shadow-xs rounded-[12px] overflow-hidden">
          <CardHeader className="bg-[#FFFDF9] border-b border-orange-100/80 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-[8px] bg-orange-100/80 text-orange-600">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-neutral-900">
                  Tech Stack & Repository Links
                </CardTitle>
                <CardDescription className="text-xs text-neutral-500">
                  Separate multiple entries with commas.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <form.Field name="frontendTech">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className="text-xs font-bold uppercase tracking-wider text-orange-700/90"
                    >
                      Frontend Tech
                    </Label>
                    <Input
                      id={field.name}
                      placeholder="Next.js, Tailwind, Zustand"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="backendTech">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className="text-xs font-bold uppercase tracking-wider text-orange-700/90"
                    >
                      Backend Tech
                    </Label>
                    <Input
                      id={field.name}
                      placeholder="Node.js, Express, PostgreSQL"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="tools">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className="text-xs font-bold uppercase tracking-wider text-orange-700/90"
                    >
                      Tools & Services
                    </Label>
                    <Input
                      id={field.name}
                      placeholder="Docker, Postman, Stripe"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                    />
                  </div>
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              <form.Field name="githubClient">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className="text-xs font-bold uppercase tracking-wider text-orange-700/90 flex items-center gap-1"
                    >
                      GitHub Client Repo URL{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={field.name}
                      placeholder="https://github.com/username/client-repo"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="githubServer">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className="text-xs font-bold uppercase tracking-wider text-orange-700/90"
                    >
                      GitHub Server Repo URL (Optional)
                    </Label>
                    <Input
                      id={field.name}
                      placeholder="https://github.com/username/server-repo"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                    />
                  </div>
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              <form.Field name="liveUrl">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className="text-xs font-bold uppercase tracking-wider text-orange-700/90 flex items-center gap-1"
                    >
                      Live Demo URL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={field.name}
                      placeholder="https://your-project.vercel.app"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="walkthroughVideoUrl">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className="text-xs font-bold uppercase tracking-wider text-orange-700/90"
                    >
                      Walkthrough Video (YouTube / Loom)
                    </Label>
                    <Input
                      id={field.name}
                      placeholder="https://youtube.com/watch?v=..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                    />
                  </div>
                )}
              </form.Field>
            </div>
          </CardContent>
        </Card>

        {/* 3. SCREENSHOTS & GALLERY */}
        <Card className="border-orange-200/80 bg-white shadow-xs rounded-[12px] overflow-hidden">
          <CardHeader className="bg-[#FFFDF9] border-b border-orange-100/80 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-[8px] bg-orange-100/80 text-orange-600">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-neutral-900">
                    Project Screenshots
                  </CardTitle>
                  <CardDescription className="text-xs text-neutral-500">
                    Uploads directly to Cloudinary when you hit save.
                  </CardDescription>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-[10px] h-9 px-3.5 bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100/70 text-xs font-semibold gap-1.5 shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                Select Images
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {selectedImages.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-orange-200/80 hover:border-orange-400 bg-neutral-50/40 hover:bg-orange-50/20 rounded-[12px] p-8 text-center transition-all flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-orange-100/80 text-orange-600 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-neutral-800">
                  Click here to browse project images
                </p>
                <p className="text-[11px] text-neutral-400">
                  PNG, JPG, WebP up to 10MB each
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group border border-neutral-200 rounded-[12px] overflow-hidden bg-white shadow-xs flex flex-col"
                  >
                    <div className="relative aspect-video bg-neutral-100 overflow-hidden">
                      <img
                        src={img.previewUrl}
                        alt="Project preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-2.5 bg-neutral-50/60 border-t border-neutral-100">
                      <Input
                        placeholder="Caption (e.g. Dashboard view)"
                        value={img.caption}
                        onChange={(e) =>
                          handleCaptionChange(idx, e.target.value)
                        }
                        className="h-8 text-xs bg-white rounded-[8px] border-neutral-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 4. FEATURES & REFLECTIONS */}
        <Card className="border-orange-200/80 bg-white shadow-xs rounded-[12px] overflow-hidden">
          <CardHeader className="bg-[#FFFDF9] border-b border-orange-100/80 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-[8px] bg-orange-100/80 text-orange-600">
                <ListChecks className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-neutral-900">
                  Features & Engineering Reflections
                </CardTitle>
                <CardDescription className="text-xs text-neutral-500">
                  Write each point on a new line (press Enter).
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            <form.Field name="keyFeatures">
              {(field) => (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor={field.name}
                      className="text-xs font-bold uppercase tracking-wider text-orange-700/90"
                    >
                      Key Features
                    </Label>
                    <span className="text-[11px] text-neutral-400 font-medium">
                      One feature per line
                    </span>
                  </div>
                  <textarea
                    id={field.name}
                    rows={4}
                    placeholder={`Authentication - Implemented JWT with refresh tokens\nPayment - Integrated Stripe webhook for subscriptions\nReal-time - Live notifications using Socket.io`}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="w-full rounded-[12px] p-3.5 text-sm bg-neutral-50/40 border border-neutral-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all leading-relaxed placeholder:text-neutral-400"
                  />
                </div>
              )}
            </form.Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              <form.Field name="challengesFaced">
                {(field) => (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={field.name}
                        className="text-xs font-bold uppercase tracking-wider text-orange-700/90"
                      >
                        Challenges Faced & Solutions
                      </Label>
                      <span className="text-[11px] text-neutral-400 font-medium">
                        One per line
                      </span>
                    </div>
                    <textarea
                      id={field.name}
                      rows={4}
                      placeholder={`Connection Pooling - Configured Prisma acceleration\nState Sync - Zustand persisted store resolved re-render latency`}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="w-full rounded-[12px] p-3.5 text-sm bg-neutral-50/40 border border-neutral-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all leading-relaxed placeholder:text-neutral-400"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="futurePlans">
                {(field) => (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={field.name}
                        className="text-xs font-bold uppercase tracking-wider text-orange-700/90"
                      >
                        Future Improvements
                      </Label>
                      <span className="text-[11px] text-neutral-400 font-medium">
                        One per line
                      </span>
                    </div>
                    <textarea
                      id={field.name}
                      rows={4}
                      placeholder={`Redis Cache - Query caching for high-traffic endpoints\nMobile App - Cross-platform React Native client`}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="w-full rounded-[12px] p-3.5 text-sm bg-neutral-50/40 border border-neutral-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all leading-relaxed placeholder:text-neutral-400"
                    />
                  </div>
                )}
              </form.Field>
            </div>
          </CardContent>
        </Card>

        {/* 5. PUBLISH & FEATURED TOGGLES */}
        <Card className="border-orange-200/80 bg-white shadow-xs rounded-[12px] overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <form.Field name="isPublished">
                {(field) => (
                  <div className="flex items-center justify-between p-3.5 rounded-[12px] border border-neutral-200 bg-neutral-50/30">
                    <div>
                      <Label
                        htmlFor="publish-toggle"
                        className="text-sm font-semibold text-neutral-800 cursor-pointer"
                      >
                        Publish Immediately
                      </Label>
                      <p className="text-xs text-neutral-400">
                        Visible publicly on your live portfolio.
                      </p>
                    </div>
                    <Switch
                      id="publish-toggle"
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(checked)}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="isFeatured">
                {(field) => (
                  <div className="flex items-center justify-between p-3.5 rounded-[12px] border border-neutral-200 bg-neutral-50/30">
                    <div>
                      <Label
                        htmlFor="featured-toggle"
                        className="text-sm font-semibold text-neutral-800 cursor-pointer"
                      >
                        Featured Project
                      </Label>
                      <p className="text-xs text-neutral-400">
                        Prioritize on hero banner or featured spotlight.
                      </p>
                    </div>
                    <Switch
                      id="featured-toggle"
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(checked)}
                    />
                  </div>
                )}
              </form.Field>
            </div>
          </CardContent>
        </Card>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-4 z-20 flex justify-end">
          <div className="p-2 rounded-[14px] bg-white/95 backdrop-blur-md border border-orange-200/80 shadow-lg shadow-orange-950/10 flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/projects")}
              className="rounded-[10px] px-5 h-10 text-xs font-semibold border-neutral-200 hover:bg-neutral-50"
            >
              Cancel
            </Button>

            <Button
              disabled={isPending}
              type="submit"
              className="rounded-[10px] px-6 h-10 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs transition-all shadow-md shadow-orange-600/20 active:scale-95 gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {isUploadingImages
                      ? "Uploading Media..."
                      : "Saving Project..."}
                  </span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Project</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
