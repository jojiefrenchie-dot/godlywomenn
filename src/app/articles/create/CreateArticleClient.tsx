"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/app/components/TiptapEditor";
import { getCategories, ArticleCategory } from "@/lib/articles";
import { getBackendApiUrl, fetchWithAuth } from '@/lib/api';

export default function CreateArticleClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    featured_image: "",
    category_id: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadError, setUploadError] = useState("");

  const [content, setContent] = useState("");

  const generateWithAI = async () => {
    if (!formData.title.trim()) {
      setUploadError("Please enter a title first");
      return;
    }

    setIsGenerating(true);
    setUploadError("");

    try {
      // Try to include authenticated access token if available
      let accessToken: string | null = null;
      try {
        const sessionResp = await fetch('/api/auth/session');
        if (sessionResp.ok) {
          const sessionJson = await sessionResp.json();
          accessToken = sessionJson?.accessToken ?? null;
        }
      } catch (e) {
        // ignore session retrieval errors
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

      const response = await fetchWithAuth(getBackendApiUrl('/api/articles/generate/'), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: formData.title,
          topic: formData.category_id,
          max_words: 800,
        }),
      });

      if (!response.ok) {
        let errorBody: any = null;
        try {
          errorBody = await response.json();
        } catch (e) {
          try {
            errorBody = await response.text();
          } catch (ee) {
            errorBody = null;
          }
        }

        const message =
          errorBody && typeof errorBody === 'object'
            ? errorBody.error || errorBody.detail || JSON.stringify(errorBody)
            : String(errorBody) || 'Failed to generate content';

        throw new Error(message);
      }

      let data: any = null;
      try {
        data = await response.json();
      } catch (e) {
        const text = await response.text();
        data = { content: text };
      }

      setContent(data.content || "");
      if (data.excerpt) {
        setFormData((prev) => ({ ...prev, excerpt: data.excerpt }));
      }
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Failed to generate content"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, publishImmediately = false) => {
    e.preventDefault();
    setUploadError("");

    try {
      setIsSubmitting(true);

      if (!content || !formData.title || !formData.category_id) {
        throw new Error("Please fill in all required fields");
      }

      let imageUrl = formData.featured_image;
      if (imageFile) {
        const fd = new FormData();
        fd.append('featured_image', imageFile);

        const uploadResp = await fetch('/api/articles/upload-image', {
          method: 'POST',
          credentials: 'include',
          body: fd,
        });

        if (!uploadResp.ok) {
          let errBody = null;
          try { errBody = await uploadResp.json(); } catch (e) { errBody = await uploadResp.text(); }
          throw new Error((errBody && (errBody.detail || errBody.error)) || 'Failed to upload image');
        }

        const uploadData = await uploadResp.json();
        imageUrl = uploadData.url;
      }

      // Call server API which uses the service role key
      const requestPayload = { 
        ...formData, 
        content,
        featured_image: imageUrl,
        status: publishImmediately ? 'published' : 'draft'
      };
      
      console.log('Sending article creation request:', requestPayload);
      
      const resp = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(requestPayload)
      });

      console.log('Article creation response status:', resp.status);
      
      const responseText = await resp.text();
      console.log('Article creation response text:', responseText);
      
      let article;
      try {
        article = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError, 'Response text:', responseText);
        article = {};
      }
      
      if (!resp.ok) {
        console.error('Failed to create article via API:', { status: resp.status, response: article });
        const errorMsg = article?.error || article?.detail || `Failed to create article (Status: ${resp.status})`;
        throw new Error(errorMsg);
      }
      
      console.log('Article created successfully:', article);

      router.push(`/articles/${article.slug}`);
    } catch (error) {
      console.error("Error creating article:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create article';
      setUploadError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [categories, setCategories] = useState<ArticleCategory[]>([]);

  const [categoryError, setCategoryError] = useState<string>('');

  // Fetch categories on mount
  useEffect(() => {
    let mounted = true;
    let aborted = false;

    // exponential backoff retries
    const attempts = [0, 1000, 2000, 4000];

    (async () => {
      for (let i = 0; i < attempts.length; i++) {
        if (aborted) return;
        const delay = attempts[i];
        if (delay) await new Promise((r) => setTimeout(r, delay));
        try {
          const cats = await getCategories();
          if (mounted) {
            setCategories(cats || []);
            setCategoryError('');
          }
          return;
        } catch (error) {
          console.warn(`Categories fetch attempt ${i + 1} failed:`, error);
          if (i === attempts.length - 1) {
            if (mounted) {
              const errorMessage = error instanceof Error ? error.message : 'Failed to load categories';
              setCategoryError(errorMessage);
              setCategories([]);
            }
          }
        }
      }
    })();

    return () => { mounted = false; aborted = true; };
  }, []);

  const retryCategories = async () => {
    setCategoryError('');
    try {
      const cats = await getCategories();
      setCategories(cats || []);
    } catch (e) {
      setCategoryError(e instanceof Error ? e.message : String(e));
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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#dc143c] focus:ring-[#dc143c] sm:text-sm"
            required
          />
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
            onChange={(e) =>
              setFormData({ ...formData, excerpt: e.target.value })
            }
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#dc143c] focus:ring-[#dc143c] sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category <span className="text-[#dc143c]">*</span>
          </label>
          <select
            id="category"
            value={formData.category_id}
            onChange={(e) =>
              setFormData({ ...formData, category_id: e.target.value })
            }
            className={`mt-1 block w-full rounded-md border ${
              categoryError ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 focus:border-[#dc143c] focus:ring-[#dc143c] sm:text-sm`}
            required
            disabled={categoryError !== ''}
          >
            <option value="">
              {categoryError ? 'Categories unavailable' : 'Select a category'}
            </option>
            {categories.map((category: ArticleCategory) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {categoryError && (
            <p className="mt-2 text-sm text-red-600">
              {categoryError}
              <button
                onClick={(e) => { e.preventDefault(); retryCategories(); }}
                className="ml-2 text-[#dc143c] hover:underline"
              >
                Retry
              </button>
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="featured_image"
            className="block text-sm font-medium text-gray-700"
          >
            Featured Image
          </label>
          <div className="mt-1 flex items-center gap-4">
            <input
              type="file"
              id="featured_image"
              accept="image/jpeg,image/png,image/gif"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="block text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-[#dc143c] file:text-white
                hover:file:bg-[#b01031]
              "
            />
            {imagePreview && (
              <div className="relative w-20 h-20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            )}
          </div>
          {uploadError && (
            <p className="mt-1 text-sm text-red-600">{uploadError}</p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Content <span className="text-[#dc143c]">*</span>
            </label>
            <button
              type="button"
              onClick={generateWithAI}
              disabled={isGenerating || !formData.title.trim()}
              className="px-3 py-1 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <span className="inline-block animate-spin">✨</span>
                  Generating...
                </>
              ) : (
                <>
                  ✨ Generate with AI
                </>
              )}
            </button>
          </div>
          <TiptapEditor content={content} onChange={setContent} />
        </div>

        <div className="flex justify-between items-center">
          <Link
            href="/articles"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <div className="space-x-4">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save as Draft"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={(e) => handleSubmit(e, true)}
              className="px-4 py-2 bg-[#dc143c] text-white rounded-md hover:bg-[#b01031] disabled:opacity-50 font-semibold"
            >
              {isSubmitting ? "Publishing..." : "Publish Article"}
            </button>
          </div>
        </div>
        {uploadError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-600">
            {uploadError}
          </div>
        )}
      </form>
    </div>
  );
}
