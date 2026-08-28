export const queries = {
  // -----------------------------
  // DATABASE SETUP
  // -----------------------------

  clearDatabase: `
    MATCH (n)
    DETACH DELETE n
  `,

  createConstraints: [
    `
      CREATE CONSTRAINT service_id IF NOT EXISTS
      FOR (s:Service)
      REQUIRE s.id IS UNIQUE
    `,
    `
      CREATE CONSTRAINT api_id IF NOT EXISTS
      FOR (a:API)
      REQUIRE a.id IS UNIQUE
    `,
    `
      CREATE CONSTRAINT database_id IF NOT EXISTS
      FOR (d:Database)
      REQUIRE d.id IS UNIQUE
    `,
    `
      CREATE CONSTRAINT error_id IF NOT EXISTS
      FOR (e:Error)
      REQUIRE e.id IS UNIQUE
    `,
    `
      CREATE CONSTRAINT incident_id IF NOT EXISTS
      FOR (i:Incident)
      REQUIRE i.id IS UNIQUE
    `,
    `
      CREATE CONSTRAINT rootcause_id IF NOT EXISTS
      FOR (r:RootCause)
      REQUIRE r.id IS UNIQUE
    `,
    `
      CREATE CONSTRAINT resolution_id IF NOT EXISTS
      FOR (r:Resolution)
      REQUIRE r.id IS UNIQUE
    `,
  ],

  // -----------------------------
  // INCIDENT QUERIES
  // -----------------------------

  getIncidents: `
    MATCH (i:Incident)
    RETURN
      i.id AS id,
      i.title AS title,
      i.description AS description,
      i.severity AS severity,
      i.status AS status,
      i.createdAt AS createdAt
    ORDER BY i.createdAt DESC
  `,

  getIncidentById: `
    MATCH (i:Incident {id: $incidentId})

    OPTIONAL MATCH (i)-[:AFFECTS]->(s:Service)
    OPTIONAL MATCH (i)-[:TRIGGERED_BY]->(e:Error)
    OPTIONAL MATCH (i)-[:CAUSED_BY]->(r:RootCause)
    OPTIONAL MATCH (r)-[:RESOLVED_BY]->(res:Resolution)

    RETURN
      i {
        .id,
        .title,
        .description,
        .severity,
        .status,
        .createdAt
      } AS incident,

      collect(DISTINCT s {
        .id,
        .name,
        .description
      }) AS services,

      collect(DISTINCT e {
        .id,
        .name,
        .message,
        .severity
      }) AS errors,

      collect(DISTINCT r {
        .id,
        .name,
        .description
      }) AS rootCauses,

      collect(DISTINCT res {
        .id,
        .action,
        .description
      }) AS resolutions
  `,

  // -----------------------------
  // INCIDENT GRAPH
  // -----------------------------

getIncidentGraph: `
  MATCH (i:Incident {id: $incidentId})

  OPTIONAL MATCH p1 =
    (i)-[:AFFECTS]->(s:Service)
    -[:EXPOSES]->(a:API)

  OPTIONAL MATCH p2 =
    (s)-[:USES]->(d:Database)

  OPTIONAL MATCH p3 =
    (i)-[:TRIGGERED_BY]->(e:Error)

  OPTIONAL MATCH p4 =
    (i)-[:CAUSED_BY]->(r:RootCause)
    -[:RESOLVED_BY]->(res:Resolution)

  WITH
    collect(DISTINCT i) +
    collect(DISTINCT s) +
    collect(DISTINCT a) +
    collect(DISTINCT d) +
    collect(DISTINCT e) +
    collect(DISTINCT r) +
    collect(DISTINCT res) AS nodes,

    collect(DISTINCT p1) +
    collect(DISTINCT p2) +
    collect(DISTINCT p3) +
    collect(DISTINCT p4) AS paths

  RETURN nodes, paths
`,

  // -----------------------------
  // DEPENDENCY TRAVERSAL
  // -----------------------------

  getServiceDependencies: `
    MATCH (s:Service {id: $serviceId})
          -[:DEPENDS_ON*1..4]->
          (downstream:Service)

    RETURN DISTINCT
      downstream.id AS id,
      downstream.name AS name,
      downstream.description AS description
    ORDER BY downstream.name
  `,

  // -----------------------------
  // SIMILAR INCIDENTS
  // -----------------------------

  getSimilarIncidents: `
    MATCH (i:Incident {id: $incidentId})
          -[:SIMILAR_TO]->
          (similar:Incident)

    RETURN
      similar.id AS id,
      similar.title AS title,
      similar.description AS description,
      similar.severity AS severity,
      similar.status AS status,
      similar.createdAt AS createdAt
    ORDER BY similar.createdAt DESC
  `,
};