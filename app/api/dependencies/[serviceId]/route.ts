import { NextResponse } from "next/server";
import { driver } from "@/lib/cognodb";
import { queries } from "@/lib/queries";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  const session = driver.session();

  try {
    const { serviceId } = await params;

    const result = await session.run(
      queries.getServiceDependencies,
      {
        serviceId,
      }
    );

    const dependencies = result.records.map(
      (record) => ({
        id: record.get("id"),
        name: record.get("name"),
        description: record.get("description"),
      })
    );

    return NextResponse.json({
      success: true,
      serviceId,
      data: dependencies,
    });
  } catch (error) {
    console.error(
      "Failed to fetch dependencies:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch service dependencies",
      },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}