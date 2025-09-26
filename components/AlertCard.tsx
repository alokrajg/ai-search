"use client";

import { AlertTriangle, CheckCircle, Clock, Info } from "lucide-react";

interface AlertCardProps {
  id: number;
  type: "misinformation" | "citation" | "optimization" | "system";
  severity: "high" | "medium" | "low";
  message: string;
  source: string;
  time: string;
  status?: "active" | "resolved" | "dismissed";
}

export default function AlertCard({
  id,
  type,
  severity,
  message,
  source,
  time,
  status = "active",
}: AlertCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-100 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-100 border-green-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "misinformation":
        return AlertTriangle;
      case "citation":
        return Info;
      case "optimization":
        return CheckCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "text-green-600 bg-green-100";
      case "dismissed":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  const TypeIcon = getTypeIcon(type);

  return (
    <div
      className={`border rounded-lg p-4 transition-all hover:shadow-md ${
        status === "resolved"
          ? "bg-green-50 border-green-200"
          : status === "dismissed"
          ? "bg-gray-50 border-gray-200"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-start space-x-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            severity === "high"
              ? "bg-red-100"
              : severity === "medium"
              ? "bg-yellow-100"
              : "bg-green-100"
          }`}
        >
          <TypeIcon
            className={`w-4 h-4 ${
              severity === "high"
                ? "text-red-600"
                : severity === "medium"
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium text-gray-900">{message}</h4>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(
                severity
              )}`}
            >
              {severity}
            </span>
            {status !== "active" && (
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  status
                )}`}
              >
                {status}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <span>Source: {source}</span>
            <span>•</span>
            <span>{time}</span>
          </div>

          {status === "active" && (
            <div className="flex items-center space-x-3">
              <button className="px-3 py-1 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors">
                Take Action
              </button>
              <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                Dismiss
              </button>
              <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                View Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
