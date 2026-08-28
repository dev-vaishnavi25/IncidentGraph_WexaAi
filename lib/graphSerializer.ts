export function serializeNode(node: any) {
  const properties = node.properties ?? {};
  const labels = node.labels ?? [];

  return {
    id: properties.id ?? node.elementId,
    type: labels[0] ?? "Unknown",
    label:
      properties.name ??
      properties.title ??
      properties.action ??
      properties.id ??
      "Unknown",
    properties,
  };
}

export function serializePath(path: any) {
  const edges: any[] = [];

  for (const segment of path.segments ?? []) {
    const relationship = segment.relationship;

    edges.push({
      id: relationship.elementId,
      source: segment.start.properties?.id ?? segment.start.elementId,
      target: segment.end.properties?.id ?? segment.end.elementId,
      type: relationship.type,
    });
  }

  return edges;
}