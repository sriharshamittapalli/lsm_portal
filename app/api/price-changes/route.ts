import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const flowUrl = process.env.POWER_AUTOMATE_PRICE_CHANGE_URL;

  if (!flowUrl) {
    return NextResponse.json(
      { error: "Power Automate URL not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const payload = {
      id: body.id,
      storeName: body.storeName,
      managerName: body.managerName,
      managerEmail: body.managerEmail,
      currentPrice: body.currentPrice,
      updatedPrice: body.updatedPrice,
    };

    const response = await fetch(flowUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to submit to SharePoint" },
        { status: response.status }
      );
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}
