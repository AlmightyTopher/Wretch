"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getBlogPosts } from "../../services/blogService";

type Blog = {
  id: string;
  title: string;
  content: string;
  slug: string;
  imageUrl?: string;
  // Add other optional fields here (author, publishedAt, tags, etc.)
};

export default function BlogIndexPage() {
  const [blogPosts, setBlogPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const posts = await getBlogPosts();
        setBlogPosts(posts);
      } catch (err: any) {
        console.error("Error fetching blog posts:", err);
        setError("Failed to load blog posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) {
    return (
      <section className="relative flex flex-col items-center justify-center min-h-[80vh] w-full overflow-hidden p-4">
        <p>Loading blog posts...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative flex flex-col items-center justify-center min-h-[80vh] w-full overflow-hidden p-4">
        <p style={{ color: 'red' }}>{error}</p>
      </section>
    );
  }

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[80vh] w-full overflow-hidden p-4">
      <div className="text-center max-w-3xl mx-auto z-10 mb-10">
        <h1
          className="glitch-header glitch font-header text-5xl md:text-7xl mb-7 neon leading-tight tracking-[0.11em]"
          style={{ color: "#3A7CA5" }}
        >
          Blog
        </h1>
      </div>
      <div className="w-full max-w-6xl mx-auto grid gap-8 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
        {blogPosts.length === 0 ? (
          <p>No blog posts found.</p>
        ) : (
          blogPosts.map((post) => (
            <Link
              className="group block bg-matte-black/80 rounded-xl shadow-lg p-6 flex flex-col gap-4 hover:scale-[1.03] hover:shadow-2xl transition-transform border border-acid-magenta/30 hover:border-acid-magenta"
              style={{ textDecoration: "none" }}
            > {/* TODO: Replace <img> with next/image for optimized rendering */}
              <div className="w-full aspect-[3/2] bg-gradient-to-br from-matte-black to-electric-purple rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl} // TODO: Replace with next/image
                    alt={post.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <span className="text-5xl text-acid-magenta">📝</span>
                )}
              </div>
              <h2 className="text-2xl font-header text-acid-magenta mb-1">
                {post.title}
              </h2>
              {/* TODO: Display content snippet or description if available in Firestore */}
              {/* Using first 150 characters as a snippet placeholder */}
              <div className="text-white/80 mb-2">
                {/* Display content snippet */}
                {post.content ? `${post.content.substring(0, 150)}...` : ''}
              </div>
              {/* TODO: Add tags, author, and date if available in Firestore data structure */}
            </Link>
          ))
        )}
      </div>
    </section>
  );