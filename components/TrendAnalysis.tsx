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

const COLORS = ["#F97316", "#FB923C", "#FDBA74", "#FED7AA", "#FFEDD5"];

export default function TrendAnalysis({
  brands,
  visibilityData,
}: TrendAnalysisProps) {
  // Use real historical data or show placeholder
  const getTrendData = () => {
    // In a real implementation, this would fetch historical data from the backend
    // For now, we'll show a placeholder indicating no historical data
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
        // Use current data as baseline, but indicate it's not historical
        const currentCitations = visibilityData[index]?.citations_count || 0;
        dayData[brand.name] = currentCitations; // No random variation
      });

      data.push(dayData);
    }

    return data;
  };

  const trendData = getTrendData();

  // Calculate trend direction for each brand
  const getTrendDirection = (brandName: string) => {
    const brandData = trendData.map((day) => day[brandName]);
    const firstValue = brandData[0];
    const lastValue = brandData[brandData.length - 1];

    // If no historical data (all values are the same), show neutral
    if (firstValue === 0 || firstValue === lastValue) {
      return { direction: "neutral", percentage: 0 };
    }

    const change = ((lastValue - firstValue) / firstValue) * 100;

    if (change > 5) return { direction: "up", percentage: change };
    if (change < -5) return { direction: "down", percentage: Math.abs(change) };
    return { direction: "neutral", percentage: 0 };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Trend Analysis</h3>
        <div className="text-sm text-gray-400">
          Current data (no historical trends available)
        </div>
      </div>

      {/* Brand Legend */}
      <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
        <div className="flex flex-wrap gap-4">
          {brands.map((brand, index) => {
            const trend = getTrendDirection(brand.name);
            return (
              <div key={brand.id} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm text-gray-300">{brand.name}</span>
                {trend.direction === "up" && (
                  <TrendingUp className="w-4 h-4 text-orange-500" />
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

      <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Legend />
              {brands.map((brand, index) => (
                <Line
                  key={brand.id}
                  type="monotone"
                  dataKey={brand.name}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={{
                    fill: COLORS[index % COLORS.length],
                    strokeWidth: 2,
                    r: 4,
                  }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((brand, index) => {
          const trend = getTrendDirection(brand.name);
          const currentValue = trendData[trendData.length - 1][brand.name];

          return (
            <div
              key={brand.id}
              className="bg-gray-700 rounded-xl p-4 border border-gray-600"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">{brand.name}</h4>
                  <p className="text-sm text-gray-400">Current citations</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {currentValue}
                  </div>
                  <div className="flex items-center text-sm">
                    {trend.direction === "up" && (
                      <>
                        <TrendingUp className="w-4 h-4 text-orange-500 mr-1" />
                        <span className="text-orange-500">
                          +{trend.percentage.toFixed(1)}%
                        </span>
                      </>
                    )}
                    {trend.direction === "down" && (
                      <>
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        <span className="text-red-500">
                          -{trend.percentage.toFixed(1)}%
                        </span>
                      </>
                    )}
                    {trend.direction === "neutral" && (
                      <>
                        <Minus className="w-4 h-4 text-gray-500 mr-1" />
                        <span className="text-gray-500">0.0%</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
