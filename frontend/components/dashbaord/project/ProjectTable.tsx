"use client";

import Link from "next/link";
import { Star, Eye, ExternalLink, Video, Globe } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IProject } from "@/types/project.type";
import { FaGithub, FaLinkedinIn, FaFacebookF } from "react-icons/fa";

interface ProjectTableProps {
  projects: IProject[];
  onToggleFeatured: (project: IProject) => void;
  isTogglingFeatured?: boolean;
}

export default function ProjectTable({
  projects,
  onToggleFeatured,
  isTogglingFeatured,
}: ProjectTableProps) {
  return (
    <div className="rounded-[12px] border border-orange-200/80 bg-white overflow-x-auto shadow-xs">
      <Table>
        <TableHeader className="bg-[#FFFDF9] border-b border-orange-100/80">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[180px] text-xs font-bold uppercase tracking-wider text-neutral-600">
              Name
            </TableHead>
            <TableHead className="w-[120px] text-xs font-bold uppercase tracking-wider text-neutral-600">
              Type
            </TableHead>
            {/* <TableHead className="min-w-[220px] text-xs font-bold uppercase tracking-wider text-neutral-600">
              Short Description
            </TableHead> */}
            <TableHead className="w-[140px] text-center text-xs font-bold uppercase tracking-wider text-neutral-600">
              Links
            </TableHead>
            <TableHead className="w-[100px] text-center text-xs font-bold uppercase tracking-wider text-neutral-600">
              Status
            </TableHead>
            <TableHead className="w-[110px] text-xs font-bold uppercase tracking-wider text-neutral-600">
              Created At
            </TableHead>
            <TableHead className="w-[110px] text-right text-xs font-bold uppercase tracking-wider text-neutral-600">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-28 text-center text-xs sm:text-sm text-neutral-400"
              >
                No projects found in this section.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow
                key={project.id}
                className="hover:bg-orange-50/40 transition-colors border-b border-neutral-100"
              >
                {/* Name & Slug */}
                <TableCell className="align-top py-3.5">
                  <div className="font-bold text-sm text-neutral-900 leading-snug">
                    {project.name}
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    /{project.slug}
                  </span>
                </TableCell>

                {/* Type Badge */}
                <TableCell className="align-top py-3.5">
                  <Badge
                    variant="outline"
                    className="rounded-[8px] px-2 py-0.5 border-orange-200 text-orange-700 bg-orange-50/60 font-medium text-[11px]"
                  >
                    {project.type}
                  </Badge>
                </TableCell>

                {/* Short Description
                <TableCell className="align-top py-3.5">
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {project.shortDescription}
                  </p>
                </TableCell> */}

                {/* Links */}
                <TableCell className="align-top py-3.5">
                  <div className="flex items-center justify-center gap-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Live Website"
                        className="p-1 rounded-[6px] text-neutral-400 hover:text-orange-600 hover:bg-orange-100/60 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                    {project.githubClient && (
                      <a
                        href={project.githubClient}
                        target="_blank"
                        rel="noreferrer"
                        title="Client Repository"
                        className="p-1 rounded-[6px] text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                      >
                        <FaGithub className="w-4 h-4" />
                      </a>
                    )}
                    {project.walkthroughVideoUrl ? (
                      <a
                        href={project.walkthroughVideoUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Walkthrough Video"
                        className="p-1 rounded-[6px] text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Video className="w-4 h-4" />
                      </a>
                    ) : (
                      <span
                        title="No video available"
                        className="p-1 text-neutral-200 cursor-not-allowed"
                      >
                        <Video className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Published Status */}
                <TableCell className="align-top py-3.5 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      project.isPublished
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                    }`}
                  >
                    {project.isPublished ? "Published" : "Draft"}
                  </span>
                </TableCell>

                {/* Created At */}
                <TableCell className="align-top py-3.5 text-xs text-neutral-500 whitespace-nowrap">
                  {new Date(project.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>

                {/* Action Buttons */}
                <TableCell className="align-top py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Featured Toggle Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={isTogglingFeatured}
                      onClick={() => onToggleFeatured(project)}
                      title={
                        project.isFeatured
                          ? "Remove from featured"
                          : "Mark as featured"
                      }
                      className={`h-8 w-8 p-0 rounded-[8px] transition-colors ${
                        project.isFeatured
                          ? "text-amber-500 bg-amber-50 hover:bg-amber-100/80"
                          : "text-neutral-400 hover:text-amber-500 hover:bg-amber-50/50"
                      }`}
                    >
                      <Star
                        className="w-4 h-4"
                        fill={project.isFeatured ? "currentColor" : "none"}
                      />
                    </Button>

                    {/* Go to Details/Edit Page */}
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 rounded-[8px] text-neutral-400 hover:text-orange-600 hover:bg-orange-100/60 transition-colors"
                      title="View Details"
                    >
                      <Link href={`/dashboard/projects/${project.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
