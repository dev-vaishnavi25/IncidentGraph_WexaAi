import { NextResponse } from "next/server";
import { driver } from "@/lib/cognodb";
import { queries } from "@/lib/queries";

export async function GET() {
  const session = driver.session();

  try {
    const result = await session.run(queries.getIncidents);

    const incidents = result.records.map((record) => ({
      id: record.get("id"),
      title: record.get("title"),
      description: record.get("description"),
      severity: record.get("severity"),
      status: record.get("status"),
      createdAt: record.get("createdAt"),
    }));

    return NextResponse.json({
      success: true,
      data: incidents,
    });
  } catch (error) {
    console.error("Failed to fetch incidents:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch incidents",
      },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}