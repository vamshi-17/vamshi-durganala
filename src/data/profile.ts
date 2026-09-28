export const profile = {
  name: "Vamshi Krishna Durganala",
  firstName: "Vamshi",
  role: "Full Stack Engineer",
  email: "durganalavamshikrishna@gmail.com",
  phone: "+1 (980) 613-7558",
  location: "Charlotte, NC",
  resume: "/Vamshi-Krishna-Durganala-Resume.pdf",
  socials: {
    github: "https://github.com/vamshi-17",
    linkedin: "https://linkedin.com/in/vamshi-krishna-durganala",
  },
};

/** The page is modelled as a request travelling through a system; each section is one hop. */
export const hops = [
  { id: "home", layer: "client", route: "/" },
  { id: "about", layer: "gateway", route: "/about" },
  { id: "experience", layer: "services", route: "/experience" },
  { id: "projects", layer: "events", route: "/projects" },
  { id: "stack", layer: "data", route: "/stack" },
  { id: "contact", layer: "response", route: "/contact" },
] as const;

/** Endpoints the hero console can "call". */
export const endpoints = {
  "/engineer": {
    latency: 38,
    body: {
      name: "Vamshi Krishna Durganala",
      role: "Full Stack Engineer",
      experience: "6+ years",
      location: "Charlotte, NC",
      focus: ["Java / Spring Boot", "React", "Kafka", "AWS"],
      status: "open_to_work",
    },
  },
  "/now": {
    latency: 24,
    body: {
      day_job: "Election platform @ TGS Technology",
      services: 14,
      side_project: "Job discovery platform",
      learning: ["LLM tooling", "Platform engineering"],
      coffee: "required",
    },
  },
  "/stack": {
    latency: 41,
    body: {
      backend: ["Java 17", "Spring Boot", "Kafka", "Node.js"],
      frontend: ["React", "Angular", "TypeScript"],
      data: ["SQL Server", "PostgreSQL", "Redis", "MongoDB"],
      cloud: ["AWS EKS", "Docker", "ArgoCD"],
      certified: "AWS Solutions Architect",
    },
  },
} as const;

export type EndpointPath = keyof typeof endpoints;

export const logLines = [
  ["200", "GET", "/experience", "6+ years across 3 companies"],
  ["201", "POST", "/microservices", "14+ running in production"],
  ["202", "PUBLISH", "kafka://domain-events", "async, idempotent"],
  ["200", "GET", "/certifications", "AWS Solutions Architect"],
  ["204", "DELETE", "/legacy/jsp-forms", "15+ migrated to Angular"],
  ["200", "GET", "/education", "M.S. IT · UNC Charlotte"],
  ["201", "POST", "/side-projects", "job discovery platform"],
  ["200", "GET", "/location", "Charlotte, NC"],
] as const;

export const headers: [string, string][] = [
  ["X-Role", "Full Stack Engineer"],
  ["X-Location", "Charlotte, NC (ET)"],
  ["X-Experience", "6+ years · since 2020"],
  ["X-Education", "M.S. Information Technology, UNC Charlotte"],
  ["X-Certified", "AWS Solutions Architect – Associate, Azure AZ-900"],
  ["X-Works-With", "GitHub Copilot, Claude Code"],
  ["X-Status", "open_to_work"],
];

export type CommitType = "feat" | "perf" | "sec" | "test" | "ops" | "refactor";

export type Service = {
  id: string;
  company: string;
  role: string;
  location: string;
  period: string;
  running?: boolean;
  summary: string;
  changelog: [CommitType, string][];
  stack: string[];
};

