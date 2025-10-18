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

    if (
      mostDiverse.data &&
      Object.keys(mostDiverse.data.engine_breakdown || {}).length > 1
    ) {
      insights.push({
        type: "info",
        icon: Target,
        title: "Most Diverse Presence",
        description: `${brands[mostDiverse.index]?.name} appears on ${
          Object.keys(mostDiverse.data.engine_breakdown || {}).length
        } AI engines`,
        value: Object.keys(mostDiverse.data.engine_breakdown || {}).length,
      });
    }

    // Find highest visibility score
    const highestScore = visibilityData.reduce(
      (max, data, index) => {
        const currentScore = data.visibility_score || 0;
        const maxScore = max.data.visibility_score || 0;
        return currentScore > maxScore ? { data, index } : max;
      },
      { data: visibilityData[0], index: 0 }
    );

    if (highestScore.data && (highestScore.data.visibility_score || 0) > 0.7) {
      insights.push({
        type: "success",
        icon: CheckCircle,
        title: "High Quality Visibility",
        description: `${brands[highestScore.index]?.name} has ${(
          (highestScore.data.visibility_score || 0) * 100
        ).toFixed(1)}% relevance score`,
        value:
          ((highestScore.data.visibility_score || 0) * 100).toFixed(1) + "%",
      });
    }

    // Find brands with low visibility
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

    return insights;
  };

  const insights = getInsights();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "info":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getInsightBorder = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-200";
      case "warning":
        return "border-yellow-200";
      case "info":
        return "border-blue-200";
      default:
        return "border-gray-200";
    }
  };

  if (insights.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Insights Available
            </h3>
            <p className="text-gray-500">
              Add more data to generate performance insights
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <div
          key={index}
          className={`bg-white rounded-xl p-6 border ${getInsightBorder(
            insight.type
          )} hover:shadow-lg transition-shadow`}
        >
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-lg ${getInsightIcon(insight.type)}`}>
              <insight.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {insight.title}
                </h3>
                <span className="text-2xl font-bold text-gray-900">
                  {insight.value}
                </span>
              </div>
              <p className="text-gray-600">{insight.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
