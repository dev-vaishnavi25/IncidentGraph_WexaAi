import { NextResponse } from "next/server";
import { driver } from "@/lib/cognodb";
import { queries } from "@/lib/queries";
import {
  serializeNode,
  serializePath,
} from "@/lib/graphSerializer";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = driver.session();

  try {
    const { id } = await params;

    const result = await session.run(
      queries.getIncidentGraph,
      {
        incidentId: id,
      }
    );

    if (result.records.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Incident graph not found",
        },
        { status: 404 }
      );
    }

    const record = result.records[0];

    const rawNodes = record.get("nodes");
    const rawPaths = record.get("paths");

    const nodesMap = new Map<string, any>();

    for (const node of rawNodes) {
      const serializedNode = serializeNode(node);

      nodesMap.set(
        serializedNode.id,
        serializedNode
      );
    }

    const edgesMap = new Map<string, any>();

    for (const path of rawPaths) {
      const edges = serializePath(path);

      for (const edge of edges) {
        edgesMap.set(edge.id, edge);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        nodes: Array.from(nodesMap.values()),
        edges: Array.from(edgesMap.values()),
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch incident graph:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch incident graph",
      },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}