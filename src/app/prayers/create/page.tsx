"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

type PrayerType = "request" | "testimony";

export default function CreatePrayerPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prayerType, setPrayerType] = useState<PrayerType>("request");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isAnonymous: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.content.trim()) {
      setError("Content is required");
      return;
    }

    try {
      setIsSubmitting(true);

      const token = accessToken;
      if (!token) {
        setError("You must be logged in to post a prayer request");
        return;
      }

      const prayer = {
        title: formData.title,
        content: formData.content,
        type: prayerType,
        is_anonymous: formData.isAnonymous,
      };

      const response = await fetch("/api/prayers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(prayer),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create prayer request");
      }

      // Redirect to prayers list on success
      router.push("/prayers");
    } catch (err: any) {
      console.error("Error creating prayer:", err);
      setError(err.message || "An error occurred while creating your prayer request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-[#dc143c] mb-2">
          {prayerType === "request" ? "Share Prayer Request" : "Share Testimony"}
        </h1>
        <p className="text-gray-600">
          {prayerType === "request"
            ? "Share your prayer needs with the community."
            : "Share how God has answered your prayers."}
        </p>
      </div>

      <div className="mb-8">
        <div className="flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setPrayerType("request")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-l-md border ${
              prayerType === "request"
                ? "bg-[#fdebd0] text-[#dc143c] border-[#dc143c]"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Prayer Request
          </button>
          <button
            type="button"
            onClick={() => setPrayerType("testimony")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
              prayerType === "testimony"
                ? "bg-[#fdebd0] text-[#dc143c] border-[#dc143c]"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Testimony
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title <span className="text-[#dc143c]">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder={
              prayerType === "request"
                ? "e.g., Prayer for healing"
                : "e.g., God's faithfulness in my life"
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#dc143c] focus:ring-[#dc143c] sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            {prayerType === "request" ? "Prayer Request" : "Testimony"}{" "}
            <span className="text-[#dc143c]">*</span>
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            rows={6}
            placeholder={
              prayerType === "request"
                ? "Share your prayer request here..."
                : "Share your testimony of God's goodness here..."
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#dc143c] focus:ring-[#dc143c] sm:text-sm"
            required
          />
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="anonymous"
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={(e) =>
                setFormData({ ...formData, isAnonymous: e.target.checked })
              }
              className="h-4 w-4 text-[#dc143c] focus:ring-[#dc143c] border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="anonymous" className="font-medium text-gray-700">
              Post Anonymously
            </label>
            <p className="text-gray-500">
              Your name will not be displayed with this{" "}
              {prayerType === "request" ? "prayer request" : "testimony"}
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/prayers"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#dc143c] text-white rounded-md hover:bg-[#b01031] disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}