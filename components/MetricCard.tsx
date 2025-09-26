"use client";

import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  color?: string;
  trend?: "up" | "down" | "neutral";
}

export default function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color = "primary",
  trend = "neutral",
}: MetricCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary-100 text-primary-600";
      case "secondary":
        return "bg-secondary-100 text-secondary-600";
      case "accent":
        return "bg-accent-100 text-accent-600";
      case "red":
        return "bg-red-100 text-red-600";
      case "yellow":
        return "bg-yellow-100 text-yellow-600";
      case "green":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      default:
        return "→";
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
                {getTrendIcon(trend)} {change > 0 ? "+" : ""}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-sm text-gray-500 ml-1">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(
            color
          )}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
