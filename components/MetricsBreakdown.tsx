"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, TrendingDown, Target, Award } from "lucide-react";
import QueryPerformanceChart from "./QueryPerformanceChart";

interface MetricsBreakdownProps {
  metrics: any;
}

const COLORS = ["#F97316", "#FB923C", "#FDBA74", "#FED7AA", "#FFEDD5"];

export default function MetricsBreakdown({ metrics }: MetricsBreakdownProps) {
  // Prepare data for charts
  const engineData = Object.entries(metrics.engineBreakdown || {}).map(
    ([engine, count]) => ({
      name: engine,
      value: count,
    })
  );

  // Don't render if no meaningful data
  if (engineData.length === 0) {
    return (
      <div className="bg-gray-700 rounded-2xl p-8 border border-gray-600">
        <div className="text-center py-8">
          <div className="text-gray-400 text-lg mb-2">
            No detailed metrics available
          </div>
          <div className="text-gray-500 text-sm">
            Charts will appear when data is available
          </div>
        </div>
      </div>
    );
  }

  // Prepare query data for the new horizontal chart
  console.log("MetricsBreakdown - metrics:", metrics);
  console.log(
    "MetricsBreakdown - topPerformingQueries:",
    metrics.topPerformingQueries
  );

  const queryPerformanceData = (metrics.topPerformingQueries || []).map(
    (query: any, index: number) => ({
      query: query.query,
      citations: query.citations,
      trend: query.trend || "stable",
      category: query.category || "general",
      engines: query.engines || ["perplexity", "chatgpt"],
      citationShare: query.citationShare || 0,
    })
  );

  console.log("MetricsBreakdown - queryPerformanceData:", queryPerformanceData);

  // Use real trend data from backend
  const trendData = metrics.visibilityTrendData || [
    { day: "No Data", visibility: 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Queries Performance - Full Width Horizontal Chart */}
      <QueryPerformanceChart
        queries={queryPerformanceData}
        title="Top Queries Performance"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visibility Trend */}
        <div className="lg:col-span-2 bg-gray-700 rounded-2xl p-8 border border-gray-600">
          <h3 className="text-xl font-semibold text-white mb-6">
            Visibility Trend (7 Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="visibility"
                  stroke="#F97316"
                  strokeWidth={3}
                  dot={{ fill: "#F97316", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Citation Quality Metrics - Compact */}
        <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">
            Citation Quality
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm">
                    Citation Confidence
                  </h4>
                  <p className="text-xs text-gray-300">Detection reliability</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-orange-500">
                  {metrics.averageCitationConfidence !== undefined
                    ? metrics.averageCitationConfidence.toFixed(1)
                    : "0.0"}
                  %
                </div>
                <div className="flex items-center text-xs text-orange-500">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {metrics.confidenceTrend !== undefined &&
                  metrics.confidenceTrend > 0
                    ? "+"
                    : ""}
                  {metrics.confidenceTrend !== undefined
                    ? metrics.confidenceTrend.toFixed(1)
                    : "0.0"}
                  %
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm">
                    Citation Accuracy
                  </h4>
                  <p className="text-xs text-gray-300">Correct vs incorrect</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-orange-500">
                  {metrics.correctCitationRatio !== undefined
                    ? metrics.correctCitationRatio.toFixed(1)
                    : "0.0"}
                  %
                </div>
                <div className="flex items-center text-xs text-orange-500">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {metrics.accuracyTrend !== undefined &&
                  metrics.accuracyTrend > 0
                    ? "+"
                    : ""}
                  {metrics.accuracyTrend !== undefined
                    ? metrics.accuracyTrend.toFixed(1)
                    : "0.0"}
                  %
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm">
                    Market Position
                  </h4>
                  <p className="text-xs text-gray-300">Rank vs competitors</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-orange-500">
                  #{metrics.visibilityRank}
                </div>
                <div className="text-xs text-orange-500">Leading position</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
