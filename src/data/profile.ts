export const profile = {
  name: "Vamshi Krishna Durganala",
  firstName: "Vamshi",
  shortName: "VKD",
  roles: ["Full Stack Developer", "Java & Spring Boot Engineer", "React Developer", "Cloud-Native Builder"],
  tagline:
    "I build secure, event-driven enterprise systems end-to-end — from Spring Boot microservices and Kafka pipelines to polished React interfaces running on AWS.",
  email: "durganalavamshikrishna@gmail.com",
  phone: "+1 (980) 613-7558",
  location: "Charlotte, NC",
  resume: "/Vamshi-Krishna-Durganala-Resume.pdf",
  socials: {
    github: "https://github.com/vamshi-17",
    linkedin: "https://linkedin.com/in/vamshi-krishna-durganala",
  },
};

export const stats = [
  { value: 6, suffix: "+", label: "Years building software" },
  { value: 14, suffix: "+", label: "Microservices in production" },
  { value: 15, suffix: "+", label: "Legacy forms modernized" },
  { value: 3, suffix: "", label: "Companies, 2 continents" },
];

export const about = [
  "I'm a software developer who enjoys the whole stack — designing REST APIs and data models, wiring up event-driven workflows, securing them properly, and then building the interfaces people actually use.",
  "Right now I work on an enterprise Election Management System at TGS Technology: 14+ Java 17 / Spring Boot microservices, Kafka messaging, Keycloak-backed auth, and a React + TypeScript frontend, deployed on AWS EKS.",
  "I care about systems that are observable, tested and boring in production. Lately I've also been pairing with GitHub Copilot and Claude Code to move faster on debugging, refactoring and test generation.",
];

export type Job = {
  role: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  summary: string;
  highlights: string[];
  stack: string[];
};

export const experience: Job[] = [
  {
    role: "Full Stack Developer",
    company: "TGS Technology LLC",
    location: "Charlotte, NC",
    period: "Jul 2024 — Present",
    current: true,
    summary:
      "Building an enterprise Election Management System of 14+ microservices with Java 17, Spring Boot and React.",
    highlights: [
      "Designed RESTful APIs and service-to-service integrations with Spring MVC, Spring Data JPA/Hibernate, DTO validation and OpenAPI/Swagger.",
      "Implemented Apache Kafka producers and consumers for asynchronous workflows — event-driven service communication, portal updates and notifications.",
      "Built transactional data access on SQL Server with Liquibase migrations, JPQL, pagination, entity relationships and Redis caching.",
      "Secured workflows with Spring Security, Keycloak, JWT, OAuth 2.0, MFA and RBAC.",
      "Shipped full-stack features in React, TypeScript, Material UI, Zustand, React Hook Form and TanStack Query.",
      "Wrote JUnit, Mockito, Jest and RTL suites; load-tested with JMeter; deployed on AWS EKS via Jenkins, SonarQube and ArgoCD.",
    ],
    stack: ["Java 17", "Spring Boot", "Kafka", "React", "TypeScript", "SQL Server", "Redis", "Keycloak", "AWS EKS", "ArgoCD"],
  },
  {
    role: "Programmer Analyst",
    company: "Cognizant Technology Solutions",
    location: "Tamil Nadu, India",
    period: "Apr 2021 — Dec 2022",
    summary:
      "Developed an internal engineering platform for Telstra powering test automation, reporting and monitoring.",
    highlights: [
      "Built backend services with Java 11, Spring Boot, Spring Data JPA and REST APIs across application modules.",
      "Created React + TypeScript dashboards with role-based views, charts and live test-execution trends for engineering teams.",
      "Implemented Oracle-backed reporting with tuned queries, indexing, pagination and transactional operations.",
      "Automated recurring operational tasks with Python scripts for reporting, monitoring and infrastructure ops.",
      "Tested with JUnit, Mockito, Selenium, Cucumber and Jest; monitored production with Splunk and CloudWatch.",
    ],
    stack: ["Java 11", "Spring Boot", "React", "TypeScript", "Oracle", "Python", "Docker", "Kubernetes", "Splunk"],
  },
  {
    role: "Programmer Analyst",
    company: "RK Info Systems",
    location: "Hyderabad, India",
    period: "May 2020 — Apr 2021",
    summary:
      "Developed and modernized enterprise web applications with Java, Spring Boot and Angular.",
    highlights: [
      "Modernized 15+ legacy JSP forms into reusable Angular components integrated with Spring Boot REST APIs.",
      "Implemented Hibernate/JDBC data access — entity mappings, CRUD, joins and multi-step transactions.",
      "Built backend business logic, request validation and exception handling across functional modules.",
      "Wrote JUnit tests and partnered with QA on defect resolution and release support.",
    ],
    stack: ["Java", "Spring Boot", "Spring MVC", "Hibernate", "Angular", "TypeScript", "SQL"],
  },
];