export const services: Service[] = [
  {
    id: "tgs-technology",
    company: "TGS Technology",
    role: "Full Stack Developer",
    location: "Charlotte, NC",
    period: "Jul 2024 — now",
    running: true,
    summary:
      "Building an enterprise election management platform: 14+ Java 17 / Spring Boot microservices behind a React + TypeScript frontend, running on AWS EKS.",
    changelog: [
      ["feat", "REST APIs and service-to-service integrations with Spring MVC, JPA/Hibernate, DTO validation and OpenAPI"],
      ["feat", "Kafka producers & consumers for async, event-driven workflows, portal updates and notifications"],
      ["perf", "Transactional data access on SQL Server with JPQL, pagination, Liquibase migrations and Redis caching"],
      ["sec", "Auth flows with Spring Security, Keycloak, OAuth 2.0, JWT, MFA and role-based access control"],
      ["feat", "Full-stack features in React, Material UI, Zustand, React Hook Form and TanStack Query"],
      ["test", "JUnit, Mockito, Jest and RTL suites; API and load testing with Postman and JMeter"],
      ["ops", "Docker → ECR → EKS deployments through Jenkins, SonarQube and ArgoCD; production troubleshooting"],
    ],
    stack: ["Java 17", "Spring Boot", "Kafka", "React", "TypeScript", "SQL Server", "Redis", "Keycloak", "EKS", "ArgoCD"],
  },
  {
    id: "cognizant",
    company: "Cognizant",
    role: "Programmer Analyst",
    location: "Tamil Nadu, India",
    period: "Apr 2021 — Dec 2022",
    summary:
      "Built an internal engineering platform for Telstra that gave teams live visibility into automated test runs and application health.",
    changelog: [
      ["feat", "Backend services in Java 11 and Spring Boot with validation, exception handling and integrations"],
      ["feat", "React + TypeScript dashboards with role-based views, charts and live test-execution trends"],
      ["perf", "Oracle reporting with tuned queries, indexing, pagination and transactional operations"],
      ["ops", "Python automation for reporting, monitoring and infrastructure chores"],
      ["sec", "Spring Security + RBAC to restrict features and data by role"],
      ["test", "JUnit, Mockito, Selenium, Cucumber and Jest; monitored with Splunk and CloudWatch"],
    ],
    stack: ["Java 11", "Spring Boot", "React", "TypeScript", "Oracle", "Python", "Kubernetes", "Splunk"],
  },
  {
    id: "rk-infosystems",
    company: "RK Info Systems",
    role: "Programmer Analyst",
    location: "Hyderabad, India",
    period: "May 2020 — Apr 2021",
    summary: "Where it started: enterprise Java web apps, and a big migration from legacy JSP to Angular.",
    changelog: [
      ["refactor", "Modernised 15+ legacy JSP forms into reusable Angular components on Spring Boot REST APIs"],
      ["feat", "Hibernate/JDBC data access: entity mappings, CRUD, joins and multi-step transactions"],
      ["feat", "Backend business logic, request validation and exception handling across modules"],
      ["test", "JUnit coverage and defect triage with QA through release support"],
    ],
    stack: ["Java", "Spring Boot", "Hibernate", "Angular", "TypeScript", "SQL"],
  },
];

export type Project = {
  id: "jobs" | "expense" | "hemo";
  index: string;
  name: string;
  tagline: string;
  problem: string;
  built: string[];
  stack: string[];
  meta: string;
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    id: "jobs",
    index: "01",
    name: "Job Discovery Platform",
    tagline: "See new software jobs minutes after they're posted, not hours.",
    problem:
      "By the time a posting shows up on the big job boards, it's often 5–10 hours old and already has hundreds of applicants. This goes straight to the source.",
    built: [
      "Ingest worker polling Greenhouse & Workday via pluggable source adapters",
      "Normalise → dedupe pipeline into one Postgres schema (Drizzle ORM)",
      "Keyword profiles, match scoring, job status tracking and push alerts",
      "Groundwork for AI résumé tailoring with the Claude API",
    ],
    stack: ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "Drizzle", "Docker", "Claude API"],
    meta: "2026 · in active development",
    links: [],
  },
  {
    id: "expense",
    index: "02",
    name: "Expense App",
    tagline: "Budgets, salary and spending in one clear dashboard.",
    problem:
      "A full MERN app for tracking where money goes: set budgets by category, log expenses against them and see the month at a glance.",
    built: [
      "Express REST API with JWT auth middleware and bcrypt password hashing",
      "Mongoose models for budgets, categories, salary and expenses",
      "Joi request validation; Jest + Supertest API tests",
      "React + Material UI client with a dashboard of monthly totals",
    ],
    stack: ["Node.js", "Express", "MongoDB", "JWT", "React", "Material UI", "Jest"],
    meta: "2023 · full stack",
    links: [
      { label: "API", href: "https://github.com/vamshi-17/expense-app-server" },
      { label: "Client", href: "https://github.com/vamshi-17/expense-app-client" },
    ],
  },
  {
    id: "hemo",
    index: "03",
    name: "Hemo",
    tagline: "An Android app connecting patients, doctors and pharmacies.",
    problem:
      "Four roles, one app: admins onboard doctors, patients book appointments and share symptoms, doctors prescribe, and pharmacies receive prescriptions directly.",
    built: [
      "Role-based flows for Admin, Doctor, Patient and Pharmacy",
      "Appointments, symptom reports, prescriptions and in-app messaging",
      "Firebase Auth, Realtime Database and Storage for images",
      "Native Android UI in Java with RecyclerView lists and notifications",
    ],
    stack: ["Java", "Android", "Firebase Auth", "Realtime DB", "Cloud Storage"],
    meta: "Android · mobile",
    links: [{ label: "Code", href: "https://github.com/vamshi-17/hemo" }],
  },
];

