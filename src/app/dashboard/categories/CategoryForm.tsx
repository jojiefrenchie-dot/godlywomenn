"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import type { ArticleCategory } from "@/lib/articles";

interface CategoryFormProps {
  onCategoryAdded: () => void;
}

export default function CategoryForm({ onCategoryAdded }: CategoryFormProps) {
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const { user, accessToken } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategory.name) {
      setValidationErrors({ name: ['Category name is required'] });
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setValidationErrors({});

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

      const response = await fetch("/api/categories", {
        method: "POST",
        headers,
        body: JSON.stringify(newCategory),
      });

      const data = await response.json();
      
      if (!response.ok) {
        const errorMsg = data?.error || data?.detail || "Failed to create category";
        if (response.status === 401) {
          setError("Please log in again. Your session may have expired.");
        } else {
          setError(errorMsg);
        }
        return;
      }

      // Reset form and notify parent
      setNewCategory({ name: "", description: "" });
      setError(null);
      onCategoryAdded();
    } catch (error) {
      console.error("Error creating category:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mb-12 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-medium mb-4">Add New Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name <span className="text-[#dc143c]">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={newCategory.name}
            onChange={(e) => {
              setNewCategory({ ...newCategory, name: e.target.value });
              if (validationErrors.name) {
                setValidationErrors(prev => ({ ...prev, name: [] }));
              }
            }}
            className={`mt-1 block w-full rounded-md border ${
              validationErrors.name ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 focus:border-[#dc143c] focus:ring-[#dc143c] sm:text-sm`}
            required
          />
          {validationErrors.name && validationErrors.name.length > 0 && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.name.join(', ')}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#dc143c] focus:ring-[#dc143c] sm:text-sm"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm mb-4">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#dc143c] text-white px-4 py-2 rounded hover:bg-[#dc143c]/90 disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
}