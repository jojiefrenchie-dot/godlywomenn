"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface Article {
  id: string;
  title: string;
  excerpt?: string;
  slug?: string;
  content?: string;
}

const stories = [
  {
    title: "The Story of Sarah Edwards",
    preview: "A life marked by intellectual rigor and deep spiritual devotion",
    slug: "sarah-edwards",
  },
  {
    title: "Mary Slessor's Journey",
    preview: "Breaking ground as a missionary in 19th century Africa",
    slug: "mary-slessor",
  },
  {
    title: "Susanna Wesley's Legacy",
    preview: "The mother who shaped methodism through her teaching",
    slug: "susanna-wesley",
  },
];

const profiles = [
  {
    name: "Winnie Adoma",
    title: "Founder",
    preview: "A visionary leader dedicated to empowering women in business and fostering spiritual growth across communities",
  },
  {
    name: "Hellen Ojwang",
    title: "Esteemed Member",
    preview: "An accomplished professional whose grace, wisdom, and service inspire many to pursue their calling with integrity",
  },
  {
    name: "Madam Harriet",
    title: "Community Champion",
    preview: "A beacon of hope and encouragement whose generosity and faith have transformed countless lives",
  },
];

export default function Home() {
  const { data: session } = useSession();
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setArticlesError(null);
        const djangoApi = process.env.NEXT_PUBLIC_DJANGO_API || 'http://localhost:8000';
        console.log('Fetching from:', djangoApi);
        
        const res = await fetch(`${djangoApi}/api/articles/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include'
        });
        
        console.log('Response status:', res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log('Articles data:', data);
          const allArticles = Array.isArray(data) ? data : data.results || [];
          console.log('Processed articles:', allArticles);
          // Slice to exactly 3 articles
          setArticles(allArticles.slice(0, 3));
        } else {
          const errorMsg = `Failed to fetch articles: ${res.status} ${res.statusText}`;
          console.error(errorMsg);
          setArticlesError(errorMsg);
        }
      } catch (err) {
        const errorMsg = `Error fetching articles: ${err instanceof Error ? err.message : String(err)}`;
        console.error(errorMsg);
        setArticlesError(errorMsg);
      } finally {
        setArticlesLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const displayStories = articles.length > 0 ? articles.map(a => ({
    title: a.title,
    preview: a.excerpt || 'An inspiring story of faith and devotion',
    slug: a.slug,
  })) : stories;

  return (
    <div suppressHydrationWarning className="min-h-screen bg-white">
      {/* Hero Section */}
      <div suppressHydrationWarning className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div suppressHydrationWarning className="pt-20 pb-16 text-center relative">
          {/* Decorative Elements */}
          <div suppressHydrationWarning className="absolute top-0 right-0 w-1/3 h-1/3">
            <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-gradient-to-r from-[#f7cac9] to-[#fdebd0] opacity-20" />
            <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-gradient-to-r from-[#dc143c] to-[#f75270] opacity-10" />
          </div>

          {/* Main Content */}
          <div suppressHydrationWarning className="mb-8">
            <Image src="/logo.png" alt="GodlyWomen Logo" width={120} height={120} className="mx-auto mb-8" />
          </div>
          <h1 className="text-[4rem] sm:text-[5rem] leading-none tracking-tight mb-6 font-serif text-[#dc143c]">
            Godly Women in<br />the Marketplace
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto mb-12">
            Daniel 11:32 &quot;but the people who know their God shall be strong, and carry out great exploits&quot;
          </p>
          {!session?.user && (
            <div className="flex gap-4 justify-center z-10 relative">
              <Link 
                href="/register"
                className="inline-flex h-12 items-center px-8 justify-center rounded-lg bg-[#dc143c] text-white text-lg font-medium transition-all hover:bg-[#f75270] cursor-pointer"
              >
                Get Started
              </Link>
              <Link 
                href="/login"
                className="inline-flex h-12 items-center px-8 justify-center rounded-lg border-2 border-[#dc143c] text-[#dc143c] text-lg font-medium transition-all hover:bg-[#fdebd0] cursor-pointer"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Featured Section */}
        <div suppressHydrationWarning className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 pb-24">
          <div suppressHydrationWarning>
            <h2 className="text-2xl font-serif mb-4 text-gray-900">Latest Stories</h2>
            <div suppressHydrationWarning className="space-y-8">
              {displayStories.map((story, i) => (
                <Link href={`/articles/${story.slug || story.title.toLowerCase().replace(/\s+/g, '-')}`} key={i} className="block group">
                  <article className="flex gap-6 items-start">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#f7cac9] to-[#fdebd0] flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-lg group-hover:text-[#dc143c] transition-colors">
                        {story.title}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {story.preview}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-serif mb-4 text-gray-900">Featured Profiles</h2>
            <div className="space-y-8">
              {profiles.map((profile, i) => {
                const profileUrls: {[key: string]: string} = {
                  'Winnie Adoma': '/profiles/winnie',
                  'Hellen Ojwang': '/profiles/hellen',
                  'Madam Harriet': '/profiles/harriet',
                };
                const href = profileUrls[profile.name] || `/profiles/${i + 1}`;
                return (
                  <Link href={href} key={i} className="block group">
                    <article className="flex gap-6 items-start">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#dc143c] to-[#f75270] flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-lg group-hover:text-[#dc143c] transition-colors">
                          {profile.name}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {profile.preview}
                        </p>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}