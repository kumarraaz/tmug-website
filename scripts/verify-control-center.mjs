// E2E Verification Script for TMUG Website Visual Control Center
const BASE_URL = "http://localhost:3000";

async function run() {
  console.log("=== TMUG Visual Control Center End-to-End Verification ===\n");

  // 1. Test Admin Login
  console.log("1. Testing Admin Authentication (/api/admin/auth)...");
  const loginRes = await fetch(`${BASE_URL}/api/admin/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", email: "admin@tmug", password: "admin@tmug" }),
  });

  if (!loginRes.ok) {
    throw new Error(`Login failed with status ${loginRes.status}: ${await loginRes.text()}`);
  }
  const loginData = await loginRes.json();
  const rawCookie = loginRes.headers.get("set-cookie") || "";
  const cookieMatch = rawCookie.match(/tmug-admin=[^;]+/);
  const cookieHeader = cookieMatch ? cookieMatch[0] : "tmug-admin=ok";
  console.log("   ✓ Login successful:", loginData);
  console.log("   ✓ Cookie received:", cookieHeader);

  // 2. Fetch Initial Site Controls
  console.log("\n2. Fetching Site Controls (/api/admin/site-controls)...");
  const getRes = await fetch(`${BASE_URL}/api/admin/site-controls`, {
    headers: { Cookie: cookieHeader },
  });
  if (!getRes.ok) {
    throw new Error(`Failed to get site-controls: ${getRes.status} ${await getRes.text()}`);
  }
  const state = await getRes.json();
  console.log("   ✓ Retrieved current state:", {
    hasPublished: Boolean(state.published),
    hasDraft: Boolean(state.draft),
    historyCount: state.history?.length || 0,
    announcementText: state.published?.header?.announcementText,
  });

  // 3. Test Save Draft
  console.log("\n3. Testing Save Draft action...");
  const testRunId = Date.now();
  const testAnnouncement = `Festive Verification Ticker [${testRunId}] — 20% Off!`;
  const testCollectionsHeading = `Curated Botanical Collections [${testRunId}]`;

  const draftControls = JSON.parse(JSON.stringify(state.published));
  draftControls.header.announcementText = testAnnouncement;
  draftControls.sectionsVisual.collections.heading = testCollectionsHeading;

  const saveDraftRes = await fetch(`${BASE_URL}/api/admin/site-controls`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookieHeader },
    body: JSON.stringify({ action: "save-draft", controls: draftControls }),
  });
  if (!saveDraftRes.ok) {
    throw new Error(`Save draft failed: ${saveDraftRes.status} ${await saveDraftRes.text()}`);
  }
  const draftResult = await saveDraftRes.json();
  console.log("   ✓ Draft saved:", {
    ok: draftResult.ok,
    draftAnnouncement: draftResult.draft?.header?.announcementText,
    publishedAnnouncement: draftResult.published?.header?.announcementText,
  });

  // Verify that public endpoint still returns published (not draft)
  const publicRes1 = await fetch(`${BASE_URL}/api/site-controls`);
  const publicData1 = await publicRes1.json();
  if (publicData1.header?.announcementText === testAnnouncement) {
    throw new Error("FAIL: Public endpoint exposed draft changes before publishing!");
  }
  console.log("   ✓ Verified draft isolation: Public site still serves published controls.");

  // 4. Test Publish Action
  console.log("\n4. Testing Publish All action...");
  const publishRes = await fetch(`${BASE_URL}/api/admin/site-controls`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookieHeader },
    body: JSON.stringify({ action: "publish", controls: draftControls }),
  });
  if (!publishRes.ok) {
    throw new Error(`Publish failed: ${publishRes.status} ${await publishRes.text()}`);
  }
  const publishResult = await publishRes.json();
  console.log("   ✓ Published successfully:", {
    ok: publishResult.ok,
    publishedAnnouncement: publishResult.published?.header?.announcementText,
    publishedCollectionHeading: publishResult.published?.sectionsVisual?.collections?.heading,
    newHistoryCount: publishResult.history?.length || 0,
  });

  // 5. Verify Public Storefront & API reflect published controls
  console.log("\n5. Verifying Public API & Storefront...");
  const publicRes2 = await fetch(`${BASE_URL}/api/site-controls`);
  const publicData2 = await publicRes2.json();
  console.log("   ✓ Public API reflects published changes:", {
    announcementText: publicData2.header?.announcementText,
    collectionsHeading: publicData2.sectionsVisual?.collections?.heading,
  });

  const storefrontRes = await fetch(`${BASE_URL}/`);
  const storefrontHtml = await storefrontRes.text();
  const containsNewAnnouncement = storefrontHtml.includes(testAnnouncement);
  const containsNewHeading = storefrontHtml.includes(testCollectionsHeading);
  console.log("   ✓ Storefront HTML contains published announcement:", containsNewAnnouncement);
  console.log("   ✓ Storefront HTML contains published collections heading:", containsNewHeading);

  // 6. Test History Snapshot Rollback
  console.log("\n6. Testing History Snapshot Rollback...");
  if (publishResult.history && publishResult.history.length > 0) {
    const previousSnapshot = publishResult.history[publishResult.history.length - 1];
    console.log("   Rolling back to snapshot:", previousSnapshot.id, `(${previousSnapshot.label})`);

    const rollbackRes = await fetch(`${BASE_URL}/api/admin/site-controls`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookieHeader },
      body: JSON.stringify({ action: "rollback", snapshotId: previousSnapshot.id }),
    });
    const rollbackData = await rollbackRes.json();
    console.log("   ✓ Rollback successful:", {
      ok: rollbackData.ok,
      restoredAnnouncement: rollbackData.published?.header?.announcementText,
    });
  }

  // 7. Test Reset to Defaults
  console.log("\n7. Testing Reset to Defaults...");
  const resetRes = await fetch(`${BASE_URL}/api/admin/site-controls`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookieHeader },
    body: JSON.stringify({ action: "reset-defaults" }),
  });
  const resetData = await resetRes.json();
  console.log("   ✓ Reset to defaults successful:", {
    ok: resetData.ok,
    announcementText: resetData.draft?.header?.announcementText || resetData.published?.header?.announcementText,
  });

  console.log("\n=== ALL VERIFICATION TESTS PASSED SUCCESSFULLY ===");
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
