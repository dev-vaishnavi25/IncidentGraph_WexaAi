import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import neo4j from "neo4j-driver";
import { queries } from "../lib/queries";

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !username || !password) {
  throw new Error("Missing CognoDB environment variables");
}

const driver = neo4j.driver(
  uri,
  neo4j.auth.basic(username, password)
);

async function seed() {
  const session = driver.session();

  try {
    console.log("Clearing existing graph...");

    await session.run(queries.clearDatabase);

    console.log("Creating constraints...");

    for (const constraint of queries.createConstraints) {
      try {
        await session.run(constraint);
      } catch (error) {
        console.log("Constraint skipped:", error);
      }
    }

    console.log("Creating graph data...");

    await session.run(`
      CREATE
      (payment:Service {
        id: 'service-payment',
        name: 'Payment Service',
        description: 'Handles payment processing and transactions'
      }),

      (order:Service {
        id: 'service-order',
        name: 'Order Service',
        description: 'Handles order creation and management'
      }),

      (inventory:Service {
        id: 'service-inventory',
        name: 'Inventory Service',
        description: 'Manages product inventory'
      }),

      (auth:Service {
        id: 'service-auth',
        name: 'Auth Service',
        description: 'Handles authentication and authorization'
      }),

      (notification:Service {
        id: 'service-notification',
        name: 'Notification Service',
        description: 'Sends email and push notifications'
      }),

      (user:Service {
        id: 'service-user',
        name: 'User Service',
        description: 'Manages user profiles'
      }),

      (paymentApi:API {
        id: 'api-payment-create',
        method: 'POST',
        path: '/payments',
        description: 'Creates a payment'
      }),

      (orderApi:API {
        id: 'api-order-create',
        method: 'POST',
        path: '/orders',
        description: 'Creates an order'
      }),

      (inventoryApi:API {
        id: 'api-inventory-check',
        method: 'GET',
        path: '/inventory/{productId}',
        description: 'Checks product inventory'
      }),

      (authApi:API {
        id: 'api-auth-login',
        method: 'POST',
        path: '/auth/login',
        description: 'Authenticates a user'
      }),

      (paymentsDb:Database {
        id: 'db-payments',
        name: 'Payments PostgreSQL',
        type: 'PostgreSQL'
      }),

      (ordersDb:Database {
        id: 'db-orders',
        name: 'Orders PostgreSQL',
        type: 'PostgreSQL'
      }),

      (inventoryDb:Database {
        id: 'db-inventory',
        name: 'Inventory PostgreSQL',
        type: 'PostgreSQL'
      }),

      (redis:Database {
        id: 'db-redis',
        name: 'Redis Cache',
        type: 'Redis'
      }),

      (timeout:Error {
        id: 'error-connection-timeout',
        name: 'Database Connection Timeout',
        message: 'Connection acquisition timed out',
        severity: 'HIGH'
      }),

      (redisError:Error {
        id: 'error-redis-timeout',
        name: 'Redis Connection Timeout',
        message: 'Redis connection timed out',
        severity: 'MEDIUM'
      }),

      (poolExhaustion:RootCause {
        id: 'rootcause-pool-exhaustion',
        name: 'Connection Pool Exhaustion',
        description: 'Database connection pool was exhausted under high concurrent traffic'
      }),

      (redisPool:RootCause {
        id: 'rootcause-redis-pool',
        name: 'Redis Connection Pool Saturation',
        description: 'Redis connection pool reached its configured limit'
      }),

      (increasePool:Resolution {
        id: 'resolution-increase-pool',
        action: 'Increase Database Connection Pool',
        description: 'Increase pool size and tune connection timeout settings'
      }),

      (redisScaling:Resolution {
        id: 'resolution-redis-scaling',
        action: 'Increase Redis Pool Capacity',
        description: 'Increase Redis connection pool capacity'
      }),

      (incident142:Incident {
        id: 'INC-142',
        title: 'Payment API Timeout',
        description: 'Payment requests started timing out during peak traffic',
        severity: 'HIGH',
        status: 'RESOLVED',
        createdAt: '2026-08-20'
      }),

      (incident141:Incident {
        id: 'INC-141',
        title: 'Redis Connection Error',
        description: 'Notification requests failed because Redis connections timed out',
        severity: 'MEDIUM',
        status: 'RESOLVED',
        createdAt: '2026-08-18'
      }),

      (incident140:Incident {
        id: 'INC-140',
        title: 'Order API Failure',
        description: 'Order creation failed because inventory dependency was unavailable',
        severity: 'HIGH',
        status: 'RESOLVED',
        createdAt: '2026-08-16'
      }),

      (incident139:Incident {
        id: 'INC-139',
        title: 'Checkout Payment Failure',
        description: 'Checkout payments experienced intermittent failures',
        severity: 'HIGH',
        status: 'RESOLVED',
        createdAt: '2026-08-12'
      }),

      (incident138:Incident {
        id: 'INC-138',
        title: 'Payment Database Timeout',
        description: 'Payment database connections timed out',
        severity: 'HIGH',
        status: 'RESOLVED',
        createdAt: '2026-08-10'
      }),

      (incident137:Incident {
        id: 'INC-137',
        title: 'Inventory API Latency',
        description: 'Inventory API response time increased significantly',
        severity: 'MEDIUM',
        status: 'RESOLVED',
        createdAt: '2026-08-07'
      }),

      (incident136:Incident {
        id: 'INC-136',
        title: 'Authentication Failure',
        description: 'Users experienced authentication failures',
        severity: 'HIGH',
        status: 'RESOLVED',
        createdAt: '2026-08-05'
      }),

      (incident135:Incident {
        id: 'INC-135',
        title: 'Notification Delivery Failure',
        description: 'Notifications were delayed due to Redis connectivity issues',
        severity: 'MEDIUM',
        status: 'RESOLVED',
        createdAt: '2026-08-02'
      }),

      (incident134:Incident {
        id: 'INC-134',
        title: 'Order Processing Delay',
        description: 'Order processing was delayed by downstream inventory calls',
        severity: 'MEDIUM',
        status: 'RESOLVED',
        createdAt: '2026-07-29'
      }),

      (incident133:Incident {
        id: 'INC-133',
        title: 'Payment Service Degradation',
        description: 'Payment service experienced elevated error rates',
        severity: 'HIGH',
        status: 'RESOLVED',
        createdAt: '2026-07-25'
      }),

      (payment)-[:EXPOSES]->(paymentApi),
      (order)-[:EXPOSES]->(orderApi),
      (inventory)-[:EXPOSES]->(inventoryApi),
      (auth)-[:EXPOSES]->(authApi),

      (payment)-[:USES]->(paymentsDb),
      (order)-[:USES]->(ordersDb),
      (inventory)-[:USES]->(inventoryDb),

      (payment)-[:DEPENDS_ON]->(auth),
      (payment)-[:DEPENDS_ON]->(order),
      (order)-[:DEPENDS_ON]->(inventory),
      (order)-[:DEPENDS_ON]->(notification),
      (notification)-[:USES]->(redis),
      (auth)-[:DEPENDS_ON]->(user),

      (incident142)-[:AFFECTS]->(payment),
      (incident142)-[:TRIGGERED_BY]->(timeout),
      (incident142)-[:CAUSED_BY]->(poolExhaustion),

      (incident141)-[:AFFECTS]->(notification),
      (incident141)-[:TRIGGERED_BY]->(redisError),
      (incident141)-[:CAUSED_BY]->(redisPool),

      (incident140)-[:AFFECTS]->(order),
      (incident140)-[:TRIGGERED_BY]->(timeout),

      (incident139)-[:AFFECTS]->(payment),
      (incident139)-[:TRIGGERED_BY]->(timeout),
      (incident139)-[:CAUSED_BY]->(poolExhaustion),

      (incident138)-[:AFFECTS]->(payment),
      (incident138)-[:TRIGGERED_BY]->(timeout),
      (incident138)-[:CAUSED_BY]->(poolExhaustion),

      (incident137)-[:AFFECTS]->(inventory),

      (incident136)-[:AFFECTS]->(auth),

      (incident135)-[:AFFECTS]->(notification),
      (incident135)-[:TRIGGERED_BY]->(redisError),
      (incident135)-[:CAUSED_BY]->(redisPool),

      (incident134)-[:AFFECTS]->(order),

      (incident133)-[:AFFECTS]->(payment),
      (incident133)-[:TRIGGERED_BY]->(timeout),
      (incident133)-[:CAUSED_BY]->(poolExhaustion),

      (poolExhaustion)-[:RESOLVED_BY]->(increasePool),
      (redisPool)-[:RESOLVED_BY]->(redisScaling),

      (incident142)-[:SIMILAR_TO]->(incident139),
      (incident142)-[:SIMILAR_TO]->(incident138),
      (incident142)-[:SIMILAR_TO]->(incident133),

      (incident141)-[:SIMILAR_TO]->(incident135)
    `);

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();