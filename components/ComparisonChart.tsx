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
} from "recharts";
import { Brand, VisibilityMetrics } from "@/lib/api";

interface ComparisonChartProps {
  brands: Brand[];
  visibilityData: VisibilityMetrics[];
  type: "citations" | "engines" | "pages";
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function ComparisonChart({
  brands,
  visibilityData,
  type,
}: ComparisonChartProps) {
  const getChartData = () => {
    switch (type) {
      case "citations":
        return brands.map((brand, index) => ({
          name: brand.name,
          citations: visibilityData[index]?.citations_count || 0,
          pages: visibilityData[index]?.unique_pages || 0,
        }));

      case "engines":
        const engineData: { [key: string]: number } = {};
        visibilityData.forEach((data) => {
          Object.entries(data.engine_breakdown || {}).forEach(
            ([engine, count]) => {
              engineData[engine] = (engineData[engine] || 0) + count;
            }
          );
        });
        return Object.entries(engineData).map(([engine, count]) => ({
          name: engine,
          value: count,
        }));

      case "pages":
        return brands.map((brand, index) => ({
          name: brand.name,
          pages: visibilityData[index]?.unique_pages || 0,
          visibility: (
            (visibilityData[index]?.visibility_score || 0) * 100
          ).toFixed(1),
        }));

      default:
        return [];
    }
  };

  const data = getChartData();

  if (type === "engines") {
    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {type === "citations" ? (
            <>
              <Bar dataKey="citations" fill="#3B82F6" name="Citations" />
              <Bar dataKey="pages" fill="#10B981" name="Pages" />
            </>
          ) : (
            <Bar dataKey="pages" fill="#8B5CF6" name="Pages" />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
