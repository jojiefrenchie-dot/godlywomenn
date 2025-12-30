"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function EditProfilePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    facebook: "",
    twitter: "",
    instagram: "",
    avatar: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Profile update implementation needed

      router.push("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-[#dc143c] mb-2">
          Edit Profile
        </h1>
        <p className="text-gray-600">
          Update your personal information and profile settings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-6">
          <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-gray-200">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Profile preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="h-12 w-12 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Photo
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="avatar"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Change Photo
              </label>
              {previewUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, avatar: null });
                    setPreviewUrl("");
                  }}
                  className="text-sm text-[#dc143c] hover:text-[#b01031]"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#dc143c] focus:ring-[#dc143c] sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#dc143c] focus:ring-[#dc143c] sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700"
          >
            Bio
          </label>
          <textarea
            id="bio"
            rows={4}
            value={formData.bio}
            onChange={(e) =>
              setFormData({ ...formData, bio: e.target.value })
            }
            placeholder="Tell us a little about yourself..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#dc143c] focus:ring-[#dc143c] sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="City, Country"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#dc143c] focus:ring-[#dc143c] sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="website"
            className="block text-sm font-medium text-gray-700"
          >
            Website
          </label>
          <input
            type="url"
            id="website"
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
            placeholder="https://example.com"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#dc143c] focus:ring-[#dc143c] sm:text-sm"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Social Media</h3>

          <div>
            <label
              htmlFor="facebook"
              className="block text-sm font-medium text-gray-700"
            >
              Facebook
            </label>
            <input
              type="url"
              id="facebook"
              value={formData.facebook}
              onChange={(e) =>
                setFormData({ ...formData, facebook: e.target.value })
              }
              placeholder="https://facebook.com/username"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#dc143c] focus:ring-[#dc143c] sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="twitter"
              className="block text-sm font-medium text-gray-700"
            >
              Twitter
            </label>
            <input
              type="url"
              id="twitter"
              value={formData.twitter}
              onChange={(e) =>
                setFormData({ ...formData, twitter: e.target.value })
              }
              placeholder="https://twitter.com/username"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#dc143c] focus:ring-[#dc143c] sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="instagram"
              className="block text-sm font-medium text-gray-700"
            >
              Instagram
            </label>
            <input
              type="url"
              id="instagram"
              value={formData.instagram}
              onChange={(e) =>
                setFormData({ ...formData, instagram: e.target.value })
              }
              placeholder="https://instagram.com/username"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#dc143c] focus:ring-[#dc143c] sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/profile"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#dc143c] text-white rounded-md hover:bg-[#b01031] disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}