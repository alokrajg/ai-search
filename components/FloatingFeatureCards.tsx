"use client";

import { useState, useEffect } from "react";
import {
  Search,
  TrendingUp,
  Shield,
  BarChart3,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

export default function FloatingFeatureCards() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Search,
      title: "AI Visibility Monitoring",
      description: "Track citations across ChatGPT, Perplexity, and more",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      delay: "0ms",
      position: "top-0 left-0",
    },
    {
      icon: TrendingUp,
      title: "Content Optimization",
      description: "Get actionable suggestions to improve AI visibility",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      delay: "200ms",
      position: "top-8 right-0",
    },
    {
      icon: Shield,
      title: "Brand Protection",
      description: "Monitor for misinformation and brand misrepresentation",
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100",
      delay: "400ms",
      position: "bottom-8 left-8",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights and performance metrics",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      delay: "600ms",
      position: "bottom-0 right-8",
    },
  ];

  return (
    <div className="relative w-full h-96 overflow-hidden">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`absolute ${
            feature.position
          } transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          } ${hoveredCard === index ? "scale-110 z-20" : "scale-100 z-10"}`}
          style={{ animationDelay: feature.delay }}
          onMouseEnter={() => setHoveredCard(index)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div
            className={`relative w-64 p-6 bg-gradient-to-br ${feature.bgColor} rounded-2xl border border-white/50 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300`}
          >
            {/* Floating sparkles */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse" />

            {/* Icon */}
            <div
              className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
            >
              <feature.icon className="w-6 h-6 text-white" />
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{feature.description}</p>

            {/* Learn more link */}
            <div className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              <span>Learn more</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Hover effect overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 hover:opacity-10 rounded-2xl transition-opacity duration-300`}
            />
          </div>
        </div>
      ))}

      {/* Central floating element */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-spin-slow shadow-2xl">
          <Zap className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
}
