"use client";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  Handle,
  Position,
  type Node,
  type Edge,
} from "reactflow";

import "reactflow/dist/style.css";

interface GraphNodeData {
  label: string;
  type: string;
  description?: string;
  properties?: Record<string, any>;
}

interface IncidentGraphProps {
  nodes: Node<GraphNodeData>[];
  edges: Edge[];
  onNodeClick?: (node: Node<GraphNodeData>) => void;
}

/*
 * Get visual styling based on node type.
 */
function getNodeStyle(type: string) {
  switch (type) {
    case "Incident":
      return {
        border: "border-red-500/60",
        background: "bg-red-500/10",
        text: "text-red-400",
        glow: "shadow-[0_0_25px_rgba(239,68,68,0.12)]",
      };

    case "Service":
      return {
        border: "border-blue-500/60",
        background: "bg-blue-500/10",
        text: "text-blue-400",
        glow: "shadow-[0_0_25px_rgba(59,130,246,0.12)]",
      };

    case "API":
      return {
        border: "border-violet-500/60",
        background: "bg-violet-500/10",
        text: "text-violet-400",
        glow: "shadow-[0_0_25px_rgba(139,92,246,0.12)]",
      };

    case "Database":
      return {
        border: "border-cyan-500/60",
        background: "bg-cyan-500/10",
        text: "text-cyan-400",
        glow: "shadow-[0_0_25px_rgba(6,182,212,0.12)]",
      };

    case "Error":
      return {
        border: "border-orange-500/60",
        background: "bg-orange-500/10",
        text: "text-orange-400",
        glow: "shadow-[0_0_25px_rgba(249,115,22,0.12)]",
      };

    case "RootCause":
      return {
        border: "border-yellow-500/60",
        background: "bg-yellow-500/10",
        text: "text-yellow-400",
        glow: "shadow-[0_0_25px_rgba(234,179,8,0.12)]",
      };

    case "Resolution":
      return {
        border: "border-emerald-500/60",
        background: "bg-emerald-500/10",
        text: "text-emerald-400",
        glow: "shadow-[0_0_25px_rgba(16,185,129,0.12)]",
      };

    default:
      return {
        border: "border-slate-600",
        background: "bg-slate-800",
        text: "text-slate-300",
        glow: "shadow-[0_0_20px_rgba(100,116,139,0.1)]",
      };
  }
}

/*
 * Custom graph node.
 */
function GraphNode({
  data,
}: {
  data: GraphNodeData;
}) {
  const style = getNodeStyle(data.type);

  return (
    <div
      className={`
        relative
        min-w-[210px]
        rounded-2xl
        border
        ${style.border}
        ${style.background}
        ${style.glow}
        px-5
        py-4
        backdrop-blur-xl
        transition-all
        duration-200
        hover:scale-[1.02]
        hover:shadow-2xl
      `}
    >
      {/* Incoming connection */}
      <Handle
        type="target"
        position={Position.Left}
        className="
          !h-2.5
          !w-2.5
          !border-2
          !border-slate-950
          !bg-slate-400
        "
      />

      {/* Node type */}
      <div
        className={`
          flex
          items-center
          gap-2
          text-[10px]
          font-bold
          uppercase
          tracking-[0.18em]
          ${style.text}
        `}
      >
        <span
          className={`
            h-1.5
            w-1.5
            rounded-full
            ${style.text.replace("text-", "bg-")}
          `}
        />

        {data.type}
      </div>

      {/* Node title */}
      <div className="mt-2 max-w-[220px] text-sm font-semibold leading-5 text-white">
        {data.label}
      </div>

      {/* Description */}
      {data.description && (
        <div className="mt-2 max-w-[220px] text-[11px] leading-5 text-slate-400">
          {data.description}
        </div>
      )}

      {/* Outgoing connection */}
      <Handle
        type="source"
        position={Position.Right}
        className="
          !h-2.5
          !w-2.5
          !border-2
          !border-slate-950
          !bg-slate-400
        "
      />
    </div>
  );
}

const nodeTypes = {
  graphNode: GraphNode,
};

/*
 * Create a relationship-aware layout.
 *
 * We don't hardcode node IDs.
 * We only use the node TYPE and the relationships.
 */
