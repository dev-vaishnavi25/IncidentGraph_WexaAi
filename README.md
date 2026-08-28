First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
IncidentGraph

IncidentGraph is a graph-based incident investigation platform that helps engineering teams understand production incidents by exploring relationships between incidents, services, APIs, databases, errors, root causes, and resolutions.

Instead of viewing an incident as an isolated record, IncidentGraph represents the connected system as a graph and allows engineers to visually trace relationships across multiple hops.

Overview

In a production environment, an incident can involve multiple interconnected components.

For example:

Incident
   │
   ▼
Service
   │
   ▼
API
   │
   ▼
Database
   │
   ▼
Error
   │
   ▼
Root Cause
   │
   ▼
Resolution

IncidentGraph retrieves these relationships from CognoDB using Cypher queries and renders them as an interactive graph.

Key Features
Graph-based incident investigation
CognoDB graph database integration
Parameterized Cypher queries
Multi-hop graph traversal
Relationship-heavy graph queries
REST API layer using Next.js Route Handlers
Dynamic incident-based graph generation
Interactive graph visualization using React Flow
Automatic graph layout using Dagre
Custom node types and styling
Node selection with dynamic properties
Loading state
Error state with retry
Empty graph state
Incident summary
Root cause and resolution information
Dynamic graph data without hardcoded node IDs or positions
Tech Stack
Frontend
Next.js 16
React
TypeScript
Tailwind CSS
React Flow
Dagre
Lucide React
Backend
Next.js Route Handlers
REST APIs
TypeScript
Database
CognoDB
Cypher
Development
npm
Next.js production build
Architecture
┌───────────────────────────────────────────────┐
│                  User / Engineer              │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│              Next.js Frontend                 │
│                                               │
│  Dashboard → Incident Detail → Graph UI      │
│                                               │
│  React + TypeScript + Tailwind + React Flow   │
└───────────────────────┬───────────────────────┘
                        │
                        │ REST API
                        ▼
┌───────────────────────────────────────────────┐
│          Next.js API Route Handlers            │
│                                               │
│  /api/incidents                               │
│  /api/incidents/[id]                          │
│  /api/incidents/[id]/graph                    │
│  /api/incidents/[id]/similar                  │
│  /api/dependencies/[serviceId]                │
│  /api/health                                  │
└───────────────────────┬───────────────────────┘
                        │
                        │ Parameterized Cypher
                        ▼
┌───────────────────────────────────────────────┐
│                   CognoDB                     │
│                                               │
│       Nodes + Relationships + Properties      │
└───────────────────────┬───────────────────────┘
                        │
                        │ Graph Data
                        ▼
┌───────────────────────────────────────────────┐
│             React Flow + Dagre                │
│                                               │
│       Interactive Relationship Graph          │
└───────────────────────────────────────────────┘
Graph Data Model

IncidentGraph models the incident ecosystem using graph nodes and relationships.

Node Types

The application supports graph entities such as:

Incident
Service
API
Database
Error
RootCause
Resolution

Each node contains:

ID
Type
Label
Properties

Example:

{
  "id": "service-payment",
  "type": "Service",
  "label": "Payment Service",
  "properties": {
    "description": "Handles payment processing"
  }
}
Relationships

Relationships connect the graph entities.

Example:

Incident ──► Service
Service ──► API
API ──► Database
Database ──► Error
Error ──► Root Cause
Root Cause ──► Resolution

The exact relationship type is returned from CognoDB and is displayed on the graph edge.

Multi-Hop Traversal

The application is designed to trace relationships beyond the directly connected node.

For example:

Incident
   │
   └── 1 hop ──► Service
                    │
                    └── 2 hops ──► API
                                      │
                                      └── 3 hops ──► Database

This allows an engineer to understand how an incident propagates through connected system components.

API Layer

The backend is implemented using Next.js Route Handlers.

Health Check
GET /api/health

Used to verify application/API health.

Incident List
GET /api/incidents

Returns available incidents.

Incident Details
GET /api/incidents/[id]

Returns details for a specific incident.

Example:

GET /api/incidents/INC-1001
Incident Graph
GET /api/incidents/[id]/graph

