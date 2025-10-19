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
  type: "citations" | "engines" | "pages" | "queries" | "query_performance";
}

const COLORS = ["#F97316", "#FB923C", "#FDBA74", "#FED7AA", "#FFEDD5"];

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

      case "queries":
        return brands.map((brand, index) => ({
          name: brand.name,
          totalQueries: visibilityData[index]?.total_queries || 0,
          activeQueries: visibilityData[index]?.active_queries || 0,
        }));

      case "query_performance":
        return brands.map((brand, index) => ({
          name: brand.name,
          citations: visibilityData[index]?.citations_count || 0,
          queries: visibilityData[index]?.total_queries || 0,
          avgCitationsPerQuery:
            visibilityData[index]?.total_queries > 0
              ? (visibilityData[index]?.citations_count || 0) /
                visibilityData[index]?.total_queries
              : 0,
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
          <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip />
          <Legend />
          {type === "citations" ? (
            <>
              <Bar dataKey="citations" fill="#F97316" name="Citations" />
              <Bar dataKey="pages" fill="#FB923C" name="Pages" />
            </>
          ) : type === "queries" ? (
            <>
              <Bar dataKey="totalQueries" fill="#F97316" name="Total Queries" />
              <Bar
                dataKey="activeQueries"
                fill="#FB923C"
                name="Active Queries"
              />
            </>
          ) : type === "query_performance" ? (
            <>
              <Bar dataKey="citations" fill="#F97316" name="Citations" />
              <Bar dataKey="queries" fill="#FB923C" name="Queries" />
              <Bar
                dataKey="avgCitationsPerQuery"
                fill="#FDBA74"
                name="Avg Citations/Query"
              />
            </>
          ) : (
            <Bar dataKey="pages" fill="#F97316" name="Pages" />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
