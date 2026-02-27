
"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
  const { user } = useAuth();
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
        <motion.div
          suppressHydrationWarning
          className="pt-20 pb-16 text-center relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Decorative Elements */}
          <div suppressHydrationWarning className="absolute top-0 right-0 w-1/3 h-1/3">
            <motion.div
              className="absolute top-10 right-10 w-24 h-24 rounded-full bg-gradient-to-r from-[#f7cac9] to-[#fdebd0] opacity-20"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.95, 1.02, 0.95], opacity: 1 }}
              transition={{ delay: 0.3, duration: 1.5, ease: "easeInOut", repeatType: "mirror", repeat: Infinity, repeatDelay: 1.5 }}
            />
            <motion.div
              className="absolute top-20 right-20 w-32 h-32 rounded-full bg-gradient-to-r from-[#dc143c] to-[#f75270] opacity-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.98, 1.05, 0.98], opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut", repeatType: "mirror", repeat: Infinity, repeatDelay: 1.8 }}
            />
          </div>

          {/* Main Content */}
          <motion.div suppressHydrationWarning className="mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ scale: [0.98, 1.03, 0.98], opacity: 1 }}
            transition={{ delay: 0.2, duration: 1.5, ease: "easeInOut", repeatType: "mirror", repeat: Infinity, repeatDelay: 2 }}
          >
            <Image src="/logo.png" alt="GodlyWomen Logo" width={120} height={120} className="mx-auto mb-8" />
          </motion.div>
          <motion.h1
            className="text-[4rem] sm:text-[5rem] leading-none tracking-tight mb-6 font-serif text-gray-900"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Godly Women in<br />Business
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            A place to discover and celebrate faithful women through history
          </motion.p>
          {!user && (
            <motion.div
              className="flex gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
            >
              <div>
                <Link 
                  href="/register"
                  className="inline-flex h-12 items-center px-8 justify-center rounded-lg bg-[#dc143c] text-white text-lg font-medium transition-all hover:bg-[#f75270] cursor-pointer"
                >
                  Get Started
                </Link>
              </div>
              <div>
                <Link 
                  href="/login"
                  className="inline-flex h-12 items-center px-8 justify-center rounded-lg border-2 border-[#dc143c] text-[#dc143c] text-lg font-medium transition-all hover:bg-[#fdebd0] cursor-pointer"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Featured Section */}
        <motion.div
          suppressHydrationWarning
          className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 pb-24"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          <motion.div
            suppressHydrationWarning
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <h2 className="text-2xl font-serif mb-4 text-gray-900">Latest Stories</h2>
            <div suppressHydrationWarning className="space-y-8">
              {displayStories.map((story, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                >
                  <Link href={`/articles/${story.slug || story.title.toLowerCase().replace(/\s+/g, '-')}`} className="block group">
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
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
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
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                  >
                    <Link href={href} className="block group">
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
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}