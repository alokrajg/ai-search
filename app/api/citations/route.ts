import { NextResponse } from "next/server";

// Mock data for demonstration
const mockCitations = [
  {
    id: 1,
    url: "/products/ai-tool",
    engine: "ChatGPT",
    snippet:
      "This AI tool provides advanced features for content optimization...",
    timestamp: "2024-01-15T10:30:00Z",
    confidence: 0.95,
  },
  {
    id: 2,
    url: "/blog/geo-guide",
    engine: "Perplexity",
    snippet: "Learn how to optimize your content for AI search engines...",
    timestamp: "2024-01-15T09:15:00Z",
    confidence: 0.87,
  },
  {
    id: 3,
    url: "/pricing",
    engine: "Bing Chat",
    snippet: "Our pricing starts at $29/month for basic features...",
    timestamp: "2024-01-15T08:45:00Z",
    confidence: 0.92,
  },
];

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      data: mockCitations,
      total: mockCitations.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch citations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Simulate adding a new citation
    const newCitation = {
      id: Date.now(),
      ...body,
      timestamp: new Date().toISOString(),
      confidence: Math.random() * 0.3 + 0.7, // Random confidence between 0.7-1.0
    };

    return NextResponse.json({
      success: true,
      data: newCitation,
      message: "Citation added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to add citation" },
      { status: 500 }
    );
  }
}
