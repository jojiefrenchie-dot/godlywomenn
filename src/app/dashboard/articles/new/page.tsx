"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/lib/AuthContext";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createArticle, getCategories, ArticleCategory } from "@/lib/articles";
import { generateArticle } from "@/app/api/ai";

const TiptapEditor = dynamic(() => import("@/app/components/TiptapEditor"), {
  ssr: false,
  loading: () => (
    <div className="border rounded-md border-gray-300 p-4 min-h-[400px] animate-pulse bg-gray-50" />
  ),
});

export default function CreateArticlePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    featured_image: null as File | null,
    category_id: "",
  });

  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

      try {
        // Client-side validation
        const errors: Record<string, string[]> = {};
        
        // Required field validation
        if (!formData.title?.trim()) errors.title = ['Title is required'];
        if (!formData.excerpt?.trim()) errors.excerpt = ['Excerpt is required'];
        // Validate category is selected and is a valid UUID
        if (!formData.category_id) {
          errors.category = ['Category is required'];
        } else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(formData.category_id)) {
          errors.category = ['Please select a valid category'];
        }
        if (!content?.trim()) errors.content = ['Content is required'];      // Content validation
      if (content?.trim() && content.trim().length < 50) {
        errors.content = ['Content should be at least 50 characters long'];
      }
      
      // Title validation
      if (formData.title?.trim()) {
        if (formData.title.length > 1024) {
          errors.title = ['Title should not exceed 1024 characters'];
        }
      }

      // If there are validation errors, show them and return early
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setError('Please correct the errors below before submitting.');
        return;
      }

      setIsSubmitting(true);

      // Use auth context for the author id
      const userId = user?.id;
      if (!userId) {
        setError('You must be signed in to publish an article');
        return;
      }

      try {
        const article = await createArticle({
          ...formData,
          content,
          author_id: userId as string,
        });

        if (!article || !article.slug) {
          throw new Error('Failed to create article');
        }

        router.push(`/articles/${article.slug}`);
      } catch (err: any) {
        if (err.message === 'Failed to create article') {
          setError('Failed to create article. Please try again.');
        } else if (typeof err.message === 'string') {
          setError(err.message);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      }
    } catch (error: any) {
      console.error("Error creating article:", error);
      if (!error.message.includes('Please fill in all required fields')) {
        setError(error.message || 'An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNLPProcessing = async (field: 'title' | 'excerpt', value: string) => {
    try {
      const endpoint = field === 'title' ? '/api/ai/analyze-text/' : '/api/ai/analyze-excerpt/';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field === 'title' ? 'text' : 'excerpt']: value }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (field === 'title') {
          setTitleSuggestions(data.analysis || []);
        } else {
          setExcerptSuggestions(data.analysis || []);
        }
      }
    } catch (error) {
      console.error(`Error analyzing ${field}:`, error);
    }
  };

  const handleContentAnalysis = async (content: string) => {
    try {
      const response = await fetch('/api/ai/tagging/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategorySuggestions(data.tags || []);
      }
    } catch (error) {
      console.error('Error analyzing content:', error);
    }
  };

  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [excerptSuggestions, setExcerptSuggestions] = useState<string[]>([]);
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [categories, setCategories] = useState<ArticleCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleGenerateArticle = async () => {
    if (!formData.title.trim()) {
      setError('Please enter a title first');
      return;
    }
    
    setIsGenerating(true);
    try {
      // Combine title and excerpt for better context
      const context = formData.excerpt?.trim() 
        ? `${formData.title}. ${formData.excerpt}`
        : formData.title;
      const generatedContent = await generateArticle(context, 110);
      setContent(generatedContent);
    } catch (err: any) {
      setError('Failed to generate article. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-[#dc143c] mb-2">
          Write an Article
        </h1>
        <p className="text-gray-600">
          Share your thoughts, insights, and testimonies with the community.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
              onChange={(e) => {
                const newValue = e.target.value;
                setFormData({ ...formData, title: newValue });
                handleNLPProcessing('title', newValue);
                if (validationErrors.title) {
                  setValidationErrors((prev) => ({ ...prev, title: [] }));
                }
              }}
              className={`mt-1 block w-full rounded-md border ${
                validationErrors.title ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 focus:border-[#dc143c] focus:ring-[#dc143c] sm:text-sm`}
              required
            />
            {titleSuggestions.length > 0 && (
              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs font-semibold text-blue-900 mb-1">Suggestions:</p>
                <ul className="text-xs text-blue-700">
                  {titleSuggestions.map((suggestion, index) => (
                    <li key={index} className="bullet">• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.title.join(', ')}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category <span className="text-[#dc143c]">*</span>
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <select
                id="category"
                value={formData.category_id}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  // Only update if a valid category is selected
                  if (!selectedValue || /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(selectedValue)) {
                    setFormData({ ...formData, category_id: selectedValue });
                    // Clear validation errors when user selects a valid category
                    if (validationErrors.category) {
                      setValidationErrors(prev => ({ ...prev, category: [] }));
                    }
                  }
                }}
                className={`block w-full rounded-md border ${
                  validationErrors.category ? 'border-red-500' : 'border-gray-300'
                } px-3 py-2 focus:border-[#dc143c] focus:ring-[#dc143c] sm:text-sm`}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {validationErrors.category && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.category.join(', ')}</p>
              )}
              {/* 'New' button removed as requested */}
            </div>
            {categories.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">
                No categories available.{" "}
                <Link
                  href="/dashboard/categories"
                  className="text-[#dc143c] hover:underline"
                >
                  Create one first
                </Link>
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-700"
          >
            Excerpt <span className="text-[#dc143c]">*</span>
          </label>
          <textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => {
              const newValue = e.target.value;
              setFormData({ ...formData, excerpt: newValue });
              handleNLPProcessing('excerpt', newValue);
              if (validationErrors.excerpt) {
                setValidationErrors((prev) => ({ ...prev, excerpt: [] }));
              }
            }}
            rows={3}
            className={`mt-1 block w-full rounded-md border ${
              validationErrors.excerpt ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 focus:border-[#dc143c] focus:ring-[#dc143c] sm:text-sm`}
            required
          />
          {excerptSuggestions.length > 0 && (
            <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs font-semibold text-blue-900 mb-1">Suggestions:</p>
              <ul className="text-xs text-blue-700">
                {excerptSuggestions.map((suggestion, index) => (
                  <li key={index} className="bullet">• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}
          {validationErrors.excerpt && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.excerpt.join(', ')}</p>
          )}
        </div>



        <div>
          <label
            htmlFor="featured_image"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Featured Image
          </label>
          <div className="flex flex-col gap-2">
            {/* Image preview */}
            {formData.featured_image && (
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-green-300">
                <Image
                  src={URL.createObjectURL(formData.featured_image)}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="100%"
                />
              </div>
            )}

            {/* Upload button */}
            <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#dc143c] hover:bg-red-50 transition cursor-pointer">
              <input
                type="file"
                id="featured_image"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData({ ...formData, featured_image: file });
                }}
                className="hidden"
              />
              <span className="text-lg">📷</span>
              <span className="ml-2 text-gray-700 font-medium">
                {formData.featured_image ? 'Click to change image' : 'Click to add featured image'}
              </span>
            </label>

            {/* File confirmation */}
            {formData.featured_image && (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded px-3 py-2">
                <span className="text-sm text-green-800">✓ Image selected: {formData.featured_image.name}</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, featured_image: null })}
                  className="text-red-600 hover:text-red-800 font-bold text-sm"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content <span className="text-[#dc143c]">*</span>
          </label>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={handleGenerateArticle}
              disabled={isGenerating}
              className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Generate Article
                </>
              )}
            </button>
          </div>
          <Suspense fallback={<div className="border rounded-md border-gray-300 p-4 min-h-[400px] animate-pulse bg-gray-50" />}>
            <div className={validationErrors.content ? 'border border-red-500 rounded-md' : ''}>
            <TiptapEditor 
              content={content} 
              onChange={(newContent) => {
                setContent(newContent);
                handleContentAnalysis(newContent);
                if (validationErrors.content) {
                  setValidationErrors((prev) => ({ ...prev, content: [] }));
                }
              }} 
            />
          </div>
          {categorySuggestions.length > 0 && (
            <div className="mt-4 p-2 bg-green-50 rounded border border-green-200">
              <p className="text-xs font-semibold text-green-900 mb-1">Suggested Categories:</p>
              <ul className="text-xs text-green-700">
                {categorySuggestions.map((suggestion, index) => (
                  <li key={index} className="bullet">• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}
          {validationErrors.content && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.content.join(', ')}</p>
          )}
          </Suspense>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/dashboard"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#dc143c] text-white rounded-md hover:bg-[#b01031] disabled:opacity-50"
          >
            {isSubmitting ? "Publishing..." : "Publish Article"}
          </button>
        </div>
      </form>
    </div>
  );
}