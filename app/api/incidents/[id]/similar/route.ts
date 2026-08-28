import { NextResponse } from "next/server";
import { driver } from "@/lib/cognodb";
import { queries } from "@/lib/queries";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = driver.session();

  try {
    const { id } = await params;

    const result = await session.run(
      queries.getSimilarIncidents,
      {
        incidentId: id,
      }
    );

    const incidents = result.records.map(
      (record) => ({
        id: record.get("id"),
        title: record.get("title"),
        description: record.get("description"),
        severity: record.get("severity"),
        status: record.get("status"),
        createdAt: record.get("createdAt"),
      })
    );

    return NextResponse.json({
      success: true,
      incidentId: id,
      data: incidents,
    });
  } catch (error) {
    console.error(
      "Failed to fetch similar incidents:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch similar incidents",
      },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}