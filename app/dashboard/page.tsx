"use client";

import { useState, useEffect } from "react";
import {
  Search,
  TrendingUp,
  Shield,
  BarChart3,
  Plus,
  Filter,
  Download,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Sparkles,
  RefreshCw,
  Bell,
  TrendingDown,
} from "lucide-react";
import VisibilityDashboard from "@/components/VisibilityDashboard";
import EnhancedVisibilityDashboard from "@/components/EnhancedVisibilityDashboard";
import AlertsDashboard from "@/components/AlertsDashboard";
import OptimizationDashboard from "@/components/OptimizationDashboard";
import OverviewDashboard from "@/components/OverviewDashboard";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    setLastUpdated(new Date());
  };

  // Mock data for demonstration
  const mockData = {
    visibility: {
      totalCitations: 1247,
      weeklyChange: 12.5,
      topPages: [
        { url: "/products/ai-tool", citations: 89, change: 15.2 },
        { url: "/blog/geo-guide", citations: 67, change: -3.1 },
        { url: "/pricing", citations: 45, change: 8.7 },
        { url: "/features", citations: 34, change: 22.1 },
        { url: "/about", citations: 23, change: -1.2 },
      ],
    },
    alerts: [
      {
        id: 1,
        type: "misinformation",
        severity: "high",
        message: "AI engine incorrectly states pricing as $99/month",
        source: "ChatGPT",
        time: "2 hours ago",
      },
      {
        id: 2,
        type: "citation",
        severity: "medium",
        message: "Competitor cited instead of your product page",
        source: "Perplexity",
        time: "5 hours ago",
      },
      {
        id: 3,
        type: "optimization",
        severity: "low",
        message: "New optimization suggestion available",
        source: "System",
        time: "1 day ago",
      },
    ],
    suggestions: [
      {
        id: 1,
        page: "/products/ai-tool",
        suggestion: "Add FAQ section about pricing",
        impact: "high",
        status: "pending",
      },
      {
        id: 2,
        page: "/blog/geo-guide",
        suggestion: "Include schema markup for better visibility",
        impact: "medium",
        status: "completed",
      },
      {
        id: 3,
        page: "/pricing",
        suggestion: "Add canonical sentence about enterprise features",
        impact: "high",
        status: "pending",
      },
    ],
  };

  const tabs = [
    { id: "overview", label: "Zudio Overview", icon: BarChart3 },
    { id: "visibility", label: "Visibility vs Competitors", icon: Eye },
    { id: "optimization", label: "Content Optimization", icon: Target },
    { id: "alerts", label: "Brand Alerts", icon: Shield },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center group hover:scale-110 transition-transform duration-300">
                <Search className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-xl font-semibold text-gray-900">
                    GEO Dashboard
                  </h1>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-primary-50 border border-primary-200 rounded-full">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="text-sm font-medium text-primary-700">
                      Zudio
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-sm text-gray-500">Live monitoring</p>
                  </div>
                  <span className="text-gray-300">•</span>
                  <p className="text-sm text-gray-500">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-primary-300 transition-colors"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-primary-600 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </button>
              <button className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 group">
                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Add Domain
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200 min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {tabs.map((tab, index) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 group ${
                      activeTab === tab.id
                        ? "bg-primary-100 text-primary-700 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <tab.icon
                      className={`w-5 h-5 mr-3 transition-transform duration-300 ${
                        activeTab === tab.id
                          ? "scale-110"
                          : "group-hover:scale-105"
                      }`}
                    />
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && <OverviewDashboard />}

          {activeTab === "visibility" && <EnhancedVisibilityDashboard />}

          {activeTab === "optimization" && <OptimizationDashboard />}

          {activeTab === "alerts" && <AlertsDashboard />}
        </main>
      </div>
    </div>
  );
}
