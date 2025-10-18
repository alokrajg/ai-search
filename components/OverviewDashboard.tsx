"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  AlertTriangle,
  Target,
  Activity,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  BarChart3,
  CheckCircle,
  Clock,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  apiService,
  type Brand,
  type VisibilityMetrics,
  type Alert,
} from "@/lib/api";

interface OverviewDashboardProps {
  selectedBrandId?: string;
}

export default function OverviewDashboard({
  selectedBrandId,
}: OverviewDashboardProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [visibilityData, setVisibilityData] =
    useState<VisibilityMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load brands on component mount
  useEffect(() => {
    loadBrands();
  }, []);

  // Load data when brand changes
  useEffect(() => {
    if (selectedBrand || selectedBrandId) {
      loadDashboardData();
    }
  }, [selectedBrand, selectedBrandId]);

  const loadBrands = async () => {
    try {
      const brandsData = await apiService.getBrands();
      setBrands(brandsData);

      // Auto-select Zudio brand or specified brand
      if (brandsData.length > 0) {
        const brand = selectedBrandId
          ? brandsData.find((b) => b.id === selectedBrandId) || brandsData[0]
          : brandsData.find((b) => b.name.toLowerCase() === "zudio") ||
            brandsData[0];
        setSelectedBrand(brand);
      }
    } catch (err) {
      console.error("Failed to load brands:", err);
      setError("Failed to load brands");
    }
  };

  const loadDashboardData = async () => {
    if (!selectedBrand) return;

    setIsLoading(true);
    setError(null);

    try {
      // Load visibility data and alerts in parallel
      const [visibilityDataResult, alertsData] = await Promise.all([
        apiService.getVisibilityMetrics(selectedBrand.id),
        apiService.getAlerts(selectedBrand.id),
      ]);

      setVisibilityData(visibilityDataResult);
      setAlerts(alertsData);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const handleBrandChange = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    setSelectedBrand(brand || null);
  };

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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="w-4 h-4" />;
      case "medium":
        return <Clock className="w-4 h-4" />;
      case "low":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // Calculate statistics
  const stats = {
    totalCitations: visibilityData?.citations_count || 0,
    uniquePages: visibilityData?.unique_pages || 0,
    avgRelevance: visibilityData?.visibility_score || 0,
    activeAlerts: alerts.filter((a) => !a.resolved).length,
    highPriorityAlerts: alerts.filter(
      (a) => a.severity === "high" && !a.resolved
    ).length,
    totalAlerts: alerts.length,
  };

  // Mock optimization suggestions count
  const optimizationSuggestions = 5;

  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error Loading Dashboard
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadDashboardData}
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
              Zudio Dashboard Overview
            </h2>
            <p className="text-gray-600">
              Real-time insights into Zudio's AI visibility performance and
              competitive analysis
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

      {isLoading ? (
        <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:border-primary-300 transition-all duration-300 hover:shadow-xl group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                    Total Citations
                  </p>
                  <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {stats.totalCitations.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-6 h-6 text-primary-600 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">
                  No historical data available
                </span>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:border-red-300 transition-all duration-300 hover:shadow-xl group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                    Active Alerts
                  </p>
                  <p className="text-3xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    {stats.activeAlerts}
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
                    {stats.highPriorityAlerts} high priority
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
                  <p className="text-3xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                    {optimizationSuggestions}
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
                    3 pending review
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-xl group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                    Avg Relevance Score
                  </p>
                  <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {(stats.avgRelevance * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-6 h-6 text-green-600 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">
                  No historical data available
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
                {alerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`p-1 rounded-full ${getSeverityColor(
                        alert.severity
                      )}`}
                    >
                      {getSeverityIcon(alert.severity)}
                    </div>
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
                          {new Date(alert.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <div className="text-center py-4">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No recent alerts</p>
                  </div>
                )}
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
                {(visibilityData?.top_pages || [])
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
                        <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">
                          {(page.relevance_score * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                {(!visibilityData?.top_pages ||
                  visibilityData.top_pages.length === 0) && (
                  <div className="text-center py-4">
                    <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      No page data available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Engine Performance */}
          {visibilityData?.engine_breakdown && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Engine Performance
                </h3>
                <button className="text-sm text-primary-600 hover:text-primary-700">
                  View Details
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(visibilityData.engine_breakdown || {}).map(
                  ([engine, count]) => {
                    const percentage =
                      (count / (visibilityData.citations_count || 1)) * 100;
                    return (
                      <div key={engine} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {engine}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500 transition-all duration-1000 ease-out"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {count.toLocaleString()} citations
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
