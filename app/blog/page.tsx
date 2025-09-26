"use client";

import React from "react";
import Link from "next/link";
import { Search, ArrowRight, Calendar, User, Tag, Clock } from "lucide-react";

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title:
        "The Future of AI Search: How Generative Engine Optimization is Changing SEO",
      excerpt:
        "Discover how GEO is revolutionizing search optimization and what it means for your brand's visibility across AI platforms.",
      author: "Alok Raj Gupta",
      date: "2025-01-15",
      readTime: "8 min read",
      category: "GEO Strategy",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop&crop=center",
      featured: true,
    },
    {
      id: 2,
      title:
        "ChatGPT vs Perplexity: Understanding Different AI Search Behaviors",
      excerpt:
        "A comprehensive analysis of how different AI engines process and surface content, and how to optimize for each.",
      author: "Pooja Verma",
      date: "2025-01-12",
      readTime: "6 min read",
      category: "AI Platforms",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop&crop=center",
      featured: false,
    },
    {
      id: 3,
      title: "5 Essential Metrics for Measuring Your AI Visibility Success",
      excerpt:
        "Learn the key performance indicators that matter most when tracking your brand's presence across AI search engines.",
      author: "Alok Raj Gupta",
      date: "2025-01-10",
      readTime: "5 min read",
      category: "Analytics",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop&crop=center",
      featured: false,
    },
    {
      id: 4,
      title: "Brand Protection in the Age of AI: Preventing Misinformation",
      excerpt:
        "How to monitor and protect your brand reputation when AI engines may misrepresent your products or services.",
      author: "Pooja Verma",
      date: "2025-01-08",
      readTime: "7 min read",
      category: "Brand Protection",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=300&fit=crop&crop=center",
      featured: false,
    },
    {
      id: 5,
      title: "Content Optimization for AI: Writing for Machines and Humans",
      excerpt:
        "Best practices for creating content that performs well across both traditional search and AI-powered platforms.",
      author: "Alok Raj Gupta",
      date: "2025-01-05",
      readTime: "9 min read",
      category: "Content Strategy",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop&crop=center",
      featured: false,
    },
    {
      id: 6,
      title: "The Rise of Claude and Gemini: New Players in AI Search",
      excerpt:
        "Exploring the growing influence of Anthropic's Claude and Google's Gemini in the AI search landscape.",
      author: "Pooja Verma",
      date: "2025-01-03",
      readTime: "6 min read",
      category: "AI Platforms",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop&crop=center",
      featured: false,
    },
  ];

  const categories = [
    "All",
    "GEO Strategy",
    "AI Platforms",
    "Analytics",
    "Brand Protection",
    "Content Strategy",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 backdrop-blur-md bg-white/90 border-b border-white/20 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Search className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
              GEO Search
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6 mr-6">
              <a
                href="/#features"
                className="text-lg text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium relative group"
              >
                <span className="relative z-10">Features</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
              </a>
              <a
                href="/#pricing"
                className="text-lg text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium relative group"
              >
                <span className="relative z-10">Pricing</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
              </a>
              <Link
                href="/blog"
                className="text-lg text-blue-600 hover:text-blue-700 transition-all duration-300 font-medium relative group"
              >
                <span className="relative z-10">Blog</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
              </Link>
              <Link
                href="/about"
                className="text-lg text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium relative group"
              >
                <span className="relative z-10">About</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
              </Link>
              <a
                href="/#faq"
                className="text-lg text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium relative group"
              >
                <span className="relative z-10">FAQ</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
              </a>
            </div>
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 mb-8">
            <Tag className="w-5 h-5 text-blue-600 mr-3" />
            <span className="text-base font-medium text-blue-800">
              GEO Search Blog
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Insights on{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              AI Search & GEO
            </span>
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Stay ahead of the curve with the latest insights, strategies, and
            trends in Generative Engine Optimization.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-8 mb-12">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                category === "All"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Post */}
      <div className="max-w-7xl mx-auto px-8 mb-16">
        {blogPosts
          .filter((post) => post.featured)
          .map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="h-64 md:h-full relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <Search className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">
                          Featured Article
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 p-8 md:p-12">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">Featured</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium group">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-8 pb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Latest Articles
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts
            .filter((post) => !post.featured)
            .map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-white/90 text-gray-800 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Read →
                    </button>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 py-16">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with GEO Insights
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get the latest articles and insights delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full border-0 focus:ring-2 focus:ring-white/50 focus:outline-none"
            />
            <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="max-w-[1400px] mx-auto relative z-10">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Search className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  GEO Search
                </span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                The leading platform for monitoring and optimizing your brand's
                visibility across all major AI search engines.
              </p>
              <div className="flex space-x-4 mt-6">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold text-white">T</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold text-white">L</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold text-white">F</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Product</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/#features"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="/#pricing"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    API
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                © 2024 GEO Search Platform. All rights reserved.
              </p>
              <div className="flex space-x-8 text-sm">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
