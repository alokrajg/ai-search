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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            AI Visibility Monitoring
          </h2>
          <p className="text-gray-600 mt-1">
            Track Zudio's visibility across AI search engines and compare with
            competitors
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Brand Selector */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
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
        <div className="space-y-4">
          {selectedBrands.length === 1 ? (
            // Zudio Only Mode - Show individual metrics
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Zudio Performance Metrics
                  </h3>
                  <p className="text-gray-600 mt-1">
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
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Competitive Analysis
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Compare Zudio's performance against competitors
                  </p>
                </div>
              </div>

              {/* Comparison Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ComparisonChart
                  brands={selectedBrands}
                  visibilityData={visibilityData}
                  type="citations"
                />
                <ComparisonChart
                  brands={selectedBrands}
                  visibilityData={visibilityData}
                  type="engines"
                />
              </div>

              {/* Performance Insights */}
              <PerformanceInsights
                brands={selectedBrands}
                visibilityData={visibilityData}
              />

              {/* Trend Analysis */}
              <TrendAnalysis
                brands={selectedBrands}
                visibilityData={visibilityData}
              />
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading visibility data...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Eye className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
