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
  Trash2,
  ExternalLink,
} from "lucide-react";

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

import { useUpdateProject, useDeleteProject } from "@/hooks/project.hook";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";
import { DeleteProjectModal } from "./DeleteProjectModal";
import { IProject } from "@/types/project.type";

interface ExistingImage {
  id?: string;
  imageUrl: string;
  caption?: string | null;
}

interface NewSelectedImage {
  file: File;
  previewUrl: string;
  caption: string;
}

interface ProjectEditFormProps {
  initialProject: IProject;
}

export function ProjectEditForm({ initialProject }: ProjectEditFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(
    initialProject.images || []
  );
  const [newSelectedImages, setNewSelectedImages] = useState<NewSelectedImage[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  // New Image Selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const added: NewSelectedImage[] = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      caption: "",
    }));

    setNewSelectedImages((prev) => [...prev, ...added]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRemoveNewImage = (index: number) => {
    setNewSelectedImages((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, idx) => idx !== index);
    });
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

  const handleDeleteProject = () => {
    deleteProject(initialProject.id, {
      onSuccess: () => {
        toast.success("Project deleted successfully");
        router.push("/dashboard/projects");
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to delete project");
      },
    });
  };

  const form = useForm({
    defaultValues: {
      name: initialProject.name || "",
      type: initialProject.type || "",
      shortDescription: initialProject.shortDescription || "",
      description: initialProject.description || "",
      frontendTech: (initialProject.frontendTech || []).join(", "),
      backendTech: (initialProject.backendTech || []).join(", "),
      tools: (initialProject.tools || []).join(", "),
      githubClient: initialProject.githubClient || "",
      githubServer: initialProject.githubServer || "",
      liveUrl: initialProject.liveUrl || "",
      walkthroughVideoUrl: initialProject.walkthroughVideoUrl || "",
      keyFeatures: (initialProject.keyFeatures || []).join("\n"),
      challengesFaced: (initialProject.challengesFaced || []).join("\n"),
      futurePlans: (initialProject.futurePlans || []).join("\n"),
      isFeatured: Boolean(initialProject.isFeatured),
      isPublished: Boolean(initialProject.isPublished),
    },
    onSubmit: async ({ value }) => {
      if (!value.name?.trim()) {
        toast.error("Project name is required!");
        return;
      }
      if (!value.githubClient?.trim()) {
        toast.error("GitHub Client URL is required!");
        return;
      }
      if (!value.githubServer?.trim()) {
        toast.error("GitHub Server URL is required!");
        return;
      }
      if (!value.liveUrl?.trim()) {
        toast.error("Live Demo URL is required!");
        return;
      }

      setIsUploadingImages(true);

      try {
        // ১. নতুন সিলেক্ট করা ছবিগুলো Cloudinary-তে আপলোড
        const newlyUploaded: Array<{ imageUrl: string; caption?: string }> = [];

        for (const item of newSelectedImages) {
          const cloudUrl = await uploadImageToCloudinary(item.file);
          if (cloudUrl) {
            const obj: { imageUrl: string; caption?: string } = {
              imageUrl: cloudUrl,
            };
            if (item.caption?.trim()) obj.caption = item.caption.trim();
            newlyUploaded.push(obj);
          }
        }

        // ২. বিদ্যমান ছবি + নতুন আপলোড করা ছবি একত্রিত করা
        const formattedExisting = existingImages.map((img) => ({
          imageUrl: img.imageUrl,
          ...(img.caption ? { caption: img.caption } : {}),
        }));

        const finalImages = [...formattedExisting, ...newlyUploaded];

        // ৩. আপডেট পে-লোড সাজানো
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
          images: finalImages,
          isFeatured: Boolean(value.isFeatured),
          isPublished: Boolean(value.isPublished),
        };

        if (value.walkthroughVideoUrl && value.walkthroughVideoUrl.trim() !== "") {
          payload.walkthroughVideoUrl = value.walkthroughVideoUrl.trim();
        }

        updateProject(
          { id: initialProject.id, payload },
          {
            onSuccess: () => {
              toast.success("Project updated successfully!");
              router.refresh();
            },
            onError: (err: any) => {
              toast.error(err?.message || "Failed to update project.");
            },
          }
        );
      } catch (err: any) {
        toast.error("Failed to upload new media.");
      } finally {
        setIsUploadingImages(false);
      }
    },
  });

  const isPending = isUpdating || isUploadingImages;

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        {/* Header Bar with Delete & External View */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                {initialProject.name}
              </h1>
              <a
                href={initialProject.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-neutral-400 hover:text-orange-600 transition-colors p-1"
                title="Open Live Preview"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              Slug: <span className="font-mono text-orange-600 font-medium">/{initialProject.slug}</span>
            </p>
          </div>

          <Button
            type="button"
            variant="destructive"
            onClick={() => setIsDeleteModalOpen(true)}
            className="rounded-[10px] h-9 px-3.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold gap-1.5 shadow-none"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Project</span>
          </Button>
        </div>

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
                  Edit core titles, classification, and summaries.
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
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border border-neutral-200 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                    />
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
                      Project Type / Classification <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={field.name}
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
                      Short Description <span className="text-red-500">*</span>
                    </Label>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {field.state.value.length}/280
                    </span>
                  </div>
                  <Input
                    id={field.name}
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
                    Full Description <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id={field.name}
                    rows={6}
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

        {/* 2. TECH STACK & REPOSITORIES */}
        <Card className="border-orange-200/80 bg-white shadow-xs rounded-[12px] overflow-hidden">
          <CardHeader className="bg-[#FFFDF9] border-b border-orange-100/80 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-[8px] bg-orange-100/80 text-orange-600">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-neutral-900">
                  Tech Stack & Links
                </CardTitle>
                <CardDescription className="text-xs text-neutral-500">
                  Separate technologies with commas.
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
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border border-neutral-200 focus-visible:ring-orange-500"
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
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border border-neutral-200 focus-visible:ring-orange-500"
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
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border border-neutral-200 focus-visible:ring-orange-500"
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
                      GitHub Client Repo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border border-neutral-200 focus-visible:ring-orange-500"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="githubServer">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className="text-xs font-bold uppercase tracking-wider text-orange-700/90 flex items-center gap-1"
                    >
                      GitHub Server Repo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border border-neutral-200 focus-visible:ring-orange-500"
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
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border border-neutral-200 focus-visible:ring-orange-500"
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
                      Walkthrough Video (Optional)
                    </Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-[12px] h-10 px-3.5 text-sm bg-neutral-50/40 border border-neutral-200 focus-visible:ring-orange-500"
                    />
                  </div>
                )}
              </form.Field>
            </div>
          </CardContent>
        </Card>

        {/* 3. MEDIA GALLERY */}
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
                    Manage current screenshots and upload additional images.
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
                Add More Images
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Existing Images */}
              {existingImages.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className="relative group border border-neutral-200 rounded-[12px] overflow-hidden bg-white shadow-xs"
                >
                  <div className="relative aspect-video bg-neutral-100 overflow-hidden">
                    <img
                      src={img.imageUrl}
                      alt="Project"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {img.caption && (
                    <div className="p-2 bg-neutral-50 text-[11px] text-neutral-500 truncate border-t border-neutral-100">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}

              {/* Newly Selected Local Previews */}
              {newSelectedImages.map((img, idx) => (
                <div
                  key={`new-${idx}`}
                  className="relative border-2 border-dashed border-orange-300 rounded-[12px] overflow-hidden bg-orange-50/20 shadow-xs flex flex-col"
                >
                  <div className="relative aspect-video bg-neutral-100 overflow-hidden">
                    <img
                      src={img.previewUrl}
                      alt="New selection"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-[6px] bg-orange-600 text-[10px] font-bold text-white uppercase tracking-wider">
                      New
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-2 bg-white border-t border-orange-100">
                    <Input
                      placeholder="Caption (optional)"
                      value={img.caption}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewSelectedImages((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, caption: val } : item
                          )
                        );
                      }}
                      className="h-7 text-xs bg-white rounded-[6px] border-neutral-200"
                    />
                  </div>
                </div>
              ))}
            </div>

            {existingImages.length === 0 && newSelectedImages.length === 0 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-orange-200/80 hover:border-orange-400 bg-neutral-50/40 rounded-[12px] p-8 text-center transition-all flex flex-col items-center justify-center gap-2"
              >
                <Upload className="w-6 h-6 text-orange-500" />
                <p className="text-xs font-semibold text-neutral-800">
                  No images uploaded. Click to add images.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 4. KEY FEATURES & REFLECTIONS */}
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
                  One entry per line.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            <form.Field name="keyFeatures">
              {(field) => (
                <div className="space-y-1.5">
                  <Label
                    htmlFor={field.name}
                    className="text-xs font-bold uppercase tracking-wider text-orange-700/90"
                  >
                    Key Features
                  </Label>
                  <textarea
                    id={field.name}
                    rows={4}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="w-full rounded-[12px] p-3.5 text-sm bg-neutral-50/40 border border-neutral-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all leading-relaxed"
                  />
                </div>
              )}
            </form.Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              <form.Field name="challengesFaced">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className="text-xs font-bold uppercase tracking-wider text-orange-700/90"
                    >
                      Challenges Faced
                    </Label>
                    <textarea
                      id={field.name}
                      rows={4}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="w-full rounded-[12px] p-3.5 text-sm bg-neutral-50/40 border border-neutral-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all leading-relaxed"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="futurePlans">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={field.name}
                      className="text-xs font-bold uppercase tracking-wider text-orange-700/90"
                    >
                      Future Improvements
                    </Label>
                    <textarea
                      id={field.name}
                      rows={4}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="w-full rounded-[12px] p-3.5 text-sm bg-neutral-50/40 border border-neutral-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all leading-relaxed"
                    />
                  </div>
                )}
              </form.Field>
            </div>
          </CardContent>
        </Card>

        {/* 5. TOGGLES */}
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
                        Publish Status
                      </Label>
                      <p className="text-xs text-neutral-400">
                        Visible on portfolio public routes
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
                        Featured Spotlight
                      </Label>
                      <p className="text-xs text-neutral-400">
                        Display on highlight sections
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
              Back
            </Button>

            <Button
              disabled={isPending}
              type="submit"
              className="rounded-[10px] px-6 h-10 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs transition-all shadow-md shadow-orange-600/20 active:scale-95 gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isUploadingImages ? "Uploading Media..." : "Saving Changes..."}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Project</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Dialog */}
      <DeleteProjectModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProject}
        projectName={initialProject.name}
        isPending={isDeleting}
      />
    </>
  );
}