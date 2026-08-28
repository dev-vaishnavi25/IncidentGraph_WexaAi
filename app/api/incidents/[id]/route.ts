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
      queries.getIncidentById,
      {
        incidentId: id,
      }
    );

    if (result.records.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Incident not found",
        },
        { status: 404 }
      );
    }

    const record = result.records[0];

    const incident = record.get("incident");
    const services = record.get("services");
    const errors = record.get("errors");
    const rootCauses = record.get("rootCauses");
    const resolutions = record.get("resolutions");

    return NextResponse.json({
      success: true,
      data: {
        incident,
        services,
        errors,
        rootCauses,
        resolutions,
      },
    });
  } catch (error) {
    console.error("Failed to fetch incident:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch incident",
      },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}