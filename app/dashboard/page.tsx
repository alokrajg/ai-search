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
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "visibility", label: "Visibility", icon: Eye },
    { id: "optimization", label: "Optimization", icon: Target },
    { id: "alerts", label: "Alerts", icon: Shield },
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
                <h1 className="text-xl font-semibold text-gray-900">
                  GEO Dashboard
                </h1>
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
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:border-primary-300 transition-all duration-300 hover:shadow-xl group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                        Total Citations
                      </p>
                      <p className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {mockData.visibility.totalCitations.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Eye className="w-6 h-6 text-primary-600 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm text-green-600 font-medium">
                      +{mockData.visibility.weeklyChange}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      vs last week
                    </span>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:border-red-300 transition-all duration-300 hover:shadow-xl group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                        Active Alerts
                      </p>
                      <p className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                        {mockData.alerts.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <AlertTriangle className="w-6 h-6 text-red-600 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm text-gray-500">
                        2 high priority
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:border-yellow-300 transition-all duration-300 hover:shadow-xl group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                        Optimization Suggestions
                      </p>
                      <p className="text-2xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                        {mockData.suggestions.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-6 h-6 text-yellow-600 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-yellow-500 animate-pulse" />
                      <span className="text-sm text-gray-500">
                        2 pending review
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-xl group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                        Response Time
                      </p>
                      <p className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                        4.2m
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Activity className="w-6 h-6 text-green-600 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <ArrowDownRight className="w-4 h-4 text-green-500 mr-1 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm text-green-600 font-medium">
                      -0.8m
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      vs last week
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recent Alerts
                    </h3>
                    <button className="text-sm text-primary-600 hover:text-primary-700">
                      View all
                    </button>
                  </div>
                  <div className="space-y-3">
                    {mockData.alerts.slice(0, 3).map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            getSeverityColor(alert.severity).split(" ")[0]
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {alert.message}
                          </p>
                          <div className="flex items-center mt-1 space-x-2">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(
                                alert.severity
                              )}`}
                            >
                              {alert.severity}
                            </span>
                            <span className="text-xs text-gray-500">
                              {alert.source}
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">
                              {alert.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Top Performing Pages
                    </h3>
                    <button className="text-sm text-primary-600 hover:text-primary-700">
                      View all
                    </button>
                  </div>
                  <div className="space-y-3">
                    {mockData.visibility.topPages
                      .slice(0, 3)
                      .map((page, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {page.url}
                            </p>
                            <p className="text-xs text-gray-500">
                              {page.citations} citations
                            </p>
                          </div>
                          <div className="flex items-center">
                            {page.change > 0 ? (
                              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                            )}
                            <span
                              className={`text-sm font-medium ${
                                page.change > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {page.change > 0 ? "+" : ""}
                              {page.change}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "visibility" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    AI Visibility Monitoring
                  </h2>
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </button>
                    <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Citation Timeline
                    </h3>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">
                        Chart visualization would go here
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Engine Distribution
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">ChatGPT</span>
                        <div className="flex items-center">
                          <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
                            <div className="w-3/4 h-2 bg-primary-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            75%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Perplexity
                        </span>
                        <div className="flex items-center">
                          <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
                            <div className="w-1/2 h-2 bg-secondary-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            50%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Bing Chat</span>
                        <div className="flex items-center">
                          <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
                            <div className="w-1/3 h-2 bg-accent-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            33%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "optimization" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Content Optimization Suggestions
                  </h2>
                  <button className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                    <Zap className="w-4 h-4 mr-2" />
                    Generate New Suggestions
                  </button>
                </div>

                <div className="space-y-4">
                  {mockData.suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900">
                              {suggestion.page}
                            </h4>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getImpactColor(
                                suggestion.impact
                              )}`}
                            >
                              {suggestion.impact} impact
                            </span>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                suggestion.status === "completed"
                                  ? "text-green-600 bg-green-100"
                                  : "text-yellow-600 bg-yellow-100"
                              }`}
                            >
                              {suggestion.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">
                            {suggestion.suggestion}
                          </p>
                          <div className="flex items-center space-x-4">
                            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                              View Details
                            </button>
                            <button className="text-sm text-gray-600 hover:text-gray-700">
                              Apply Suggestion
                            </button>
                          </div>
                        </div>
                        <div className="ml-4">
                          {suggestion.status === "completed" ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Clock className="w-5 h-5 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Brand & Misinformation Alerts
                  </h2>
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </button>
                    <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                      <Settings className="w-4 h-4 mr-2" />
                      Alert Settings
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {mockData.alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full mt-1 ${
                            getSeverityColor(alert.severity).split(" ")[0]
                          }`}
                        ></div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900">
                              {alert.message}
                            </h4>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(
                                alert.severity
                              )}`}
                            >
                              {alert.severity}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <span>Source: {alert.source}</span>
                            <span>•</span>
                            <span>{alert.time}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button className="px-3 py-1 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors">
                              Take Action
                            </button>
                            <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                              Dismiss
                            </button>
                            <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
