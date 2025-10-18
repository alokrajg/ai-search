"use client";

import { useState, useEffect } from "react";
import {
  Target,
  Zap,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Filter,
  Download,
  ExternalLink,
  Lightbulb,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";
import { apiService, type Brand } from "@/lib/api";

interface OptimizationDashboardProps {
  selectedBrandId?: string;
}

interface OptimizationSuggestion {
  id: string;
  page: string;
  suggestion: string;
  impact: "high" | "medium" | "low";
  status: "pending" | "completed" | "in-progress";
  category: "content" | "technical" | "structure" | "metadata";
  estimatedImprovement: number;
  difficulty: "easy" | "medium" | "hard";
  createdAt: string;
}

export default function OptimizationDashboard({
  selectedBrandId,
}: OptimizationDashboardProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<{
    impact: string;
    status: string;
    category: string;
  }>({
    impact: "all",
    status: "all",
    category: "all",
  });

  // Mock data for demonstration
  const mockSuggestions: OptimizationSuggestion[] = [
    {
      id: "1",
      page: "/products/ai-tool",
      suggestion:
        "Add FAQ section about pricing and features to improve AI engine understanding",
      impact: "high",
      status: "pending",
      category: "content",
      estimatedImprovement: 25,
      difficulty: "medium",
      createdAt: "2025-01-15T10:30:00Z",
    },
    {
      id: "2",
      page: "/blog/geo-guide",
      suggestion:
        "Include schema markup for better visibility in AI search results",
      impact: "medium",
      status: "completed",
      category: "technical",
      estimatedImprovement: 15,
      difficulty: "easy",
      createdAt: "2025-01-14T14:20:00Z",
    },
    {
      id: "3",
      page: "/pricing",
      suggestion:
        "Add canonical sentence about enterprise features for better AI comprehension",
      impact: "high",
      status: "in-progress",
      category: "content",
      estimatedImprovement: 30,
      difficulty: "easy",
      createdAt: "2025-01-13T09:15:00Z",
    },
    {
      id: "4",
      page: "/features",
      suggestion:
        "Optimize page structure with clear headings and bullet points",
      impact: "medium",
      status: "pending",
      category: "structure",
      estimatedImprovement: 18,
      difficulty: "medium",
      createdAt: "2025-01-12T16:45:00Z",
    },
    {
      id: "5",
      page: "/about",
      suggestion:
        "Add meta descriptions and title tags optimized for AI search engines",
      impact: "low",
      status: "pending",
      category: "metadata",
      estimatedImprovement: 12,
      difficulty: "easy",
      createdAt: "2025-01-11T11:30:00Z",
    },
  ];

  // Load brands on component mount
  useEffect(() => {
    loadBrands();
  }, []);

  // Load suggestions when brand changes
  useEffect(() => {
    if (selectedBrand || selectedBrandId) {
      loadSuggestions();
    }
  }, [selectedBrand, selectedBrandId]);

  const loadBrands = async () => {
    try {
      const brandsData = await apiService.getBrands();
      setBrands(brandsData);

      // Auto-select first brand or specified brand
      if (brandsData.length > 0) {
        const brand = selectedBrandId
          ? brandsData.find((b) => b.id === selectedBrandId) || brandsData[0]
          : brandsData[0];
        setSelectedBrand(brand);
      }
    } catch (err) {
      console.error("Failed to load brands:", err);
      setError("Failed to load brands");
    }
  };

  const loadSuggestions = async () => {
    if (!selectedBrand) return;

    setIsLoading(true);
    setError(null);

    try {
      // For now, use mock data. In production, this would call the backend API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setSuggestions(mockSuggestions);
    } catch (err) {
      console.error("Failed to load suggestions:", err);
      setError("Failed to load optimization suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadSuggestions();
    setIsRefreshing(false);
  };

  const handleBrandChange = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    setSelectedBrand(brand || null);
  };

  const handleApplySuggestion = async (suggestionId: string) => {
    try {
      // Update suggestion status to in-progress
      setSuggestions(
        suggestions.map((s) =>
          s.id === suggestionId ? { ...s, status: "in-progress" } : s
        )
      );

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update to completed
      setSuggestions(
        suggestions.map((s) =>
          s.id === suggestionId ? { ...s, status: "completed" } : s
        )
      );
    } catch (err) {
      console.error("Failed to apply suggestion:", err);
      // Revert status
      setSuggestions(
        suggestions.map((s) =>
          s.id === suggestionId ? { ...s, status: "pending" } : s
        )
      );
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600 bg-red-100 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-100 border-green-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "in-progress":
        return "text-blue-600 bg-blue-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "in-progress":
        return <Clock className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "content":
        return <Lightbulb className="w-4 h-4" />;
      case "technical":
        return <Zap className="w-4 h-4" />;
      case "structure":
        return <BarChart3 className="w-4 h-4" />;
      case "metadata":
        return <Target className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "hard":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Filter suggestions based on current filter settings
  const filteredSuggestions = suggestions.filter((suggestion) => {
    if (filter.impact !== "all" && suggestion.impact !== filter.impact)
      return false;
    if (filter.status !== "all" && suggestion.status !== filter.status)
      return false;
    if (filter.category !== "all" && suggestion.category !== filter.category)
      return false;
    return true;
  });

  const suggestionStats = {
    total: suggestions.length,
    pending: suggestions.filter((s) => s.status === "pending").length,
    inProgress: suggestions.filter((s) => s.status === "in-progress").length,
    completed: suggestions.filter((s) => s.status === "completed").length,
    highImpact: suggestions.filter((s) => s.impact === "high").length,
    avgImprovement:
      suggestions.reduce((acc, s) => acc + s.estimatedImprovement, 0) /
      suggestions.length,
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error Loading Suggestions
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadSuggestions}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Content Optimization Suggestions
            </h2>
            <p className="text-gray-600">
              AI-powered recommendations to improve your brand visibility
            </p>
          </div>
          <div className="flex items-center space-x-3">
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
              <Zap className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Generate New Suggestions
            </button>
          </div>
        </div>

        {/* Brand Selector */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Brand:</label>
          <select
            value={selectedBrand?.id || ""}
            onChange={(e) => handleBrandChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Suggestions
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {suggestionStats.total}
              </p>
            </div>
            <Target className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {suggestionStats.pending}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {suggestionStats.inProgress}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {suggestionStats.completed}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">
                Avg Improvement
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {suggestionStats.avgImprovement.toFixed(0)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filters:</label>

          <select
            value={filter.impact}
            onChange={(e) => setFilter({ ...filter, impact: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Impact Levels</option>
            <option value="high">High Impact</option>
            <option value="medium">Medium Impact</option>
            <option value="low">Low Impact</option>
          </select>

          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Categories</option>
            <option value="content">Content</option>
            <option value="technical">Technical</option>
            <option value="structure">Structure</option>
            <option value="metadata">Metadata</option>
          </select>
        </div>
      </div>

      {/* Suggestions List */}
      {isLoading ? (
        <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading optimization suggestions...</p>
        </div>
      ) : filteredSuggestions.length > 0 ? (
        <div className="space-y-4">
          {filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary-300 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
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
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        suggestion.status
                      )}`}
                    >
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(suggestion.status)}
                        <span className="capitalize">
                          {suggestion.status.replace("-", " ")}
                        </span>
                      </div>
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                        suggestion.difficulty
                      )}`}
                    >
                      {suggestion.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {suggestion.suggestion}
                  </p>

                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(suggestion.category)}
                      <span className="text-sm text-gray-500 capitalize">
                        {suggestion.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        +{suggestion.estimatedImprovement}% improvement
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {new Date(suggestion.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {suggestion.status === "pending" && (
                      <button
                        onClick={() => handleApplySuggestion(suggestion.id)}
                        className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        Apply Suggestion
                      </button>
                    )}
                    {suggestion.status === "in-progress" && (
                      <button
                        disabled
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg opacity-50 cursor-not-allowed"
                      >
                        In Progress...
                      </button>
                    )}
                    {suggestion.status === "completed" && (
                      <button
                        disabled
                        className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg opacity-50 cursor-not-allowed"
                      >
                        Completed
                      </button>
                    )}
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                      <ExternalLink className="w-4 h-4 inline mr-1" />
                      View Page
                    </button>
                  </div>
                </div>

                <div className="ml-4">
                  {suggestion.status === "completed" ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : suggestion.status === "in-progress" ? (
                    <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  ) : (
                    <Clock className="w-6 h-6 text-yellow-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Suggestions Found
          </h3>
          <p className="text-gray-600 mb-4">
            {filter.impact !== "all" ||
            filter.status !== "all" ||
            filter.category !== "all"
              ? "No suggestions match your current filters."
              : "No optimization suggestions found for the selected brand."}
          </p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Generate New Suggestions
          </button>
        </div>
      )}
    </div>
  );
}