/** Skills arranged as layers of a system, top (user) to bottom (infrastructure). */
export const layers = [
  { id: "client", name: "Client", items: ["React", "Angular", "Next.js", "TypeScript", "Material UI", "Zustand", "TanStack Query", "React Hook Form", "Android"] },
  { id: "edge", name: "Edge & security", items: ["API Gateway", "Keycloak", "OAuth 2.0", "MFA", "JWT", "Spring Security", "RBAC"] },
  { id: "services", name: "Services", items: ["Java 17", "Spring Boot", "Spring MVC", "Spring Data JPA", "Hibernate", "Node.js", "Express", "Resilience4j", "OpenAPI", "Python"] },
  { id: "events", name: "Messaging", items: ["Apache Kafka", "Quartz Scheduler", "Push alerts"] },
  { id: "data", name: "Data", items: ["SQL Server", "PostgreSQL", "Oracle", "MySQL", "MongoDB", "Redis", "Liquibase", "Drizzle", "Firebase"] },
  { id: "platform", name: "Platform", items: ["Docker", "Kubernetes", "AWS EKS", "ECR", "EC2", "RDS", "Lambda", "S3", "Jenkins", "ArgoCD"] },
  { id: "observe", name: "Observability", items: ["Prometheus", "Grafana", "OpenSearch", "Splunk", "CloudWatch", "Logback + MDC"] },
  { id: "quality", name: "Quality", items: ["JUnit", "Mockito", "Jest", "React Testing Library", "Selenium", "Cucumber", "JMeter", "SonarQube"] },
] as const;

/** Real request paths through the stack; each step must match an item in `layers`. */
export const traces = [
  {
    id: "login",
    label: "Sign in with MFA",
    note: "React login → Keycloak issues tokens after MFA → Spring Security validates the JWT and enforces roles → session data cached in Redis.",
    path: ["React", "Keycloak", "MFA", "OAuth 2.0", "JWT", "Spring Security", "RBAC", "Spring Boot", "Redis", "SQL Server"],
  },
  {
    id: "event",
    label: "Publish a domain event",
    note: "A service commits a transaction, publishes to Kafka, and consumers update the portal and fan out notifications with retries.",
    path: ["Spring Boot", "Spring Data JPA", "SQL Server", "Apache Kafka", "Resilience4j", "Push alerts", "React"],
  },
  {
    id: "ship",
    label: "Ship to production",
    note: "Tests and quality gates in CI, image pushed to ECR, ArgoCD syncs to EKS, and dashboards confirm it's healthy.",
    path: ["JUnit", "Jest", "SonarQube", "Jenkins", "Docker", "ECR", "ArgoCD", "AWS EKS", "Prometheus", "Grafana"],
  },
  {
    id: "jobs",
    label: "Find a fresh job",
    note: "My side project: a Node worker pulls postings, dedupes them into Postgres via Drizzle, and a Next.js dashboard pushes alerts.",
    path: ["Node.js", "PostgreSQL", "Drizzle", "Next.js", "React", "Push alerts", "Docker"],
  },
] as const;

export type TraceId = (typeof traces)[number]["id"];
