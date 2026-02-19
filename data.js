// ═══════════════════════════════════════════════════════════
// Idea Lab — Data File
// ═══════════════════════════════════════════════════════════
// Edit this file to add your own ideas, references, and connections.
// The visualization (index.html) loads this via <script src="data.js">.
// After editing, just refresh the page to see changes.
//
// Data arrays:
//   CATEGORIES  — Category definitions with colors
//   IDEAS       — Your ideas (id, cat, name, short, difficulty, novelty, feasibility, impact, type, connects)
//   REFERENCES  — Source/reference items (papers, articles, inspirations)
//   PROBLEMS    — Barriers, challenges, or failure modes that ideas address
//   EDGE_LABELS — Relationship labels between connected items, keyed by "lo-hi" (lower id first)

const CATEGORIES = {
  core:           { name: 'Core Concepts',     color: '#ff6b35' },
  infrastructure: { name: 'Infrastructure',     color: '#35c9ff' },
  experience:     { name: 'User Experience',    color: '#c470ff' },
  data:           { name: 'Data & Analytics',   color: '#3dff8f' },
  strategy:       { name: 'Strategy',           color: '#ffd43b' },
  reference:      { name: 'Source / Reference',  color: '#9ca3af' },
  problem:        { name: 'Problem',             color: '#ff2244' },
};

const IDEAS = [
  // ── CORE CONCEPTS (1-4) ──
  { id:1, cat:'core', name:'Real-time Dashboard', short:'Live metrics dashboard showing key performance indicators. WebSocket-powered updates with configurable refresh intervals and alert thresholds. Supports custom widget layouts per user role.', difficulty:3, novelty:3, feasibility:4, impact:5, type:'Feature' , connects:[2,5,8,201] },
  { id:2, cat:'core', name:'Plugin Architecture', short:'Extensible plugin system allowing third-party developers to add functionality. Lifecycle hooks for init, activate, deactivate, and uninstall. Sandboxed execution environment for security.', difficulty:4, novelty:4, feasibility:3, impact:5, type:'Architecture', connects:[1,3,6,10,202] },
  { id:3, cat:'core', name:'Event Sourcing Engine', short:'Append-only event log as the source of truth. Projections rebuild state from events on demand. Enables time-travel debugging, audit trails, and retroactive feature deployment.', difficulty:4, novelty:4, feasibility:3, impact:4, type:'Architecture', connects:[2,4,8,12,203] },
  { id:4, cat:'core', name:'Configuration DSL', short:'Domain-specific language for defining application behavior without code changes. YAML-based with live validation, auto-complete, and preview. Hot-reload without restarts.', difficulty:3, novelty:3, feasibility:4, impact:4, type:'Feature', connects:[2,3,6] },

  // ── INFRASTRUCTURE (5-7) ──
  { id:5, cat:'infrastructure', name:'Edge Caching Layer', short:'CDN-like caching at the application edge. Intelligent cache invalidation based on data dependencies. Reduces latency by 60-80% for read-heavy workloads.', difficulty:3, novelty:2, feasibility:5, impact:5, type:'Performance', connects:[1,7,9,201] },
  { id:6, cat:'infrastructure', name:'Service Mesh Integration', short:'Sidecar proxy pattern for inter-service communication. Circuit breakers, retry policies, and distributed tracing built in. Zero-code service discovery.', difficulty:4, novelty:3, feasibility:3, impact:4, type:'Architecture', connects:[2,4,7,12] },
  { id:7, cat:'infrastructure', name:'Auto-scaling Pipeline', short:'ML-driven resource scaling based on traffic patterns and prediction models. Pre-warms instances before anticipated load spikes. Cost-optimized with spot instance integration.', difficulty:3, novelty:3, feasibility:4, impact:4, type:'DevOps', connects:[5,6,9] },

  // ── USER EXPERIENCE (8-10) ──
  { id:8, cat:'experience', name:'Contextual Onboarding', short:'Progressive disclosure onboarding that adapts to user behavior. Tracks feature discovery and surfaces relevant tutorials just-in-time. A/B tested with engagement metrics.', difficulty:2, novelty:3, feasibility:5, impact:4, type:'Feature', connects:[1,3,10,11,204] },
  { id:9, cat:'experience', name:'Offline-First Architecture', short:'Full functionality without network connectivity. Conflict resolution via CRDTs when reconnecting. Background sync with progress indicators and manual override.', difficulty:4, novelty:4, feasibility:3, impact:4, type:'Architecture', connects:[5,7,12] },
  { id:10, cat:'experience', name:'Accessibility Automation', short:'Automated accessibility testing integrated into CI/CD pipeline. Screen reader compatibility checks, color contrast validation, and keyboard navigation verification.', difficulty:2, novelty:3, feasibility:5, impact:5, type:'Tooling', connects:[2,8,11] },

  // ── DATA & ANALYTICS (11-13) ──
  { id:11, cat:'data', name:'Behavioral Analytics Engine', short:'Privacy-respecting analytics tracking user journeys and feature adoption. Funnel analysis, cohort comparison, and anomaly detection. No PII stored, differential privacy applied.', difficulty:3, novelty:3, feasibility:4, impact:4, type:'Feature', connects:[8,10,13,204] },
  { id:12, cat:'data', name:'Data Versioning System', short:'Git-like version control for datasets and configurations. Branch, merge, and diff structured data. Enables reproducible experiments and safe rollbacks.', difficulty:4, novelty:4, feasibility:3, impact:3, type:'Tooling', connects:[3,6,9,13,203] },
  { id:13, cat:'data', name:'Predictive Query Optimizer', short:'ML model that predicts query patterns and pre-computes results. Learns from historical access patterns. Reduces p99 latency by materializing likely queries.', difficulty:5, novelty:5, feasibility:2, impact:4, type:'Performance', connects:[11,12,202] },

  // ── STRATEGY (14-15) ──
  { id:14, cat:'strategy', name:'Open API Marketplace', short:'Public API marketplace where partners can discover, test, and integrate your services. Revenue sharing model with usage-based billing. SDK generation for multiple languages.', difficulty:3, novelty:3, feasibility:4, impact:5, type:'Business', connects:[2,6,15] },
  { id:15, cat:'strategy', name:'Community Feedback Loop', short:'Structured system for collecting, prioritizing, and acting on user feedback. Voting, commenting, and status tracking. Closes the loop with automatic notifications when ideas ship.', difficulty:2, novelty:2, feasibility:5, impact:4, type:'Process', connects:[8,14] },
];

