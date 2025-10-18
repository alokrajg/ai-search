"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Eye,
  Filter,
  Download,
  RefreshCw,
  Bell,
  AlertCircle,
  Info,
  Zap,
} from "lucide-react";
import {
  apiService,
  transformAlertData,
  type Alert,
  type Brand,
} from "@/lib/api";

interface AlertsDashboardProps {
  selectedBrandId?: string;
}

export default function AlertsDashboard({
  selectedBrandId,
}: AlertsDashboardProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<{
    severity: string;
    type: string;
    resolved: string;
  }>({
    severity: "all",
    type: "all",
    resolved: "false",
  });

  // Load brands on component mount
  useEffect(() => {
    loadBrands();
  }, []);

  // Load alerts when brand changes
  useEffect(() => {
    if (selectedBrand || selectedBrandId) {
      loadAlerts();
    }
  }, [selectedBrand, selectedBrandId]);

  const loadBrands = async () => {
    try {
      const brandsData = await apiService.getBrands();
      setBrands(brandsData);

      // Auto-select first brand or specified brand
      if (brandsData.length > 0) {
        const brand = selectedBrandId
          ? brandsData.find((b) => b.id === selectedBrandId) || brandsData[0]
          : brandsData[0];
        setSelectedBrand(brand);
      }
    } catch (err) {
      console.error("Failed to load brands:", err);
      setError("Failed to load brands");
    }
  };

  const loadAlerts = async () => {
    if (!selectedBrand) return;

    setIsLoading(true);
    setError(null);

    try {
      const alertsData = await apiService.getAlerts(selectedBrand.id);
      setAlerts(alertsData);
    } catch (err) {
      console.error("Failed to load alerts:", err);
      setError("Failed to load alerts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAlerts();
    setIsRefreshing(false);
  };

  const handleBrandChange = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    setSelectedBrand(brand || null);
  };

  const handleDismissAlert = async (alertId: string) => {
    try {
      await apiService.updateAlert(alertId, { resolved: true });
      setAlerts(
        alerts.map((alert) =>
          alert.id === alertId ? { ...alert, resolved: true } : alert
        )
      );
    } catch (err) {
      console.error("Failed to dismiss alert:", err);
    }
  };

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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="w-4 h-4" />;
      case "medium":
        return <AlertCircle className="w-4 h-4" />;
      case "low":
        return <Info className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "misinformation":
        return "text-red-600 bg-red-50";
      case "citation":
        return "text-blue-600 bg-blue-50";
      case "optimization":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "misinformation":
        return <Shield className="w-4 h-4" />;
      case "citation":
        return <Eye className="w-4 h-4" />;
      case "optimization":
        return <Zap className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  // Filter alerts based on current filter settings
  const filteredAlerts = alerts.filter((alert) => {
    if (filter.severity !== "all" && alert.severity !== filter.severity)
      return false;
    if (filter.type !== "all" && alert.type !== filter.type) return false;
    if (filter.resolved === "true" && !alert.resolved) return false;
    if (filter.resolved === "false" && alert.resolved) return false;
    return true;
  });

  const alertStats = {
    total: alerts.length,
    high: alerts.filter((a) => a.severity === "high" && !a.resolved).length,
    medium: alerts.filter((a) => a.severity === "medium" && !a.resolved).length,
    low: alerts.filter((a) => a.severity === "low" && !a.resolved).length,
    resolved: alerts.filter((a) => a.resolved).length,
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error Loading Alerts
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadAlerts}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Brand & Misinformation Alerts
            </h2>
            <p className="text-gray-600">
              Monitor and manage alerts across AI search engines
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-primary-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Brand Selector */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Brand:</label>
          <select
            value={selectedBrand?.id || ""}
            onChange={(e) => handleBrandChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">
                {alertStats.total}
              </p>
            </div>
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">
                {alertStats.high}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">
                Medium Priority
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {alertStats.medium}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Low Priority</p>
              <p className="text-2xl font-bold text-green-600">
                {alertStats.low}
              </p>
            </div>
            <Info className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">
                {alertStats.resolved}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filters:</label>

          <select
            value={filter.severity}
            onChange={(e) => setFilter({ ...filter, severity: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Types</option>
            <option value="misinformation">Misinformation</option>
            <option value="citation">Citation</option>
            <option value="optimization">Optimization</option>
          </select>

          <select
            value={filter.resolved}
            onChange={(e) => setFilter({ ...filter, resolved: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="false">Active Only</option>
            <option value="true">Resolved Only</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      {isLoading ? (
        <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading alerts...</p>
        </div>
      ) : filteredAlerts.length > 0 ? (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-xl p-6 border transition-all duration-300 hover:shadow-lg ${
                alert.resolved
                  ? "border-gray-200 bg-gray-50"
                  : "border-gray-200 hover:border-primary-300"
              }`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`p-2 rounded-lg ${getSeverityColor(
                    alert.severity
                  )}`}
                >
                  {getSeverityIcon(alert.severity)}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {alert.message}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(
                            alert.severity
                          )}`}
                        >
                          {alert.severity}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                            alert.type
                          )}`}
                        >
                          <div className="flex items-center space-x-1">
                            {getTypeIcon(alert.type)}
                            <span className="capitalize">{alert.type}</span>
                          </div>
                        </span>
                        {alert.resolved && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full text-green-600 bg-green-100">
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>Resolved</span>
                            </div>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <span>Source: {alert.source}</span>
                        <span>•</span>
                        <span>
                          {new Date(alert.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {!alert.resolved && (
                      <>
                        <button className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors">
                          Take Action
                        </button>
                        <button
                          onClick={() => handleDismissAlert(alert.id)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                    {alert.resolved && (
                      <button
                        onClick={() => handleDismissAlert(alert.id)}
                        className="px-4 py-2 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <X className="w-4 h-4 inline mr-1" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Alerts Found
          </h3>
          <p className="text-gray-600 mb-4">
            {filter.severity !== "all" ||
            filter.type !== "all" ||
            filter.resolved !== "all"
              ? "No alerts match your current filters."
              : "No alerts found for the selected brand."}
          </p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Refresh Alerts
          </button>
        </div>
      )}
    </div>
  );
}
