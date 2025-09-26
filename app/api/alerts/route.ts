import { NextResponse } from "next/server";

// Mock alerts data
const mockAlerts = [
  {
    id: 1,
    type: "misinformation",
    severity: "high",
    message:
      "AI engine incorrectly states pricing as $99/month instead of $29/month",
    source: "ChatGPT",
    time: "2 hours ago",
    status: "active",
    recommendedAction: "Publish correction and add canonical FAQ",
  },
  {
    id: 2,
    type: "citation",
    severity: "medium",
    message:
      'Competitor cited instead of your product page for "AI content tools"',
    source: "Perplexity",
    time: "5 hours ago",
    status: "active",
    recommendedAction: "Optimize product page for better AI visibility",
  },
  {
    id: 3,
    type: "optimization",
    severity: "low",
    message: "New optimization suggestion available for /features page",
    source: "System",
    time: "1 day ago",
    status: "pending",
    recommendedAction: "Review and apply suggested changes",
  },
];

export async function GET() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      data: mockAlerts,
      total: mockAlerts.length,
      activeAlerts: mockAlerts.filter((alert) => alert.status === "active")
        .length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Simulate creating a new alert
    const newAlert = {
      id: Date.now(),
      ...body,
      time: "Just now",
      status: "active",
    };

    return NextResponse.json({
      success: true,
      data: newAlert,
      message: "Alert created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create alert" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    // Simulate updating alert status
    return NextResponse.json({
      success: true,
      message: `Alert ${id} updated to ${status}`,
      data: { id, status },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update alert" },
      { status: 500 }
    );
  }
}
