// Quick verification script to check query processing status
const API_BASE = "http://localhost:8000/api/v1";

async function verifyProcessing() {
  console.log("🔍 Verifying Query Processing Status...\n");

  try {
    // Check Zudio brand visibility
    const visibilityResponse = await fetch(
      `${API_BASE}/visibility/brand/v8ZznKlRWYMQkTZytgW6/current`
    );
    const visibilityData = await visibilityResponse.json();

    console.log("📊 Current Visibility Metrics:");
    console.log(`   Citations Count: ${visibilityData.citations_count}`);
    console.log(
      `   Visibility Score: ${(visibilityData.visibility_score * 100).toFixed(
        2
      )}%`
    );
    console.log(`   Unique Pages: ${visibilityData.unique_pages}`);
    console.log(`   Engine Breakdown:`, visibilityData.engine_breakdown);

    // Check total queries
    const queriesResponse = await fetch(
      `${API_BASE}/queries/brand/v8ZznKlRWYMQkTZytgW6`
    );
    const queriesData = await queriesResponse.json();

    console.log(`\n📝 Total Active Queries: ${queriesData.length}`);
    console.log("   Recent queries:");
    queriesData.slice(-3).forEach((query, index) => {
      console.log(`   ${index + 1}. ${query.text}`);
    });

    console.log("\n✅ Processing Status:");
    if (visibilityData.citations_count > 0) {
      console.log("   ✅ Queries have been processed");
      console.log("   ✅ Citations have been found");
      console.log("   ✅ Dashboard should show updated metrics");
    } else {
      console.log("   ⚠️  No citations found - queries may need processing");
    }
  } catch (error) {
    console.error("❌ Error verifying processing:", error.message);
  }
}

// Run verification
verifyProcessing();
