import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const flowUrl = process.env.POWER_AUTOMATE_LSM_REQUEST_URL;

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
      requestDate: body.requestDate,
      storeLocation: body.storeLocation,
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone || "",
      lsmTypes: body.lsmTypes,
      desiredMessage: body.desiredMessage,
      couponOffers: body.couponOffers || "",
      couponExpirationDate: body.couponExpirationDate || "",
      specialInstructions: body.specialInstructions || "",
      sizeWidth: body.sizeWidth || "",
      sizeHeight: body.sizeHeight || "",
      color: body.color || [],
      fileType: body.fileType || [],
      quantity: body.quantity || "",
      fileSpecialInstructions: body.fileSpecialInstructions || "",
      desired1stRoundDate: body.desired1stRoundDate || "",
      artDueDate: body.artDueDate || "",
      publicationStartDate: body.publicationStartDate || "",
      additionalInstructions: body.additionalInstructions || "",
    };

    const response = await fetch(flowUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to submit to Power Automate" },
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