const REFERENCES = [
  { id:201, cat:'reference', name:'Designing Data-Intensive Applications', short:'Martin Kleppmann\'s comprehensive guide to distributed systems, data modeling, and scalable architectures. Foundation for event sourcing and stream processing patterns.', connects:[1,5], descendants:[1,3,5,9,12] },
  { id:202, cat:'reference', name:'Building Microservices', short:'Sam Newman\'s guide to microservice architecture, decomposition strategies, and inter-service communication patterns.', connects:[2,6,13], descendants:[2,6,13,14] },
  { id:203, cat:'reference', name:'The Pragmatic Programmer', short:'Hunt & Thomas on software craftsmanship — DRY, orthogonality, tracer bullets, and pragmatic approaches to complexity.', connects:[3,12], descendants:[3,4,12] },
  { id:204, cat:'reference', name:'Don\'t Make Me Think', short:'Steve Krug\'s classic on web usability, intuitive navigation, and user-centered design principles.', connects:[8,11], descendants:[8,10,11,15] },
];

const PROBLEMS = [
  { id:101, cat:'problem', name:'Cold Start Latency', short:'First request after deployment or scaling event takes 3-10x longer than steady-state. Affects serverless functions, container spin-up, and JIT compilation. Degrades user experience during traffic spikes and erodes trust in system reliability.', severity:4, connects:[5,7,9] },
];

// Edge relationship labels — keyed by "loId-hiId" (lower id first)
const EDGE_LABELS = {
  '1-2':     'powers',
  '1-5':     'data flow',
  '1-8':     'surfaces to',
  '2-3':     'event-driven',
  '2-6':     'communicates via',
  '2-10':    'enables testing',
  '3-4':     'configures',
  '3-8':     'drives UX',
  '3-12':    'versions events',
  '5-7':     'scales with',
  '5-9':     'syncs to',
  '6-7':     'orchestrates',
  '6-12':    'data pipeline',
  '8-10':    'accessibility first',
  '8-11':    'tracks adoption',
  '10-11':   'measures access.',
  '11-13':   'feeds predictions',
  '12-13':   'optimizes queries',
  '2-14':    'exposes APIs',
  '1-201':   'inspired by',
  '5-201':   'scaling patterns',
  '2-202':   'architecture from',
  '6-202':   'communication',
  '13-202':  'decomposition',
  '3-203':   'craftsmanship',
  '12-203':  'versioning',
  '8-204':   'usability',
  '11-204':  'user research',
  '5-101':   'mitigates',
  '7-101':   'pre-warms against',
  '9-101':   'avoids via local',
};
