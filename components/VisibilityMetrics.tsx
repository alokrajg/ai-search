"use client";

import React, { useState, useEffect } from "react";
import {
  Target,
  BarChart3,
  Globe,
  Medal,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";
import {
  Brand,
  VisibilityMetrics as VisibilityMetricsType,
  apiService,
} from "@/lib/api";
import MetricsBreakdown from "./MetricsBreakdown";
import CSVMetricsVisualization from "./CSVMetricsVisualization";

interface VisibilityMetricsProps {
  brands: Brand[];
  visibilityData: VisibilityMetricsType[];
}

export default function VisibilityMetricsComponent({
  brands,
  visibilityData,
}: VisibilityMetricsProps) {
  const [realMetrics, setRealMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealMetrics = async () => {
      try {
        setLoading(true);
        // Fetch real metrics from Firebase via API service
        const data = await apiService.getDashboardMetrics(
          "v8ZznKlRWYMQkTZytgW6"
        );
        setRealMetrics(data);
      } catch (error) {
        console.error("Error fetching real metrics:", error);
        setRealMetrics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRealMetrics();
  }, []);

  // Calculate comprehensive metrics
  const calculateMetrics = () => {
    // Use real metrics if available, otherwise fallback to existing calculation
    if (realMetrics) {
      return realMetrics;
    }

    const totalCitations = visibilityData.reduce(
      (sum, data) => sum + (data.citations_count || 0),
      0
    );

    // Get real query count from the data
    const totalQueries =
      brands.length > 0
        ? brands.reduce((sum, brand) => {
            const brandData = visibilityData.find(
              (_, index) => brands[index]?.id === brand.id
            );
            return sum + (brandData?.queries_count || 0);
          }, 0)
        : 0;

    const zudioData = visibilityData.find(
      (_, index) => brands[index]?.name.toLowerCase() === "zudio"
    );

    // Use real metrics from API (realMetrics) or fallback to calculated values
    const metrics = {
      brandVisibilityScore: zudioData ? zudioData.visibility_score * 100 : 0,
      totalCitationsCount: zudioData?.citations_count || 0,
      queryCoverage:
        zudioData && totalQueries > 0
          ? Math.round((zudioData.citations_count / totalQueries) * 100)
          : 0,
      visibilityRank: 0, // Will be calculated from real competitor data when available
      engineBreakdown: zudioData?.engine_breakdown || {},
      visibilityTrend: 0, // This will come from real historical data
      topCitedPages: zudioData?.top_pages || [],
      topPerformingQueries: [], // This will come from real API data
      averageCitationConfidence: 0, // This will come from real citation analysis
      correctCitationRatio: 0, // This will come from real citation analysis
    };

    return metrics;
  };

  const metrics = calculateMetrics();

  // Only show metrics if we have meaningful data
  if (!metrics.totalCitationsCount || metrics.totalCitationsCount === 0) {
    return (
      <div className="bg-gray-700 rounded-2xl p-12 border border-gray-600">
        <div className="text-center">
          <div className="text-gray-400 text-xl mb-3">
            No visibility data available
          </div>
          <div className="text-gray-500">Select brands to view metrics</div>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-orange-500" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-orange-500";
    if (trend < 0) return "text-red-500";
    return "text-gray-500";
  };

  return (
    <div className="space-y-8">
      {/* Detailed Metrics Summary */}
      <div className="bg-gray-700 rounded-2xl p-8 border border-gray-600">
        <h3 className="text-xl font-semibold text-white mb-6">
          Metrics Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">
              {metrics.brandVisibilityScore.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">Visibility Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              {metrics.totalCitationsCount}
            </div>
            <div className="text-sm text-gray-400">Total Citations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              {metrics.queryCoverage}%
            </div>
            <div className="text-sm text-gray-400">Query Coverage</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">
              #{metrics.visibilityRank}
            </div>
            <div className="text-sm text-gray-400">Market Rank</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              {Object.keys(metrics.engineBreakdown).length}
            </div>
            <div className="text-sm text-gray-400">Active Engines</div>
          </div>
        </div>
      </div>

      {/* CSV-Based Metrics Visualization */}
      <div className="mt-8">
        <CSVMetricsVisualization />
      </div>

      {/* Detailed Charts and Analysis */}
      <MetricsBreakdown metrics={metrics} />
    </div>
  );
}
