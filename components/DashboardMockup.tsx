"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Eye,
  AlertTriangle,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";

export default function DashboardMockup() {
  const [activeMetric, setActiveMetric] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      icon: Eye,
      value: "1,247",
      label: "Total Citations",
      change: "+12.5%",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: AlertTriangle,
      value: "3",
      label: "Active Alerts",
      change: "2 high",
      color: "from-red-500 to-red-600",
    },
    {
      icon: Target,
      value: "5",
      label: "Suggestions",
      change: "2 pending",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: Activity,
      value: "4.2m",
      label: "Response Time",
      change: "-0.8m",
      color: "from-green-500 to-green-600",
    },
  ];

  const chartData = [
    { name: "Mon", value: 45 },
    { name: "Tue", value: 52 },
    { name: "Wed", value: 48 },
    { name: "Thu", value: 61 },
    { name: "Fri", value: 55 },
    { name: "Sat", value: 67 },
    { name: "Sun", value: 72 },
  ];

  return (
    <div
      className={`relative w-full max-w-6xl mx-auto transform transition-all duration-1000 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      {/* Main Dashboard Container */}
      <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">GEO Dashboard</h3>
                <p className="text-xs text-gray-500">Live monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className={`relative p-4 rounded-xl border transition-all duration-500 ${
                  activeMetric === index
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg scale-105"
                    : "bg-white border-gray-200 hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center`}
                  >
                    <metric.icon className="w-4 h-4 text-white" />
                  </div>
                  {activeMetric === index && (
                    <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                  )}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.value}
                </div>
                <div className="text-xs text-gray-600 mb-1">{metric.label}</div>
                <div className="flex items-center text-xs">
                  {metric.change.startsWith("+") ? (
                    <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
                  ) : metric.change.startsWith("-") ? (
                    <ArrowDownRight className="w-3 h-3 text-red-500 mr-1" />
                  ) : (
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1" />
                  )}
                  <span
                    className={
                      metric.change.startsWith("+")
                        ? "text-green-600"
                        : metric.change.startsWith("-")
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                  >
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Citation Timeline</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-xs text-gray-600">Last 7 days</span>
              </div>
            </div>
            <div className="flex items-end justify-between h-24">
              {chartData.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-6 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-1000 ease-out"
                    style={{
                      height: `${(item.value / 80) * 100}%`,
                      animationDelay: `${index * 100}ms`,
                    }}
                  />
                  <span className="text-xs text-gray-500 mt-2">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-4 space-y-2">
            <h4 className="font-semibold text-gray-900 mb-3">
              Recent Activity
            </h4>
            {[
              {
                type: "citation",
                message: "New citation detected on ChatGPT",
                time: "2m ago",
                status: "new",
              },
              {
                type: "alert",
                message: "Misinformation alert resolved",
                time: "5m ago",
                status: "resolved",
              },
              {
                type: "optimization",
                message: "Content suggestion generated",
                time: "8m ago",
                status: "pending",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.status === "new"
                      ? "bg-green-500 animate-pulse"
                      : activity.status === "resolved"
                      ? "bg-blue-500"
                      : "bg-yellow-500"
                  }`}
                />
                <span className="text-sm text-gray-700 flex-1">
                  {activity.message}
                </span>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" />
      <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse" />
      <div className="absolute top-1/2 -left-8 w-4 h-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-ping" />
    </div>
  );
}