function createGraphLayout(
  nodes: Node<GraphNodeData>[],
  edges: Edge[]
): Node<GraphNodeData>[] {
  if (!nodes.length) {
    return [];
  }

  const positions = new Map<
    string,
    { x: number; y: number }
  >();

  /*
   * First identify the incident.
   */
  const incident = nodes.find(
    (node) => node.data?.type === "Incident"
  );

  /*
   * Service nodes.
   */
  const services = nodes.filter(
    (node) => node.data?.type === "Service"
  );

  /*
   * API nodes.
   */
  const apis = nodes.filter(
    (node) => node.data?.type === "API"
  );

  /*
   * Database nodes.
   */
  const databases = nodes.filter(
    (node) => node.data?.type === "Database"
  );

  /*
   * Error nodes.
   */
  const errors = nodes.filter(
    (node) => node.data?.type === "Error"
  );

  /*
   * Root causes.
   */
  const rootCauses = nodes.filter(
    (node) => node.data?.type === "RootCause"
  );

  /*
   * Resolutions.
   */
  const resolutions = nodes.filter(
    (node) => node.data?.type === "Resolution"
  );

  /*
   * Main horizontal investigation flow.
   */
  if (incident) {
    positions.set(incident.id, {
      x: 0,
      y: 220,
    });
  }

  services.forEach((node, index) => {
    positions.set(node.id, {
      x: 300,
      y: 220 + index * 180,
    });
  });

  apis.forEach((node, index) => {
    positions.set(node.id, {
      x: 620,
      y: 80 + index * 180,
    });
  });

  databases.forEach((node, index) => {
    positions.set(node.id, {
      x: 620,
      y: 360 + index * 180,
    });
  });

  errors.forEach((node, index) => {
    positions.set(node.id, {
      x: 940,
      y: 360 + index * 180,
    });
  });

  rootCauses.forEach((node, index) => {
    positions.set(node.id, {
      x: 1260,
      y: 360 + index * 180,
    });
  });

  resolutions.forEach((node, index) => {
    positions.set(node.id, {
      x: 1580,
      y: 360 + index * 180,
    });
  });

  /*
   * Any future/unknown node type gets
   * placed automatically instead of being lost.
   */
  const unpositioned = nodes.filter(
    (node) => !positions.has(node.id)
  );

  unpositioned.forEach((node, index) => {
    positions.set(node.id, {
      x: 300 + (index % 3) * 320,
      y: 700 + Math.floor(index / 3) * 180,
    });
  });

  /*
   * Return new nodes with calculated positions.
   */
  return nodes.map((node) => ({
    ...node,
    position: positions.get(node.id) || {
      x: 0,
      y: 0,
    },
  }));
}

export default function IncidentGraph({
  nodes,
  edges,
  onNodeClick,
}: IncidentGraphProps) {
  /*
   * Calculate positions from the dynamic
   * API response.
   */
  const positionedNodes = createGraphLayout(
    nodes,
    edges
  );

  return (
    <div className="h-[520px] w-full overflow-hidden rounded-b-2xl bg-[#050d19]">
      <ReactFlow
        nodes={positionedNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.25,
          maxZoom: 1.1,
        }}
        minZoom={0.35}
        maxZoom={1.8}
        attributionPosition="bottom-right"
        onNodeClick={(_, node) => {
          onNodeClick?.(
            node as Node<GraphNodeData>
          );
        }}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
          style: {
            stroke: "#64748b",
            strokeWidth: 1.7,
          },
          labelStyle: {
            fill: "#94a3b8",
            fontSize: 10,
            fontWeight: 600,
          },
          labelBgStyle: {
            fill: "#020817",
          },
          labelBgPadding: [6, 3],
          labelBgBorderRadius: 6,
        }}
      >
        <Background
          gap={24}
          size={1}
          color="#1e293b"
        />

        <Controls
          showInteractive={false}
          className="
            !overflow-hidden
            !rounded-xl
            !border
            !border-slate-700
            !bg-slate-900/90
            !shadow-xl
          "
        />

        <MiniMap
          nodeColor={(node) => {
            switch (node.data?.type) {
              case "Incident":
                return "#ef4444";

              case "Service":
                return "#3b82f6";

              case "API":
                return "#8b5cf6";

              case "Database":
                return "#06b6d4";

              case "Error":
                return "#f97316";

              case "RootCause":
                return "#eab308";

              case "Resolution":
                return "#10b981";

              default:
                return "#64748b";
            }
          }}
          maskColor="rgba(2, 8, 23, 0.72)"
          className="
            !rounded-xl
            !border
            !border-slate-700
            !bg-slate-900
          "
        />
      </ReactFlow>
    </div>
  );
}