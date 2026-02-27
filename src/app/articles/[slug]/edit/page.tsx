'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'http://localhost:8000';

export default function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  type ArticleShape = { id: string | number; title?: string; content?: string } | null;
  const [article, setArticle] = useState<ArticleShape>(null);
  // keep title/content state at top-level to obey hooks rules
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${DJANGO_API}/api/articles/?slug=${encodeURIComponent(slug)}`);
        if (!res.ok) {
          console.error('Error loading article for edit', res.status);
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (mounted) {
          setArticle(data);
          setTitle(data?.title || "");
          setContent(data?.content || "");
        }
      } catch (e) {
        console.error('Error loading article for edit:', e);
      }
      setLoading(false);
    })();
    return () => { mounted = false; }
  }, [slug]);

  const handleDelete = async () => {
    if (!confirm('Delete this article?')) return;
    if (!article) return;
    const res = await fetch(`/api/articles/${article.id}`, { method: 'DELETE' });
    if (res.ok) router.push('/articles');
    else console.error('Failed to delete article');
  };

  if (loading) return <div>Loading...</div>;
  if (!article) return <div>Article not found</div>;

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });
      if (!res.ok) {
        console.error('Failed to update article');
        return;
      }
      const updated = await res.json();
      router.push(`/articles/${updated.slug}`);
    } catch (e) {
      console.error('Error updating article:', e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-16">
      <h1 className="text-2xl font-semibold mb-4">Edit Article</h1>
      <div className="mb-4">
        <label className="block mb-1">Title</label>
        <input className="w-full border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Content</label>
        <textarea className="w-full border px-3 py-2 min-h-[200px]" value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <button onClick={() => router.back()} className="px-4 py-2 border rounded">Cancel</button>
        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
        <button onClick={handleSave} className="px-4 py-2 bg-[#dc143c] text-white rounded">Save</button>
      </div>
    </div>
  );
}
