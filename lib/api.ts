/**
 * API Service for GEO Search Platform
 * Handles all backend communication
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface Brand {
  id: string;
  name: string;
  domains: string[];
  canonical_pages: string[];
  canonical_facts: Record<string, any>;
  created_at: string;
}

export interface Query {
  id: string;
  brand_id: string;
  text: string;
  category: "product-help" | "brand-info" | "competitor" | "general";
  engine_targets: string[];
  active: boolean;
  created_at: string | null;
}

export interface Citation {
  id: string;
  query_id: string;
  brand_id: string;
  engine: string;
  response_text: string;
  citation_url: string;
  citation_text: string;
  relevance_score: number;
  created_at: string;
}

export interface VisibilityMetrics {
  date: string;
  citations_count: number;
  unique_pages: number;
  visibility_score: number;
  engine_breakdown: Record<string, number>;
  top_pages?: Array<{
    url: string;
    citations: number;
    relevance_score: number;
  }>;
  trend_data?: Array<{
    date: string;
    citations: number;
    pages: number;
  }>;
}

export interface Alert {
  id: string;
  brand_id: string;
  type: "misinformation" | "citation" | "optimization";
  severity: "low" | "medium" | "high";
  message: string;
  source: string;
  created_at: string;
  resolved: boolean;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`Making API request to: ${url}`);

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`API response for ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Brand Management
  async getBrands(): Promise<Brand[]> {
    return this.request<Brand[]>("/brands/");
  }

  async getBrand(brandId: string): Promise<Brand> {
    return this.request<Brand>(`/brands/${brandId}`);
  }

  async createBrand(brandData: Partial<Brand>): Promise<{ brand_id: string }> {
    return this.request<{ brand_id: string }>("/brands/", {
      method: "POST",
      body: JSON.stringify(brandData),
    });
  }

  // Query Management
  async getQueries(brandId?: string): Promise<Query[]> {
    const endpoint = brandId ? `/queries/brand/${brandId}` : "/queries/";
    return this.request<Query[]>(endpoint);
  }

  async createQuery(queryData: Partial<Query>): Promise<{ query_id: string }> {
    return this.request<{ query_id: string }>("/queries/", {
      method: "POST",
      body: JSON.stringify(queryData),
    });
  }

  // Citation Management
  async getCitations(brandId?: string, queryId?: string): Promise<Citation[]> {
    let endpoint = "/citations/";
    const params = new URLSearchParams();

    if (brandId) params.append("brand_id", brandId);
    if (queryId) params.append("query_id", queryId);

    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    return this.request<Citation[]>(endpoint);
  }

  // Visibility Metrics
  async getVisibilityMetrics(brandId: string): Promise<VisibilityMetrics> {
    return this.request<VisibilityMetrics>(
      `/visibility/brand/${brandId}/current`
    );
  }

  async getVisibilityTimeSeries(
    brandId: string,
    startDate?: string,
    endDate?: string
  ): Promise<VisibilityMetrics["trend_data"]> {
    let endpoint = `/visibility/brand/${brandId}/time-series`;
    const params = new URLSearchParams();

    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    return this.request<VisibilityMetrics["trend_data"]>(endpoint);
  }

  async getTopPages(
    brandId: string,
    limit: number = 10
  ): Promise<VisibilityMetrics["top_pages"]> {
    return this.request<VisibilityMetrics["top_pages"]>(
      `/visibility/brand/${brandId}/top-pages?limit=${limit}`
    );
  }

  // Alerts Management
  async getAlerts(brandId?: string): Promise<Alert[]> {
    const endpoint = brandId ? `/alerts/brand/${brandId}` : "/alerts/";
    return this.request<Alert[]>(endpoint);
  }

  async createAlert(alertData: Partial<Alert>): Promise<{ alert_id: string }> {
    return this.request<{ alert_id: string }>("/alerts/", {
      method: "POST",
      body: JSON.stringify(alertData),
    });
  }

  async updateAlert(alertId: string, updates: Partial<Alert>): Promise<void> {
    return this.request<void>(`/alerts/${alertId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  // Debug & Testing
  async testConnection(): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>("/debug/health");
  }

  async triggerQueryRun(brandId: string): Promise<{ run_id: string }> {
    return this.request<{ run_id: string }>(
      `/debug/trigger-run?brand_id=${brandId}`,
      {
        method: "POST",
      }
    );
  }

  async getSchedulerStatus(): Promise<{ status: string; next_run: string }> {
    return this.request<{ status: string; next_run: string }>(
      "/debug/scheduler/status"
    );
  }

  // Dashboard metrics
  async getDashboardMetrics(brandId: string): Promise<any> {
    try {
      return await this.request<any>(`/dashboard/dashboard/metrics/${brandId}`);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      // Return empty data structure instead of hardcoded values
      return {
        brandVisibilityScore: 0,
        totalCitationsCount: 0,
        queryCoverage: 0,
        visibilityRank: 0,
        engineBreakdown: {},
        visibilityTrend: 0,
        topCitedPages: [],
        topPerformingQueries: [],
        averageCitationConfidence: 0,
        correctCitationRatio: 0,
        confidenceTrend: 0,
        accuracyTrend: 0,
        totalQueries: 0,
        activeQueries: 0,
        uniquePages: 0,
        lastUpdated: new Date().toISOString().split("T")[0],
        visibilityTrendData: [{ day: "No Data", visibility: 0 }],
      };
    }
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Utility functions for data transformation
export const transformVisibilityData = (data: VisibilityMetrics) => {
  return {
    totalCitations: data.citations_count,
    uniquePages: data.unique_pages,
    avgRelevanceScore: data.visibility_score,
    engineBreakdown: data.engine_breakdown,
    topPages: data.top_pages,
    trendData: data.trend_data,
  };
};

export const transformAlertData = (alerts: Alert[]) => {
  return alerts.map((alert) => ({
    id: alert.id,
    type: alert.type,
    severity: alert.severity,
    message: alert.message,
    source: alert.source,
    time: new Date(alert.created_at).toLocaleString(),
    resolved: alert.resolved,
  }));
};

export const transformCitationData = (citations: Citation[]) => {
  return citations.map((citation) => ({
    id: citation.id,
    engine: citation.engine,
    responseText: citation.response_text,
    citationUrl: citation.citation_url,
    citationText: citation.citation_text,
    relevanceScore: citation.relevance_score,
    createdAt: new Date(citation.created_at).toLocaleString(),
  }));
};
