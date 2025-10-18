"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  Filter,
  Download,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";
import {
  apiService,
  transformVisibilityData,
  type VisibilityMetrics,
  type Brand,
} from "@/lib/api";

interface VisibilityDashboardProps {
  selectedBrandId?: string;
}

export default function VisibilityDashboard({
  selectedBrandId,
}: VisibilityDashboardProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [visibilityData, setVisibilityData] =
    useState<VisibilityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("7d");

  // Load brands on component mount
  useEffect(() => {
    loadBrands();
  }, []);

  // Load visibility data when brand changes
  useEffect(() => {
    if (selectedBrand || selectedBrandId) {
      loadVisibilityData();
    }
  }, [selectedBrand, selectedBrandId]);

  const loadBrands = async () => {
    try {
      console.log("Loading brands...");
      const brandsData = await apiService.getBrands();
      console.log("Brands loaded:", brandsData);
      setBrands(brandsData);

      // Auto-select first brand or specified brand
      if (brandsData.length > 0) {
        const brand = selectedBrandId
          ? brandsData.find((b) => b.id === selectedBrandId) || brandsData[0]
          : brandsData[0];
        setSelectedBrand(brand);
        console.log("Selected brand:", brand);
      }
    } catch (err) {
      console.error("Failed to load brands:", err);
      setError("Failed to load brands");
    }
  };

  const loadVisibilityData = async () => {
    if (!selectedBrand) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log("Loading visibility data for brand:", selectedBrand.id);
      const data = await apiService.getVisibilityMetrics(selectedBrand.id);
      console.log("Visibility data loaded:", data);
      setVisibilityData(data);
    } catch (err) {
      console.error("Failed to load visibility data:", err);
      setError("Failed to load visibility data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadVisibilityData();
    setIsRefreshing(false);
  };

  const handleBrandChange = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    setSelectedBrand(brand || null);
  };

  const getEngineColor = (engine: string) => {
    const colors: Record<string, string> = {
      perplexity: "bg-purple-500",
      chatgpt: "bg-blue-500",
      claude: "bg-orange-500",
      gemini: "bg-green-500",
      bing: "bg-yellow-500",
    };
    return colors[engine.toLowerCase()] || "bg-gray-500";
  };

  const getEngineIcon = (engine: string) => {
    // You can replace these with actual engine icons
    return <Activity className="w-4 h-4" />;
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error Loading Data
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadVisibilityData}
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
              AI Visibility Monitoring
            </h2>
            <p className="text-gray-600">
              Track your brand's visibility across AI search engines
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

          <label className="text-sm font-medium text-gray-700">
            Time Range:
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visibility data...</p>
        </div>
      ) : visibilityData ? (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary-300 transition-all duration-300 hover:shadow-xl group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                    Total Citations
                  </p>
                  <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {(visibilityData.citations_count || 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-6 h-6 text-primary-600 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm text-green-600 font-medium">
                  +12.5%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last week</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                    Unique Pages
                  </p>
                  <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {visibilityData.unique_pages || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm text-green-600 font-medium">
                  +8.2%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last week</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-xl group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                    Avg Relevance
                  </p>
                  <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {((visibilityData.visibility_score || 0) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-6 h-6 text-green-600 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm text-green-600 font-medium">
                  +2.1%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last week</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-xl group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                    Active Engines
                  </p>
                  <p className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {Object.keys(visibilityData.engine_breakdown).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-purple-600 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-500">
                    All systems active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Citation Timeline */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Citation Timeline
                </h3>
                <button className="text-sm text-primary-600 hover:text-primary-700">
                  View Details
                </button>
              </div>
              <div className="h-64 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10"></div>
                <div className="relative z-10 text-center">
                  <BarChart3 className="w-12 h-12 text-primary-500 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">
                    Citation Timeline Chart
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {(visibilityData.trend_data || []).length} data points
                  </p>
                </div>
              </div>
            </div>

            {/* Engine Distribution */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Engine Distribution
                </h3>
                <button className="text-sm text-primary-600 hover:text-primary-700">
                  View Details
                </button>
              </div>
              <div className="space-y-4">
                {Object.entries(visibilityData.engine_breakdown || {}).map(
                  ([engine, count]) => {
                    const percentage =
                      (count / (visibilityData.citations_count || 1)) * 100;
                    return (
                      <div key={engine} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getEngineIcon(engine)}
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {engine}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              {count.toLocaleString()}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getEngineColor(
                              engine
                            )} transition-all duration-1000 ease-out`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Top Performing Pages
              </h3>
              <button className="text-sm text-primary-600 hover:text-primary-700">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {(visibilityData.top_pages || [])
                .slice(0, 5)
                .map((page, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-sm font-semibold text-primary-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                          {page.url}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(page.relevance_score * 100).toFixed(1)}% relevance
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {page.citations}
                        </p>
                        <p className="text-xs text-gray-500">citations</p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Data Available
          </h3>
          <p className="text-gray-600 mb-4">
            No visibility data found for the selected brand.
          </p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      )}
    </div>
  );
}
