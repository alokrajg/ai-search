"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Search,
  BarChart3,
} from "lucide-react";
import { Brand, VisibilityMetrics } from "@/lib/api";

interface PerformanceInsightsProps {
  brands: Brand[];
  visibilityData: VisibilityMetrics[];
}

export default function PerformanceInsights({
  brands,
  visibilityData,
}: PerformanceInsightsProps) {
  const getInsights = () => {
    const insights = [];

    // Find top performer
    const topPerformer = visibilityData.reduce(
      (max, data, index) => {
        const currentCitations = data.citations_count || 0;
        const maxCitations = max.data.citations_count || 0;
        return currentCitations > maxCitations ? { data, index } : max;
      },
      { data: visibilityData[0], index: 0 }
    );

    if (topPerformer.data) {
      insights.push({
        type: "success",
        icon: Award,
        title: "Top Performer",
        description: `${brands[topPerformer.index]?.name} leads with ${
          topPerformer.data.citations_count
        } citations`,
        value: topPerformer.data.citations_count,
      });
    }

    // Find most diverse engine presence
    const mostDiverse = visibilityData.reduce(
      (max, data, index) => {
        const currentEngines = Object.keys(data.engine_breakdown || {}).length;
        const maxEngines = Object.keys(max.data.engine_breakdown || {}).length;
        return currentEngines > maxEngines ? { data, index } : max;
      },
      { data: visibilityData[0], index: 0 }
    );

    if (mostDiverse.data) {
      const engineCount = Object.keys(
        mostDiverse.data.engine_breakdown || {}
      ).length;
      insights.push({
        type: "info",
        icon: Target,
        title: "Most Diverse",
        description: `${
          brands[mostDiverse.index]?.name
        } appears on ${engineCount} engines`,
        value: engineCount,
      });
    }

    // Find highest visibility score
    const highestScore = visibilityData.reduce(
      (max, data, index) => {
        const currentScore = (data.visibility_score || 0) * 100;
        const maxScore = (max.data.visibility_score || 0) * 100;
        return currentScore > maxScore ? { data, index } : max;
      },
      { data: visibilityData[0], index: 0 }
    );

    if (highestScore.data) {
      insights.push({
        type: "success",
        icon: CheckCircle,
        title: "Highest Score",
        description: `${brands[highestScore.index]?.name} has ${(
          (highestScore.data.visibility_score || 0) * 100
        ).toFixed(1)}% visibility`,
        value:
          ((highestScore.data.visibility_score || 0) * 100).toFixed(1) + "%",
      });
    }

    // Find low visibility brands
    const lowVisibility = visibilityData.filter(
      (data, index) => (data.citations_count || 0) < 5 && brands[index]
    );

    if (lowVisibility.length > 0) {
      insights.push({
        type: "warning",
        icon: AlertTriangle,
        title: "Low Visibility Alert",
        description: `${lowVisibility.length} brand(s) have fewer than 5 citations`,
        value: lowVisibility.length,
      });
    }

    // Market share insights
    const totalCitations = visibilityData.reduce(
      (sum, data) => sum + (data.citations_count || 0),
      0
    );
    const marketLeader = visibilityData.reduce(
      (max, data, index) => {
        const currentShare =
          ((data.citations_count || 0) / totalCitations) * 100;
        const maxShare =
          ((max.data.citations_count || 0) / totalCitations) * 100;
        return currentShare > maxShare
          ? { data, index, share: currentShare }
          : max;
      },
      { data: visibilityData[0], index: 0, share: 0 }
    );

    if (marketLeader.share > 50) {
      insights.push({
        type: "info",
        icon: Users,
        title: "Market Leader",
        description: `${
          brands[marketLeader.index]?.name
        } dominates with ${marketLeader.share.toFixed(1)}% market share`,
        value: marketLeader.share.toFixed(1) + "%",
      });
    }

    // Query-related insights
    const totalQueries = visibilityData.reduce(
      (sum, data) => sum + (data.total_queries || 0),
      0
    );

    if (totalQueries > 0) {
      // Most active query brand
      const mostActiveQueries = visibilityData.reduce(
        (max, data, index) => {
          const currentQueries = data.total_queries || 0;
          const maxQueries = max.data.total_queries || 0;
          return currentQueries > maxQueries ? { data, index } : max;
        },
        { data: visibilityData[0], index: 0 }
      );

      if (mostActiveQueries.data && mostActiveQueries.data.total_queries > 0) {
        insights.push({
          type: "success",
          icon: Search,
          title: "Most Active Queries",
          description: `${brands[mostActiveQueries.index]?.name} has ${
            mostActiveQueries.data.total_queries
          } active queries`,
          value: mostActiveQueries.data.total_queries,
        });
      }

      // Best query efficiency
      const bestEfficiency = visibilityData.reduce(
        (max, data, index) => {
          const currentEfficiency = data.average_citations_per_query || 0;
          const maxEfficiency = max.data.average_citations_per_query || 0;
          return currentEfficiency > maxEfficiency ? { data, index } : max;
        },
        { data: visibilityData[0], index: 0 }
      );

      if (
        bestEfficiency.data &&
        bestEfficiency.data.average_citations_per_query > 0
      ) {
        insights.push({
          type: "info",
          icon: BarChart3,
          title: "Best Query Efficiency",
          description: `${
            brands[bestEfficiency.index]?.name
          } averages ${bestEfficiency.data.average_citations_per_query.toFixed(
            2
          )} citations per query`,
          value: bestEfficiency.data.average_citations_per_query.toFixed(2),
        });
      }
    }

    return insights;
  };

  const insights = getInsights();

  if (insights.length === 0) {
    return (
      <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-2">
              No Insights Available
            </h3>
            <p className="text-gray-400">
              Add more data to generate performance insights
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Performance Insights
        </h3>
        <div className="flex items-center text-sm text-gray-400">
          <Clock className="w-4 h-4 mr-1" />
          Updated 2 minutes ago
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              insight.type === "success"
                ? "bg-orange-500/10 border-orange-500/20"
                : insight.type === "warning"
                ? "bg-yellow-500/10 border-yellow-500/20"
                : "bg-blue-500/10 border-blue-500/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    insight.type === "success"
                      ? "bg-orange-500/20"
                      : insight.type === "warning"
                      ? "bg-yellow-500/20"
                      : "bg-blue-500/20"
                  }`}
                >
                  <insight.icon
                    className={`w-5 h-5 ${
                      insight.type === "success"
                        ? "text-orange-500"
                        : insight.type === "warning"
                        ? "text-yellow-500"
                        : "text-blue-500"
                    }`}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-white">{insight.title}</h4>
                  <p className="text-sm text-gray-300">{insight.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {insight.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
