"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Search,
  Eye,
  CheckCircle,
  Shield,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
} from "lucide-react";

interface QueryData {
  queryId: string;
  queryText: string;
  category: string;
  engineTargets: string[];
  active: boolean;
  createdAt: string;
  realCitations: number;
  citationShare: number;
}

interface CSVMetricsVisualizationProps {
  brandId?: string;
}

interface PerformanceData {
  summary: {
    totalQueries: number;
    activeQueries: number;
    totalCitations: number;
    avgCitationsPerQuery: number;
    topPerformerCitations: number;
    topPerformerShare: number;
    categoryCount: number;
    engineCount: number;
  };
  categoryData: Array<{
    name: string;
    value: number;
    percentage: number;
    totalCitations: number;
    avgCitations: number;
  }>;
  engineData: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  topQueries: QueryData[];
  allQueries: QueryData[];
}

export default function CSVMetricsVisualization({
  brandId = "v8ZznKlRWYMQkTZytgW6", // Default to Zudio
}: CSVMetricsVisualizationProps) {
  const [data, setData] = useState<QueryData[]>([]);
  const [performanceData, setPerformanceData] =
    useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/v1/performance/queries/performance/${brandId}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch performance data: ${response.statusText}`
          );
        }

        const data: PerformanceData = await response.json();
        setPerformanceData(data);
        setData(data.allQueries);
      } catch (err) {
        console.error("Error fetching performance data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");

        // Fallback to mock data if API fails
        setData([
          {
            queryId: "4eJxbZb9a2uVgN96lSLQ",
            queryText: "trendy clothing brands in India",
            category: "brand-info",
            engineTargets: ["perplexity"],
            active: true,
            createdAt: "",
            realCitations: 5,
            citationShare: 23.8,
          },
          {
            queryId: "69Q8hJ8qzZeS9QgPrRHJ",
            queryText: "affordable ethnic wear for young people",
            category: "product-help",
            engineTargets: ["perplexity", "chatgpt"],
            active: true,
            createdAt: "",
            realCitations: 4,
            citationShare: 19.0,
          },
          {
            queryId: "6ucg5fQBDGANVzr044su",
            queryText: "youth fashion brands in India",
            category: "brand-info",
            engineTargets: ["perplexity", "chatgpt"],
            active: true,
            createdAt: "",
            realCitations: 3,
            citationShare: 14.3,
          },
          {
            queryId: "ABd51zjSoKn5E1D6hLCA",
            queryText: "fashion brands for college students",
            category: "product-help",
            engineTargets: ["perplexity", "chatgpt"],
            active: true,
            createdAt: "",
            realCitations: 2,
            citationShare: 9.5,
          },
          {
            queryId: "AHAYM6hNkc6Iv6ettj14",
            queryText: "cheap trendy dresses online",
            category: "product-help",
            engineTargets: ["perplexity", "chatgpt"],
            active: true,
            createdAt: "",
            realCitations: 2,
            citationShare: 9.5,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [brandId]);

  // Download CSV function
  const downloadCSV = async () => {
    try {
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
        [
          "Query",
          "Citations",
          "Category",
          "Engines",
          "Citation Share (%)",
        ].join(","),
        // Data rows
        ...data.map((query) =>
          [
            `"${query.queryText}"`,
            query.realCitations,
            `"${query.category}"`,
            `"${query.engineTargets.join(", ")}"`,
            query.citationShare.toFixed(1),
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

  // Calculate metrics from data
  const totalQueries = data.length;
  const totalCitations = data.reduce(
    (sum, item) => sum + item.realCitations,
    0
  );
  const activeQueries = data.filter((item) => item.active).length;
  const avgCitationsPerQuery = totalCitations / totalQueries;

  // Category distribution
  const categoryData = data.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData).map(
    ([category, count]) => ({
      name: category,
      value: count,
      percentage: ((count / totalQueries) * 100).toFixed(1),
    })
  );

  // Engine distribution
  const engineData = data.reduce((acc, item) => {
    item.engineTargets.forEach((engine) => {
      acc[engine] = (acc[engine] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const engineChartData = Object.entries(engineData).map(([engine, count]) => ({
    name: engine,
    value: count,
    percentage: ((count / totalQueries) * 100).toFixed(1),
  }));

  // Top performing queries
  const topQueries = data
    .sort((a, b) => b.realCitations - a.realCitations)
    .slice(0, 5);

  // Citation performance by category
  const categoryPerformance = data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { totalCitations: 0, queryCount: 0 };
    }
    acc[item.category].totalCitations += item.realCitations;
    acc[item.category].queryCount += 1;
    return acc;
  }, {} as Record<string, { totalCitations: number; queryCount: number }>);

  const categoryPerformanceData = Object.entries(categoryPerformance).map(
    ([category, stats]) => ({
      category,
      totalCitations: stats.totalCitations,
      avgCitations: (stats.totalCitations / stats.queryCount).toFixed(1),
      queryCount: stats.queryCount,
    })
  );

  const COLORS = ["#F97316", "#FB923C", "#FDBA74", "#FED7AA", "#FFEDD5"];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold">{label}</p>
          <p className="text-orange-400">
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-gray-700 rounded-2xl p-8 border border-gray-600">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <span className="ml-4 text-white">Loading performance data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-gray-700 rounded-2xl p-8 border border-gray-600">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-orange-500 text-2xl mb-2">⚠️</div>
              <div className="text-white text-lg mb-2">Failed to load data</div>
              <div className="text-gray-400 text-sm">{error}</div>
              <div className="text-gray-500 text-xs mt-2">
                Using fallback data
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                Total Queries
              </h3>
              <p className="text-gray-300 text-sm">Active queries</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white">
              {performanceData?.summary.totalQueries || totalQueries}
            </div>
            <div className="text-orange-400 text-sm">
              {performanceData?.summary.activeQueries || activeQueries} active
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                Total Citations
              </h3>
              <p className="text-gray-300 text-sm">Across all queries</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white">
              {totalCitations}
            </div>
            <div className="text-orange-400 text-sm">
              {avgCitationsPerQuery.toFixed(1)} avg per query
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                Top Performer
              </h3>
              <p className="text-gray-300 text-sm">Best query</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white">
              {topQueries[0]?.realCitations || 0}
            </div>
            <div className="text-orange-400 text-sm">
              {topQueries[0]?.citationShare.toFixed(1)}% share
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Categories</h3>
              <p className="text-gray-300 text-sm">Query types</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white">
              {Object.keys(categoryData).length}
            </div>
            <div className="text-orange-400 text-sm">
              {Object.keys(engineData).length} engines
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <div className="bg-gray-700 rounded-2xl p-8 border border-gray-600">
          <h3 className="text-xl font-semibold text-white mb-6">
            Query Category Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engine Distribution */}
        <div className="bg-gray-700 rounded-2xl p-8 border border-gray-600">
          <h3 className="text-xl font-semibold text-white mb-6">
            Engine Target Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Queries Performance */}
      <div className="bg-gray-700 rounded-2xl p-8 border border-gray-600">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            Top 5 Performing Queries
          </h3>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download CSV
          </button>
        </div>
        <div className="space-y-4">
          {topQueries.map((query, index) => (
            <div
              key={query.queryId}
              className="flex items-center justify-between bg-gray-800 rounded-lg p-4 border border-gray-600"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">
                    {query.queryText}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {query.category} • {query.engineTargets.join(", ")}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-orange-400 font-bold text-lg">
                    {query.realCitations}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {query.citationShare.toFixed(1)}% share
                  </div>
                </div>
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Performance Analysis */}
      <div className="bg-gray-700 rounded-2xl p-8 border border-gray-600">
        <h3 className="text-xl font-semibold text-white mb-6">
          Category Performance Analysis
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="category" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-xl">
                        <p className="text-white font-semibold">{label}</p>
                        <p className="text-orange-400">
                          Total Citations: {data.totalCitations}
                        </p>
                        <p className="text-gray-300">
                          Avg per Query: {data.avgCitations}
                        </p>
                        <p className="text-gray-300">
                          Queries: {data.queryCount}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="totalCitations"
                fill="#F97316"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
