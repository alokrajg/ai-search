"use client";

import React, { useState } from "react";
import { Download, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface QueryPerformance {
  query: string;
  citations: number;
  trend: "up" | "down" | "stable";
  category: string;
  engines: string[];
  citationShare?: number;
}

interface QueryPerformanceChartProps {
  queries: QueryPerformance[];
  title?: string;
}

export default function QueryPerformanceChart({
  queries,
  title = "Top Queries Performance",
}: QueryPerformanceChartProps) {
  const [showAll, setShowAll] = useState(false);

  // Sort queries by citations and limit display
  const sortedQueries = [...queries].sort((a, b) => b.citations - a.citations);
  const displayQueries = showAll ? sortedQueries : sortedQueries.slice(0, 10);

  // Fallback data if no queries are provided
  const fallbackData = [
    {
      query: "trendy clothing brands in India",
      citations: 5,
      trend: "up",
      category: "brand-info",
      engines: ["perplexity"],
      citationShare: 23.8,
    },
    {
      query: "affordable fashion for young adults",
      citations: 4,
      trend: "up",
      category: "product-help",
      engines: ["perplexity", "chatgpt"],
      citationShare: 19.0,
    },
    {
      query: "best budget fashion stores online",
      citations: 3,
      trend: "down",
      category: "product-help",
      engines: ["perplexity", "chatgpt"],
      citationShare: 14.3,
    },
  ];

  const finalQueries = queries.length > 0 ? queries : fallbackData;
  const finalSortedQueries = [...finalQueries].sort(
    (a, b) => b.citations - a.citations
  );
  const finalDisplayQueries = showAll
    ? finalSortedQueries
    : finalSortedQueries.slice(0, 10);

  // Debug: Log the data to see what we're receiving
  console.log("QueryPerformanceChart received queries:", queries);
  console.log("Sorted queries:", sortedQueries);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "#10B981"; // green-500
      case "down":
        return "#EF4444"; // red-500
      default:
        return "#F97316"; // orange-500
    }
  };

  const downloadCSV = async () => {
    try {
      // Get the brand ID from the current context (assuming Zudio for now)
      const brandId = "v8ZznKlRWYMQkTZytgW6"; // Zudio brand ID

      const response = await fetch(`/api/v1/export/queries/csv/${brandId}`);

      if (!response.ok) {
        throw new Error("Failed to download CSV");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `queries-citations-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading CSV:", error);
      // Fallback to client-side CSV generation
      const csvContent = [
        // Header
        ["Query", "Citations", "Trend", "Category", "Engines", "Rank"].join(
          ","
        ),
        // Data rows
        ...chartData.map((item) =>
          [
            `"${item.name}"`,
            item.citations,
            item.trend,
            `"${item.category}"`,
            `"${item.engines}"`,
            item.rank,
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `query-performance-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return null;
}
