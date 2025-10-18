"use client";

import { useState, useEffect } from "react";
import { Eye, TrendingUp, Globe, BarChart3, PieChart } from "lucide-react";
import BrandSelector from "./BrandSelector";
import AnimatedChart from "./AnimatedChart";
import ComparisonChart from "./ComparisonChart";
import PerformanceInsights from "./PerformanceInsights";
import TrendAnalysis from "./TrendAnalysis";
import VisibilityMetricsComponent from "./VisibilityMetrics";
import { apiService, Brand, VisibilityMetrics } from "@/lib/api";

interface EnhancedVisibilityDashboardProps {
  selectedBrandId?: string;
}

export default function EnhancedVisibilityDashboard({
  selectedBrandId,
}: EnhancedVisibilityDashboardProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<Brand[]>([]);
  const [visibilityData, setVisibilityData] = useState<VisibilityMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set Zudio as default primary brand
  useEffect(() => {
    if (brands.length > 0 && selectedBrands.length === 0) {
      const zudioBrand = brands.find(
        (brand) => brand.name.toLowerCase() === "zudio"
      );
      if (zudioBrand) {
        setSelectedBrands([zudioBrand]);
      } else {
        setSelectedBrands([brands[0]]);
      }
    }
  }, [brands, selectedBrands.length]);

  const loadBrands = async () => {
    try {
      const brandsData = await apiService.getBrands();
      setBrands(brandsData);
    } catch (err) {
      console.error("Failed to load brands:", err);
      setError("Failed to load brands");
    }
  };

  const loadVisibilityData = async () => {
    if (selectedBrands.length === 0) return;

    try {
      setIsRefreshing(true);
      const promises = selectedBrands.map((brand) =>
        apiService.getVisibilityMetrics(brand.id)
      );
      const results = await Promise.all(promises);
      setVisibilityData(results);
      setError(null);
    } catch (err) {
      console.error("Failed to load visibility data:", err);
      setError("Failed to load visibility data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  useEffect(() => {
    if (selectedBrands.length > 0) {
      loadVisibilityData();
    }
  }, [selectedBrands]);

  const handleRefresh = () => {
    loadVisibilityData();
  };

  const handleExport = () => {
    // Export functionality
    console.log("Exporting visibility data...");
  };

  const totalCitations = visibilityData.reduce(
    (sum, data) => sum + (data.citations_count || 0),
    0
  );

  const getMarketShare = (citations: number, total: number) => {
    if (total === 0) return 0;
    return (citations / total) * 100;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-8 border border-gray-600">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">
                  AI Visibility Monitoring
                </h2>
                <p className="text-gray-300 mt-1 text-lg">
                  Track Zudio's visibility across AI search engines and compare
                  with competitors
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center px-6 py-3 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-xl hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-all duration-200 shadow-sm"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={handleExport}
              className="flex items-center px-6 py-3 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-xl hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 shadow-sm"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Brand Selector */}
      <div className="bg-gray-800 rounded-2xl p-8 border border-gray-600 shadow-sm">
        <BrandSelector
          brands={brands}
          selectedBrands={selectedBrands}
          onBrandsChange={setSelectedBrands}
          maxSelections={4}
          showCompetitorMode={true}
        />
      </div>

      {/* Content based on selected mode */}
      {visibilityData.length > 0 && (
        <div className="space-y-8">
          {selectedBrands.length === 1 ? (
            // Zudio Only Mode - Show individual metrics
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-600 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Zudio Performance Metrics
                  </h3>
                  <p className="text-gray-300 mt-2 text-lg">
                    Individual performance indicators for Zudio
                  </p>
                </div>
              </div>
              <VisibilityMetricsComponent
                brands={selectedBrands}
                visibilityData={visibilityData}
              />
            </div>
          ) : (
            // vs Competitors Mode - Show comparison charts and visuals
            <div className="space-y-8">
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-600 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Competitive Analysis
                    </h3>
                    <p className="text-gray-300 mt-2 text-lg">
                      Compare Zudio's performance against competitors
                    </p>
                  </div>
                </div>

                {/* Comparison Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                    <ComparisonChart
                      brands={selectedBrands}
                      visibilityData={visibilityData}
                      type="citations"
                    />
                  </div>
                  <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                    <ComparisonChart
                      brands={selectedBrands}
                      visibilityData={visibilityData}
                      type="engines"
                    />
                  </div>
                </div>
              </div>

              {/* Performance Insights */}
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-600 shadow-sm">
                <PerformanceInsights
                  brands={selectedBrands}
                  visibilityData={visibilityData}
                />
              </div>

              {/* Trend Analysis */}
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-600 shadow-sm">
                <TrendAnalysis
                  brands={selectedBrands}
                  visibilityData={visibilityData}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className="bg-gray-800 rounded-2xl p-12 border border-gray-600 shadow-sm">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-300 text-lg">
              Loading visibility data...
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-gray-800 border border-gray-600 rounded-2xl p-6 shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <Eye className="h-6 w-6 text-orange-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-white">Error</h3>
              <div className="mt-2 text-gray-300">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