export type Project = {
  title: string;
  context: string;
  description: string;
  points: string[];
  stack: string[];
  accent: string;
};

export const projects: Project[] = [
  {
    title: "Election Management System",
    context: "TGS Technology · 2024 — Now",
    description:
      "A secure, event-driven platform that runs complex election workflows across 14+ Spring Boot microservices.",
    points: ["Kafka event pipelines", "Keycloak + MFA + RBAC", "Deployed on AWS EKS with ArgoCD"],
    stack: ["Spring Boot", "Kafka", "React", "SQL Server", "Redis", "EKS"],
    accent: "from-violet-500/30 via-fuchsia-500/10",
  },
  {
    title: "Telstra Engineering Platform",
    context: "Cognizant · 2021 — 2022",
    description:
      "Internal platform giving engineering teams real-time visibility into automated test runs and application health.",
    points: ["Role-based live dashboards", "Oracle reporting engine", "Python ops automation"],
    stack: ["Spring Boot", "React", "TypeScript", "Oracle", "Python"],
    accent: "from-cyan-500/30 via-sky-500/10",
  },
  {
    title: "JSP → Angular Modernization",
    context: "RK Info Systems · 2020 — 2021",
    description:
      "Migrated 15+ legacy JSP forms to reusable Angular components without breaking existing business behaviour.",
    points: ["Reusable component library", "Spring Boot REST integration", "Zero functional regressions"],
    stack: ["Angular", "TypeScript", "Spring Boot", "Hibernate"],
    accent: "from-emerald-500/30 via-teal-500/10",
  },
];

export const skillGroups = [
  { title: "Languages", icon: "CodeXml", items: ["Java", "Python", "JavaScript (ES6+)", "TypeScript"] },
  {
    title: "Backend",
    icon: "Server",
    items: ["Spring Boot", "Spring MVC", "Spring Security", "Spring Data JPA", "Hibernate", "JDBC", "REST APIs", "Microservices", "Apache Kafka", "Resilience4j", "OpenAPI / Swagger", "Quartz"],
  },
  {
    title: "Frontend",
    icon: "LayoutTemplate",
    items: ["React", "Angular", "Material UI", "Zustand", "React Hook Form", "TanStack Query", "HTML5", "CSS3"],
  },
  { title: "Data", icon: "Database", items: ["SQL Server", "PostgreSQL", "MySQL", "Oracle", "MongoDB", "Redis"] },
  {
    title: "Cloud & DevOps",
    icon: "Cloud",
    items: ["AWS (EKS, EC2, ECR, RDS, Lambda, S3, IAM, API Gateway)", "Docker", "Kubernetes", "ArgoCD", "Jenkins", "CI/CD"],
  },
  {
    title: "Observability",
    icon: "Activity",
    items: ["Prometheus", "Grafana", "OpenSearch", "Splunk", "CloudWatch", "SLF4J / Logback / MDC"],
  },
  { title: "Security", icon: "ShieldCheck", items: ["Spring Security", "Keycloak", "JWT", "OAuth 2.0", "MFA", "RBAC"] },
  {
    title: "Testing",
    icon: "FlaskConical",
    items: ["JUnit", "Mockito", "JMeter", "Selenium", "Cucumber", "Jest", "React Testing Library", "SonarQube"],
  },
  {
    title: "Tooling",
    icon: "Wrench",
    items: ["Git", "Maven", "Nexus", "Liquibase", "Postman", "Jira", "IntelliJ", "Linux", "GitHub Copilot", "Claude Code"],
  },
] as const;

export const marquee = [
  "Java", "Spring Boot", "Kafka", "React", "TypeScript", "Angular", "AWS", "Kubernetes", "Docker",
  "PostgreSQL", "Redis", "Keycloak", "ArgoCD", "Jenkins", "Grafana", "Python",
];

export const certifications = [
  { name: "AWS Certified Solutions Architect", detail: "Associate" },
  { name: "Microsoft Azure Fundamentals", detail: "AZ-900" },
  { name: "Programming, Data Structures & Algorithms", detail: "NPTEL" },
];

export const education = [
  { degree: "M.S. Information Technology", school: "University of North Carolina at Charlotte", period: "2023 — 2024" },
  { degree: "B.Tech Electronics & Communication", school: "JNTU Hyderabad", period: "2017 — 2021" },
];

export const nav = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];
