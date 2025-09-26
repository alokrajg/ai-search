"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  TrendingUp,
  Shield,
  BarChart3,
  ArrowRight,
  Check,
  Zap,
  Target,
  Activity,
  Sparkles,
  Globe,
  Eye,
} from "lucide-react";
import AIPlatformLogo from "./AIPlatformLogo";

export default function DetailedFeatures() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      id: 0,
      icon: Search,
      title: "AI Visibility",
      shortDesc: "Track citations across AI platforms",
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      metrics: ["12+", "99.2%", "<5min"],
      labels: ["Platforms", "Accuracy", "Speed"],
    },
    {
      id: 1,
      icon: TrendingUp,
      title: "Content Optimization",
      shortDesc: "AI-powered recommendations",
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      metrics: ["50+", "85%", "+40%"],
      labels: ["Suggestions", "Success", "Improvement"],
    },
    {
      id: 2,
      icon: Shield,
      title: "Brand Protection",
      shortDesc: "Real-time alerts & monitoring",
      color: "red",
      gradient: "from-red-500 to-red-600",
      bgGradient: "from-red-50 to-red-100",
      metrics: ["98%", "<2min", "99.5%"],
      labels: ["Resolved", "Response", "Accuracy"],
    },
    {
      id: 3,
      icon: BarChart3,
      title: "Analytics Dashboard",
      shortDesc: "Comprehensive insights",
      color: "green",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
      metrics: ["10M+", "99.8%", "Live"],
      labels: ["Data Points", "Accuracy", "Updates"],
    },
  ];

  const aiPlatforms = [
    { name: "ChatGPT", initial: "C" },
    { name: "Perplexity", initial: "P" },
    { name: "Google AI", initial: "G" },
    { name: "Gemini", initial: "G" },
    { name: "Claude", initial: "C" },
    { name: "Copilot", initial: "C" },
  ];

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[1400px] mx-auto px-4 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.02}px`,
            top: `${mousePosition.y * 0.02}px`,
            transition: "all 0.3s ease-out",
          }}
        />
        <div
          className="absolute w-64 h-64 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse"
          style={{
            right: `${mousePosition.x * 0.01}px`,
            bottom: `${mousePosition.y * 0.01}px`,
            transition: "all 0.4s ease-out",
            animationDelay: "1s",
          }}
        />
      </div>

      {/* Header */}
      <div className="text-center mb-20 relative z-10">
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 mb-8 animate-bounce">
          <Sparkles className="w-5 h-5 text-blue-600 mr-3 animate-spin" />
          <span className="text-base font-medium text-blue-800">
            GEO Search Features
          </span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
          Everything You Need for{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
            GEO Success
          </span>
        </h2>
        <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed animate-slide-up">
          Monitor, optimize, and protect your brand across all major AI search
          engines.
        </p>
      </div>

      {/* AI Platforms Section */}
      <div className="text-center mb-16 relative z-10">
        <p className="text-lg text-gray-600 mb-8 animate-fade-in">
          GEO Search supports today's top AI platforms — and tomorrow's.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6">
          {aiPlatforms.map((platform, index) => (
            <div
              key={index}
              className="group flex items-center space-x-3 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:scale-110 animate-float"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <AIPlatformLogo platform={platform.name} size={20} />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                {platform.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Central Animated Element */}
      <div className="flex justify-center mb-16 relative z-10">
        <div className="relative">
          <div className="w-40 h-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse-glow">
            {React.createElement(features[activeFeature].icon, {
              className: "w-20 h-20 text-white animate-spin-slow",
            })}
          </div>
          {/* Floating particles */}
          <div className="absolute -top-6 -right-6 w-6 h-6 bg-blue-400 rounded-full animate-bounce" />
          <div
            className="absolute -bottom-6 -left-6 w-4 h-4 bg-purple-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.5s" }}
          />
          <div className="absolute top-1/2 -left-10 w-3 h-3 bg-pink-400 rounded-full animate-ping" />
          <div
            className="absolute top-1/2 -right-10 w-3 h-3 bg-green-400 rounded-full animate-ping"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 relative z-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`group relative cursor-pointer transition-all duration-500 ${
              activeFeature === index ? "scale-110 z-20" : "scale-100"
            }`}
            onClick={() => setActiveFeature(index)}
            style={{
              transform: `translate(${
                (mousePosition.x -
                  (typeof window !== "undefined" ? window.innerWidth : 1200) /
                    2) *
                0.005
              }px, ${
                (mousePosition.y -
                  (typeof window !== "undefined" ? window.innerHeight : 800) /
                    2) *
                0.005
              }px)`,
            }}
          >
            {/* Card */}
            <div
              className={`relative bg-gradient-to-br ${feature.bgGradient} rounded-3xl p-8 border-2 border-white/50 hover:border-${feature.color}-300 hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-sm`}
            >
              {/* Animated background elements */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full blur-xl animate-float" />
                <div
                  className="absolute bottom-0 left-0 w-20 h-20 bg-white rounded-full blur-xl animate-float"
                  style={{ animationDelay: "1s" }}
                />
              </div>

              {/* Icon */}
              <div
                className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}
              >
                {React.createElement(feature.icon, {
                  className: "w-8 h-8 text-white",
                })}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 text-left">
                {feature.title}
              </h3>

              {/* Short Description */}
              <p className="text-gray-700 mb-6 text-sm leading-relaxed font-medium text-left">
                {feature.shortDesc}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3">
                {feature.metrics.map((metric, metricIndex) => (
                  <div key={metricIndex} className="text-center group/metric">
                    <div
                      className={`text-2xl font-bold ${
                        feature.color === "purple"
                          ? "text-purple-600"
                          : `text-${feature.color}-600`
                      } mb-1 group-hover/metric:scale-110 transition-transform duration-300`}
                    >
                      {metric}
                    </div>
                    <div className="text-xs text-gray-500">
                      {feature.labels[metricIndex]}
                    </div>
                  </div>
                ))}
              </div>

              {/* Hover effect overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl`}
              />

              {/* Floating elements */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center relative z-10">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 backdrop-blur-sm border border-white/50">
          <h3 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in">
            Ready to optimize your AI visibility?
          </h3>
          <p className="text-gray-600 mb-8 animate-slide-up">
            Join thousands of brands already using GEO Search to monitor and
            improve their AI engine presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative px-12 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden animate-bounce-in flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              <span className="relative z-10">Start Free Trial</span>
              <ArrowRight className="w-5 h-5 ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button
              className="px-10 py-5 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-full hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-bounce-in"
              style={{ animationDelay: "0.1s" }}
            >
              View Pricing
            </button>
          </div>
        </div>
      </div>

      {/* Additional Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
      <div
        className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-ping"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-20 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-ping"
        style={{ animationDelay: "4s" }}
      />
      <div
        className="absolute bottom-40 right-1/3 w-3 h-3 bg-green-400 rounded-full animate-ping"
        style={{ animationDelay: "6s" }}
      />
    </div>
  );
}
