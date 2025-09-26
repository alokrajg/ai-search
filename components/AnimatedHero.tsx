"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  Play,
  Star,
  Sparkles,
  TrendingUp,
  Users,
  Globe,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function AnimatedHero() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeStat, setActiveStat] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "AI Engines Monitored", value: "12+", icon: Globe },
    { label: "Citation Accuracy", value: "99.2%", icon: TrendingUp },
    { label: "Response Time", value: "< 5min", icon: Zap },
    { label: "Customer Satisfaction", value: "4.9/5", icon: Users },
  ];

  return (
    <section className="relative px-6 py-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-float" />
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto text-center relative z-10 px-4">
        <div className="mb-8">
          <div
            className={`transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 mb-6 hover:shadow-lg transition-all duration-300 group">
              <Star className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Trusted by 500+ companies worldwide
              <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
            </span>
          </div>

          <div
            className={`transform transition-all duration-1000 delay-200 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
              Monitor Your Brand's
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                {" "}
                AI Visibility
              </span>
            </h1>
          </div>

          <div
            className={`transform transition-all duration-1000 delay-400 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <p className="text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              Track citations, optimize content, and protect your brand across
              AI search engines. Get actionable insights to improve your
              Generative Engine Optimization (GEO) strategy.
            </p>
          </div>
        </div>

        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transform transition-all duration-1000 delay-600 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-semibold text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <Play className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:scale-110 relative z-10" />
            <span className="relative z-10">Try Playground</span>
            <ArrowRight
              className={`w-6 h-6 ml-3 transition-transform duration-300 relative z-10 ${
                isHovered ? "translate-x-1" : ""
              }`}
            />
          </Link>

          <button className="group relative px-10 py-5 text-xl font-semibold text-gray-700 bg-white/80 backdrop-blur-sm rounded-full border-2 border-gray-200 hover:border-blue-300 hover:bg-white transition-all duration-300 transform hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center">
              <Sparkles className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
              Watch Demo
            </span>
          </button>
        </div>

        {/* Animated Stats */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto transform transition-all duration-1000 delay-800 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center group cursor-pointer transition-all duration-500 ${
                activeStat === index ? "scale-110" : "scale-100"
              }`}
              onClick={() => setActiveStat(index)}
            >
              <div className="relative">
                <div
                  className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
                    activeStat === index
                      ? "text-blue-600"
                      : "text-gray-900 group-hover:text-blue-600"
                  }`}
                >
                  {stat.value}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 rounded-lg blur-sm transition-opacity duration-300" />
                <div
                  className={`absolute -top-2 -right-2 transition-all duration-300 ${
                    activeStat === index
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-0"
                  }`}
                >
                  <stat.icon className="w-6 h-6 text-blue-500 animate-bounce" />
                </div>
              </div>
              <div className="text-lg text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
