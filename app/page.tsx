"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  Search,
  TrendingUp,
  Shield,
  BarChart3,
  Play,
  Star,
  Sparkles,
  Zap,
  Globe,
} from "lucide-react";
import Link from "next/link";
import AnimatedHero from "@/components/AnimatedHero";
import DashboardMockup from "@/components/DashboardMockup";
import PricingCards from "@/components/PricingCards";
import FAQ from "@/components/FAQ";
import DetailedFeatures from "@/components/DetailedFeatures";

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Search,
      title: "AI Visibility & Citation Monitoring",
      description:
        "Track when and where AI engines surface your content with real-time monitoring across multiple platforms.",
      color: "from-primary-500 to-primary-600",
    },
    {
      icon: TrendingUp,
      title: "Content Optimization Suggestions",
      description:
        "Get actionable rewrites and optimizations to increase your chances of being cited by AI engines.",
      color: "from-secondary-500 to-secondary-600",
    },
    {
      icon: Shield,
      title: "Brand & Misinformation Alerts",
      description:
        "Protect your brand with instant alerts when AI engines misrepresent your products or services.",
      color: "from-accent-500 to-accent-600",
    },
    {
      icon: BarChart3,
      title: "GEO Analytics Dashboard",
      description:
        "Comprehensive analytics showing your visibility trends, top performing pages, and actionable insights.",
      color: "from-purple-500 to-purple-600",
    },
  ];

  const stats = [
    { label: "AI Engines Monitored", value: "12+" },
    { label: "Citation Accuracy", value: "99.2%" },
    { label: "Response Time", value: "< 5min" },
    { label: "Customer Satisfaction", value: "4.9/5" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 backdrop-blur-md bg-gray-900/90 border-b border-gray-700/50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Search className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300">
              GEO Search
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6 mr-6">
              <a
                href="#features"
                className="text-lg text-gray-300 hover:text-white transition-all duration-300 font-medium relative group"
              >
                <span className="relative z-10">Features</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></div>
              </a>
              <a
                href="#pricing"
                className="text-lg text-gray-300 hover:text-white transition-all duration-300 font-medium relative group"
              >
                <span className="relative z-10">Pricing</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></div>
              </a>
              <Link
                href="/blog"
                className="text-lg text-gray-300 hover:text-white transition-all duration-300 font-medium relative group"
              >
                <span className="relative z-10">Blog</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></div>
              </Link>
              <Link
                href="/about"
                className="text-lg text-gray-300 hover:text-white transition-all duration-300 font-medium relative group"
              >
                <span className="relative z-10">About</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></div>
              </Link>
              <a
                href="#faq"
                className="text-lg text-gray-300 hover:text-white transition-all duration-300 font-medium relative group"
              >
                <span className="relative z-10">FAQ</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></div>
              </a>
            </div>
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Animated Hero Section */}
      <div className="pt-24">
        <AnimatedHero />
      </div>

      {/* Dashboard Preview Section */}
      <section className="px-4 py-24 bg-gradient-to-br from-gray-800 to-gray-900 relative">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 mb-8">
              <BarChart3 className="w-5 h-5 text-orange-400 mr-3" />
              <span className="text-base font-medium text-orange-300">
                Live Dashboard Preview
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              See Your{" "}
              <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                AI Visibility
              </span>{" "}
              in Real-Time
            </h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Monitor citations, track performance, and get actionable insights
              across all major AI platforms.
            </p>
          </div>
          <DashboardMockup />
        </div>
      </section>

      {/* Detailed Features Section */}
      <section
        id="features"
        className="px-4 py-24 bg-gradient-to-br from-gray-800 to-gray-900 relative"
      >
        <DetailedFeatures />
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="px-4 py-24 bg-gradient-to-br from-gray-800 to-gray-900 relative"
      >
        <PricingCards />
      </section>

      {/* FAQ Section */}
      <section id="faq" className="px-4 py-24 bg-gray-800/50 relative">
        <FAQ />
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24 relative">
        <div className="max-w-[1400px] mx-auto text-center">
          <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-16 text-white overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />

            <div className="relative z-10">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm mb-8">
                <Globe className="w-5 h-5 mr-3" />
                <span className="text-base font-medium">
                  Join 500+ Companies
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 group-hover:scale-105 transition-transform duration-300">
                Ready to Optimize Your{" "}
                <span className="text-white/90">AI Visibility?</span>
              </h2>
              <p className="text-2xl mb-10 opacity-90 group-hover:opacity-100 transition-opacity duration-300 max-w-3xl mx-auto leading-relaxed">
                Join thousands of brands already using GEO Search to monitor and
                improve their AI engine presence.
              </p>
              <Link
                href="/dashboard"
                className="group/btn inline-flex items-center justify-center px-10 py-5 text-xl font-semibold text-orange-600 bg-white rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-orange-100 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <Play className="w-6 h-6 mr-3 relative z-10 group-hover/btn:scale-110 transition-transform duration-300" />
                <span className="relative z-10">Start Free Trial</span>
                <ArrowRight className="w-6 h-6 ml-3 relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
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
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Search className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  GEO Search
                </span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                The leading platform for monitoring and optimizing your brand's
                visibility across all major AI search engines.
              </p>
              <div className="flex space-x-4 mt-6">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold text-white">T</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold text-white">L</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
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
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
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