This is the primary graph API.

Example:

GET /api/incidents/INC-1001/graph

It retrieves the connected nodes and relationships for the selected incident.

Response structure:

{
  "success": true,
  "data": {
    "nodes": [],
    "edges": []
  }
}
Similar Incidents
GET /api/incidents/[id]/similar

Used to retrieve incidents related to the selected incident.

Service Dependencies
GET /api/dependencies/[serviceId]

Returns dependency relationships for a service.

Parameterized Cypher

The application uses parameterized Cypher queries instead of constructing queries by directly concatenating user-provided values.

Conceptually:

MATCH (i:Incident {id: $incidentId})
...

The incident ID is supplied separately as a query parameter.

This keeps the query structure reusable and avoids directly embedding request values into the Cypher query.

Graph Data Flow

The complete request flow is:

User selects incident
        │
        ▼
/incidents/[id]
        │
        ▼
GET /api/incidents/[id]/graph
        │
        ▼
Next.js API Route Handler
        │
        ▼
Parameterized Cypher Query
        │
        ▼
CognoDB
        │
        ▼
Nodes + Relationships
        │
        ▼
JSON Response
        │
        ▼
React Flow Node/Edge Conversion
        │
        ▼
Dagre Layout
        │
        ▼
Interactive Incident Graph
Frontend Graph Rendering

The graph visualization is isolated inside the IncidentGraph component.

The incident page is responsible for:

Fetching API data
Managing loading/error state
Converting API data
Applying graph layout
Managing selected nodes

The IncidentGraph component is responsible for:

Rendering React Flow
Custom graph nodes
Handles
Edges
Background
Controls
MiniMap
Node interaction

This separation keeps data fetching and visualization responsibilities independent.

Automatic Graph Layout

Graph nodes are dynamically returned by CognoDB, so their positions are not hardcoded.

Dagre is used to calculate the layout automatically.

The graph uses a left-to-right layout:

Incident → Service → API → Database → Error → Root Cause → Resolution

This makes relationship chains easier to follow visually.

Interactive Node Investigation

Clicking a graph node opens its details in the right sidebar.

The sidebar dynamically displays:

Node Type
Node Label
Description
Properties

Properties are generated from the data returned by CognoDB rather than being hardcoded for individual nodes.

UI States

The application handles three important graph states.

Loading
Loading incident graph...
Querying CognoDB
Error

If the graph API fails, the UI displays an error message and retry action.

Empty

If the API succeeds but no graph relationships exist, the UI displays:

No graph relationships found
Project Structure
incidentgraph/
│
├── app/
│   ├── page.tsx
│   │
│   ├── incidents/
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   └── api/
│       ├── health/
│       │   └── route.ts
│       │
│       ├── incidents/
│       │   ├── route.ts
│       │   └── [id]/
│       │       ├── route.ts
│       │       ├── graph/
│       │       │   └── route.ts
│       │       └── similar/
│       │           └── route.ts
│       │
│       └── dependencies/
│           └── [serviceId]/
│               └── route.ts
│
├── components/
│   ├── IncidentGraph.tsx
│   └── Sidebar.tsx
│
├── public/
│
├── .env.local
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md

The exact project structure may contain additional configuration or supporting files.

Getting Started
1. Clone the project
git clone <repository-url>
cd incidentgraph
2. Install dependencies
npm install
3. Configure environment variables

Create .env.local and provide the required CognoDB configuration.

Example:

COGNODB_URL=your_cognodb_url
COGNODB_API_KEY=your_api_key

Use the actual variable names configured in the project.

4. Start the development server
npm run dev

The application will be available on the local development server.

5. Build for production
npm run build

The production build should complete successfully before deployment.

Seed Data

The project includes seed data for creating a representative incident graph in CognoDB.

The seed graph contains interconnected entities representing an incident investigation flow.

Conceptually:

Incident
   │
   ▼
Service
   │
   ▼
API
   │
   ▼
Database
   │
   ▼
Error
   │
   ▼
Root Cause
   │
   ▼
Resolution

This provides a deterministic dataset for demonstrating graph traversal and visualization.
