"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Brand, VisibilityMetrics } from "@/lib/api";

interface TrendAnalysisProps {
  brands: Brand[];
  visibilityData: VisibilityMetrics[];
}

export default function TrendAnalysis({
  brands,
  visibilityData,
}: TrendAnalysisProps) {
  // Mock trend data - in a real app, this would come from historical data
  const generateTrendData = () => {
    const days = 7;
    const data = [];

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayData: any = {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };

      brands.forEach((brand, index) => {
        const baseCitations = visibilityData[index]?.citations_count || 0;
        const variation = Math.random() * 0.3 - 0.15; // ±15% variation
        dayData[brand.name] = Math.round(baseCitations * (1 + variation));
      });

      data.push(dayData);
    }

    return data;
  };

  const trendData = generateTrendData();
  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  const calculateTrend = (brandName: string) => {
    const values = trendData.map((d) => d[brandName] || 0);
    const first = values[0];
    const last = values[values.length - 1];

    if (first === 0) return { direction: "neutral", percentage: 0 };

    const change = ((last - first) / first) * 100;
    return {
      direction: change > 5 ? "up" : change < -5 ? "down" : "neutral",
      percentage: Math.abs(change),
    };
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Trend Analysis</h3>
        <div className="flex items-center space-x-4">
          {brands.map((brand, index) => {
            const trend = calculateTrend(brand.name);
            return (
              <div key={brand.id} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span className="text-sm text-gray-600">{brand.name}</span>
                {trend.direction === "up" && (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                )}
                {trend.direction === "down" && (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                {trend.direction === "neutral" && (
                  <Minus className="w-4 h-4 text-gray-500" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trendData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {brands.map((brand, index) => (
              <Line
                key={brand.id}
                type="monotone"
                dataKey={brand.name}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{
                  fill: colors[index % colors.length],
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {brands.map((brand, index) => {
          const trend = calculateTrend(brand.name);
          const currentValue = trendData[trendData.length - 1][brand.name] || 0;
          const previousValue =
            trendData[trendData.length - 2][brand.name] || 0;

          return (
            <div key={brand.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{brand.name}</h4>
                <div className="flex items-center">
                  {trend.direction === "up" && (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  )}
                  {trend.direction === "down" && (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  {trend.direction === "neutral" && (
                    <Minus className="w-4 h-4 text-gray-500 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      trend.direction === "up"
                        ? "text-green-600"
                        : trend.direction === "down"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {trend.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {currentValue}
              </div>
              <div className="text-sm text-gray-500">Current citations</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
