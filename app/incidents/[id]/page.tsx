"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  AlertTriangle,
  Network,
} from "lucide-react";
import type { Node, Edge } from "reactflow";
import IncidentGraph from "@/components/IncidentGraph";
import dagre from "@dagrejs/dagre";

interface IncidentPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface ApiNode {
  id: string;
  type: string;
  label: string;
  properties: Record<string, any>;
}

interface ApiEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

interface GraphNodeData {
  label: string;
  type: string;
  description?: string;
  properties?: Record<string, any>;
}

const NODE_WIDTH = 210;
const NODE_HEIGHT = 100;

/*
 * Automatically calculates positions
 * based on graph relationships.
 */
function getLayoutedElements(
  nodes: Node<GraphNodeData>[],
  edges: Edge[]
) {
  const graph = new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(() => ({}));

  graph.setGraph({
    rankdir: "LR",
    ranksep: 100,
    nodesep: 70,
    marginx: 40,
    marginy: 40,
  });

  nodes.forEach((node) => {
    graph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  const layoutedNodes = nodes.map((node) => {
    const position = graph.node(node.id);

    return {
      ...node,
      position: {
        x: position.x - NODE_WIDTH / 2,
        y: position.y - NODE_HEIGHT / 2,
      },
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
}



export default function IncidentPage({
  params,
}: IncidentPageProps) {
  const router = useRouter();

  const { id } = use(params);

  const [graphNodes, setGraphNodes] = useState<
    Node<GraphNodeData>[]
  >([]);

  const [graphEdges, setGraphEdges] = useState<Edge[]>(
    []
  );

  const [selectedNode, setSelectedNode] =
    useState<Node<GraphNodeData> | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  

  /*
   * Load graph dynamically from CognoDB API
   */
  useEffect(() => {
    const loadGraph = async () => {
      try {
        setLoading(true);
        setError("");
        setSelectedNode(null);

        const response = await fetch(
          `/api/incidents/${encodeURIComponent(id)}/graph`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to load incident graph"
          );
        }

        const apiNodes: ApiNode[] =
          result.data.nodes || [];

        const apiEdges: ApiEdge[] =
          result.data.edges || [];

        /*
         * Convert API nodes into React Flow nodes.
         *
         * No hardcoded node IDs.
         * No hardcoded positions.
         */
        const flowNodes: Node<GraphNodeData>[] =
          apiNodes.map((node) => ({
            id: node.id,

            type: "graphNode",

            position: {
              x: 0,
              y: 0,
            },

            data: {
              label: node.label,
              type: node.type,

              description:
                node.properties?.description ||
                node.properties?.message ||
                node.properties?.action ||
                "",

              properties: node.properties || {},
            },
          }));

        /*
         * Convert API relationships into
         * React Flow edges.
         */
        const flowEdges: Edge[] =
          apiEdges.map((edge) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,

            label: edge.type,

            type: "smoothstep",

            animated: true,
          }));

        /*
         * Automatically arrange the graph
         * using Dagre.
         */
        const layouted = getLayoutedElements(
          flowNodes,
          flowEdges
        );

        setGraphNodes(layouted.nodes);
        setGraphEdges(layouted.edges);
      } catch (err) {
        console.error(
          "Failed to load incident graph:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load incident graph"
        );
      } finally {
        setLoading(false);
      }
    };

    loadGraph();
  }, [id]);

  /*
   * Find incident dynamically.
   */
  const incidentNode = graphNodes.find(
    (node) =>
      node.data?.type?.toLowerCase() === "incident"
  );

  /*
   * Find root cause dynamically.
   */
  const rootCauseNode = graphNodes.find(
    (node) =>
      node.data?.type?.toLowerCase() ===
      "rootcause"
  );

  /*
   * Find resolution dynamically.
   */
  const resolutionNode = graphNodes.find(
    (node) =>
      node.data?.type?.toLowerCase() ===
      "resolution"
  );

  /*
   * Incident properties come directly
   * from the API response.
   */
  const incidentProperties =
    incidentNode?.data?.properties || {};

  return (
    <div className="min-h-screen bg-[#020817] text-white">

      {/* ================= TOPBAR ================= */}

      <header className="flex h-[72px] items-center border-b border-slate-800/80 bg-[#020b1a] px-8">

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-lg border border-slate-800 px-4 py-2 text-sm text-slate-400 transition hover:border-slate-700 hover:text-white"
        >
          <ArrowLeft size={17} />

          Back to incidents
        </button>

        <div className="ml-6 flex items-center gap-2">

          <Network
            size={22}
            className="text-violet-400"
          />

          <span className="font-semibold">
            Incident
            <span className="text-violet-400">
              Graph
            </span>
          </span>

        </div>

        <div className="ml-auto flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2">

          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#22c55e]" />

          <span className="text-sm text-emerald-400">
            CognoDB Connected
          </span>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-[1400px] px-8 py-8">

        {/* ================= HEADING ================= */}

        <div className="mb-8">

          <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Incident Investigation
          </p>

          <div className="mt-2 flex items-center gap-4">

            <h1 className="text-3xl font-bold tracking-tight">
              {id}
            </h1>

            {incidentProperties.severity && (
              <span className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
                {incidentProperties.severity}
              </span>
            )}

          </div>

          <p className="mt-2 text-sm text-slate-400">
            Trace the connected system relationships
            to understand what caused this incident
            and how it was resolved.
          </p>

        </div>

        {/* ================= LAYOUT ================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">

          {/* ================= GRAPH ================= */}

          <section className="min-h-[600px] rounded-2xl border border-slate-800 bg-[#07111f]">

            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">

              <div>

                <h2 className="font-semibold text-white">
                  Relationship Graph
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Live graph relationships from CognoDB
                </p>

              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">

                <Network size={15} />

                {graphNodes.length} Nodes

                <span className="text-slate-700">
                  •
                </span>

                {graphEdges.length} Relationships

              </div>

            </div>

            <div className="relative">

              {/* ================= LOADING ================= */}

              {loading && (
                <div className="flex h-[520px] items-center justify-center">

                  <div className="text-center">

                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-violet-400" />

                    <p className="mt-4 text-sm text-slate-400">
                      Loading incident graph...
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Querying CognoDB
                    </p>

                  </div>

                </div>
              )}

              {/* ================= ERROR ================= */}

              {!loading && error && (
                <div className="flex h-[520px] items-center justify-center">

                  <div className="max-w-md text-center">

                    <AlertTriangle
                      size={38}
                      className="mx-auto text-red-400"
                    />

                    <h3 className="mt-4 font-semibold text-white">
                      Unable to load graph
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {error}
                    </p>

                    <button
                      onClick={() =>
                        window.location.reload()
                      }
                      className="mt-5 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-violet-500/50 hover:text-white"
                    >
                      Retry
                    </button>

                  </div>

                </div>
              )}

              {/* ================= EMPTY ================= */}

              {!loading &&
                !error &&
                graphNodes.length === 0 && (
                  <div className="flex h-[520px] items-center justify-center">

                    <div className="text-center">

                      <Network
                        size={38}
                        className="mx-auto text-slate-600"
                      />

                      <h3 className="mt-4 font-semibold text-white">
                        No graph relationships found
                      </h3>

                      <p className="mt-2 text-sm text-slate-500">
                        This incident has no connected
                        entities in CognoDB.
                      </p>

                    </div>

                  </div>
                )}

              {/* ================= GRAPH ================= */}

              {!loading &&
                !error &&
                graphNodes.length > 0 && (
                  <IncidentGraph
                    nodes={graphNodes}
                    edges={graphEdges}
                    onNodeClick={(node) => {
                      setSelectedNode(node);
                    }}
                  />
                )}

              {/* ================= LEGEND ================= */}

              {!loading &&
                !error &&
                graphNodes.length > 0 && (
                  <div className="absolute bottom-5 left-5 rounded-xl border border-slate-800 bg-[#07111f]/95 px-4 py-3 backdrop-blur">

                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Node Types
                    </p>

                    <div className="flex max-w-[450px] flex-wrap gap-3">

                      {Array.from(
                        new Set(
                          graphNodes.map(
                            (node) =>
                              node.data?.type
                          )
                        )
                      ).map((type) => (
                        <span
                          key={type}
                          className="text-[10px] text-slate-400"
                        >
                          ● {type}
                        </span>
                      ))}

                    </div>

                  </div>
                )}

            </div>

          </section>

          {/* ================= SIDEBAR ================= */}

          <aside className="space-y-4">

            {/* ================= SELECTED NODE ================= */}

            {selectedNode && (
              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">

                <div className="flex items-center justify-between">

                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                    Selected Node
                  </p>

                  <button
                    onClick={() =>
                      setSelectedNode(null)
                    }
                    className="text-xs text-slate-500 transition hover:text-white"
                  >
                    Close
                  </button>

                </div>

                {/* Node Type */}

                <div className="mt-4">

                  <span className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {selectedNode.data?.type}
                  </span>

                </div>

                {/* Node Label */}

                <h3 className="mt-3 text-lg font-semibold text-white">
                  {selectedNode.data?.label}
                </h3>

                {/* Description */}

                {selectedNode.data?.description && (
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {selectedNode.data.description}
                  </p>
                )}

                {/* Dynamic Properties */}

                {selectedNode.data?.properties &&
                  Object.keys(
                    selectedNode.data.properties
                  ).length > 0 && (
                    <div className="mt-5 border-t border-slate-800 pt-4">

                      <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Properties
                      </p>

                      <div className="space-y-3">

                        {Object.entries(
                          selectedNode.data.properties
                        ).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-start justify-between gap-4"
                          >

                            <span className="text-xs capitalize text-slate-500">
                              {key.replace(
                                /([A-Z])/g,
                                " $1"
                              )}
                            </span>

                            <span className="max-w-[190px] break-words text-right text-xs font-medium text-slate-300">
                              {String(value)}
                            </span>

                          </div>
                        ))}

                      </div>

                    </div>
                  )}

              </div>
            )}

            {/* ================= INCIDENT SUMMARY ================= */}

            <div className="rounded-2xl border border-slate-800 bg-[#07111f] p-5">

              <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                Incident
              </p>

              <h3 className="mt-3 font-semibold text-white">
                {incidentNode?.data?.label || id}
              </h3>

              <div className="mt-4 space-y-3">

                <div className="flex items-center justify-between">

                  <span className="text-sm text-slate-500">
                    Status
                  </span>

                  <span className="text-sm font-medium text-emerald-400">
                    {incidentProperties.status ||
                      "Unknown"}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-sm text-slate-500">
                    Severity
                  </span>

                  <span className="text-sm font-medium text-red-400">
                    {incidentProperties.severity ||
                      "Unknown"}
                  </span>

                </div>

              </div>

              {incidentProperties.description && (
                <p className="mt-4 border-t border-slate-800 pt-4 text-sm leading-6 text-slate-400">
                  {incidentProperties.description}
                </p>
              )}

            </div>

            {/* ================= ROOT CAUSE ================= */}

            {rootCauseNode && (
              <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">

                <p className="text-xs font-semibold uppercase tracking-wider text-yellow-400">
                  Root Cause
                </p>

                <h3 className="mt-2 font-semibold text-white">
                  {rootCauseNode.data?.label}
                </h3>

                {rootCauseNode.data?.description && (
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {rootCauseNode.data.description}
                  </p>
                )}

              </div>
            )}

            {/* ================= RESOLUTION ================= */}

            {resolutionNode && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">

                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Resolution
                </p>

                <h3 className="mt-2 font-semibold text-white">
                  {resolutionNode.data?.label}
                </h3>

                {resolutionNode.data?.description && (
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {resolutionNode.data.description}
                  </p>
                )}

              </div>
            )}

          </aside>

        </div>

      </main>

    </div>
  );
}