import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const flowUrl = process.env.POWER_AUTOMATE_STORE_HOURS_URL;

  if (!flowUrl) {
    return NextResponse.json(
      { error: "Power Automate URL not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const changeType = body.changeType || "new_hours";

    const hoursFlat: Record<string, string> = {};
    if (changeType === "new_hours" && body.hours) {
      const dayKeys = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const hours = body.hours as { day: string; startTime: string; endTime: string }[];

      for (const h of hours) {
        const prefix = dayKeys.find((k) =>
          h.day.toLowerCase().startsWith(k.toLowerCase())
        );
        if (prefix) {
          hoursFlat[`${prefix}_Start`] = h.startTime;
          hoursFlat[`${prefix}_End`] = h.endTime;
        }
      }
    }

    const payload: Record<string, unknown> = {
      id: body.id,
      storeName: Array.isArray(body.storeName) ? body.storeName.join(", ") : body.storeName,
      managerName: body.managerName,
      managerEmail: body.managerEmail,
      changeType,
      ...hoursFlat,
    };

    if (changeType === "temporary_close") {
      payload.changeDate = body.changeDate;
      payload.changeNote = body.changeNote;
    }

    if (changeType === "holiday_hours" && body.holidays) {
      payload.holidays = JSON.stringify(body.holidays);
    }

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
