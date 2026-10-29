<div align="center">

# 🛡️ Digivista SecureOps

### Centralized IT Infrastructure, Endpoint & Service Operations Console

**An enterprise IT operations prototype developed during a Software Development Internship at Digivista Infotech.**

[Overview](#overview) · [Features](#features) · [Architecture](#architecture) · [Getting-started](#getting-started) · [Roadmap](#roadmap)

</div>

> **Project status:** Internship prototype / demonstration application. Operational records are managed in an in-memory application store, with Supabase-based authentication integration. Endpoint operations are simulated; this repository should **not** be represented as a production-ready remote monitoring, security enforcement, or device-control solution.

## Overview

**Digivista SecureOps** is a centralized console designed to illustrate how an IT services provider can manage client organizations, infrastructure assets, endpoints, maintenance contracts, engineers, service tickets, and related operational workflows from one interface.

The project emerged from practical exposure to enterprise IT service delivery at **Digivista Infotech**, including infrastructure administration, CCTV/NVR environments, biometric systems, networking, device management, and customer support operations.

The central idea is to connect an organization's **infrastructure inventory** with its **service lifecycle**: identify assets, review their operational status, track issues, assign work, and document resolution.

## Features

The following describes the internship prototype's application modules and demonstrations. Some actions update or read **demonstration data**, rather than communicating with real hardware.

| Module | Scope in the prototype |
|---|---|
| **Operations dashboard** | Centralized view of operational information, summaries, and service activity. |
| **Companies & client administration** | Organize customer/company records and related infrastructure context. |
| **Asset inventory** | Represent and manage IT assets and equipment records. |
| **Endpoint management** | Browse endpoint information and demonstrate endpoint-management workflows. |
| **Simulated endpoint actions** | Illustrate management operations without executing real commands on client devices. |
| **Service tickets** | Track support issues and their operational lifecycle. |
| **Engineer management** | Maintain engineer information for service workflows. |
| **AMC / contract tracking** | Represent Annual Maintenance Contract information and related service administration. |
| **Users & access context** | Authentication/session integration and user/profile/role context. |
| **Audit / activity views** | Present operational activity or audit-related records within the prototype. |

### Intended operational workflow

```text
Client organization / site
          ↓
Infrastructure and asset records
          ↓
Endpoint and equipment status
          ↓
Issue / service ticket
          ↓
Engineer assignment and maintenance
          ↓
Resolution and operational history
```

The workflow above expresses the product direction; it does not imply that every transition is automated or backed by live telemetry.

## Technology stack

| Area | Technology |
|---|---|
| Frontend | React, TypeScript |
| Styling | Tailwind CSS |
| Client-side routing | TanStack Router / routing integration |
| Authentication integration | Supabase (session, profile, and role context) |
| Prototype operational state | In-memory data store with React subscription hooks |
| Development workflow | Lovable-assisted development, Git, GitHub |

**Not established as part of the internship prototype:** production device agents, real-time network discovery, live remote desktop control, persistent operational database for all modules, automated patch deployment, and active security-policy enforcement.

## Architecture

```text
                         ┌───────────────────────────┐
                         │     React + TypeScript    │
                         │   SecureOps Console UI    │
                         └─────────────┬─────────────┘
                                       │
                         ┌─────────────▼─────────────┐
                         │  Hooks / UI state layer   │
                         │     use-secureops.ts      │
                         └──────────┬─────────┬──────┘
                                    │         │
                   ┌────────────────▼──┐   ┌──▼────────────────────┐
                   │ Operational store │   │ Authentication layer │
                   │ secureops-data.ts │   │      use-auth.tsx     │
                   │ (in-memory demo)  │   │ Supabase integration │
                   └───────────────────┘   └───────────────────────┘
```

### Important source files

The following paths were identified in the internship codebase:

- `src/lib/secureops-data.ts` — operational records and actions for the prototype.
- `src/hooks/use-secureops.ts` — React subscription to the operational data store.
- `src/hooks/use-auth.tsx` — authentication and user-context integration.

> **Persistence note:** Do not assume operational changes survive a full reload or are synchronized across users. Supabase authentication integration does not, by itself, establish a persistent backend for asset, endpoint, or ticket records.

## Getting started

### Prerequisites

- Node.js (current LTS recommended)
- npm
- Git
- Supabase configuration, where required by the repository's authentication setup

### Installation

```bash
git clone https://github.com/ayush-bhatt-07/Digivista-SecureOps.git
cd Digivista-SecureOps
npm install
```

Configure environment variables according to the **actual names referenced in the repository**. For example, Vite/Supabase projects commonly use values such as:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
```

**Check the repository's Supabase client configuration before creating `.env.local`: variable names may differ.** Never commit credentials or use a Supabase service-role key in frontend code.

Start the development server:

```bash
npm run dev
```

Open the local address printed in your terminal. Check `package.json` for the exact available scripts (for example, build, lint, or test).

## Access control and proposed RBAC model

SecureOps is intended for multi-organization IT service delivery. The following **seven-role model is a recommended next-stage design**, not a claim that the entire permission matrix is already implemented.

| Proposed role | Intended responsibilities |
|---|---|
| **Super Admin** | Platform administration and organization provisioning; no automatic access to client secrets. |
| **Organization Admin** | Organization users, devices, settings, and service oversight. |
| **IT Administrator** | Authorized endpoint, patch, and infrastructure administration. |
| **Security Analyst** | Alerts, vulnerabilities, compliance review, and security reporting. |
| **IT Technician** | Assigned support cases and explicitly authorized maintenance operations. |
| **Employee / End User** | Self-service tickets and visibility into assigned equipment. |
| **Auditor** | Read-only access to approved records and compliance evidence. |

### Security principles for a production implementation

- Enforce organization/tenant boundaries **on the backend**, not merely through hidden UI controls.
- Scope access by organization, assigned device, action, and user permissions.
- Use least privilege, including for platform administrators.
- Require explicit authorization and audit trails for remote sessions.
- Grant password-vault access per vault or secret, rather than by broad role alone.
- Log security-sensitive changes and protect audit records from tampering.
- Separate authentication, authorization, and operational data access.

## Screenshots

Add verified screenshots from the running application in `docs/screenshots/` and replace the placeholders below. Do not use concept art as evidence of implemented functionality.

| Screen | Suggested screenshot |
|---|---|
| Operations dashboard | `docs/screenshots/dashboard.png` |
| Companies / clients | `docs/screenshots/companies.png` |
| Asset inventory | `docs/screenshots/assets.png` |
| Endpoint management | `docs/screenshots/endpoints.png` |
| Tickets / service workflow | `docs/screenshots/tickets.png` |
| AMC / contracts | `docs/screenshots/amc.png` |
| Engineers / users | `docs/screenshots/engineers-users.png` |
| Audit / activity | `docs/screenshots/audit.png` |

<!-- After adding screenshots, uncomment a verified example:
![SecureOps dashboard](docs/screenshots/dashboard.png)
-->

## Roadmap — proposed enhancements

These items describe potential future work, **not completed features**:

- [ ] Persistent, tenant-isolated database for operational records.
- [ ] Backend APIs with server-side authorization and permission checks.
- [ ] Fine-grained RBAC with organization memberships and scoped assignments.
- [ ] Real endpoint agents for authenticated device telemetry.
- [ ] Authorized asset and network discovery with clear scanning boundaries.
- [ ] Live health monitoring, alerts, and incident correlation.
- [ ] Controlled patch orchestration with approval and rollback safeguards.
- [ ] Remote support sessions with consent, authorization, and logging.
- [ ] Compliance evidence collection and exportable reports.
- [ ] Secure secrets-management integration (no plaintext credential storage).
- [ ] Service-level agreement tracking and notifications.
- [ ] Integration with external service-management systems.
- [ ] Automated testing, observability, and deployment hardening.

## Known limitations

1. **Prototype state:** Operational modules use an in-memory store; persistent, multi-user synchronization is not established.
2. **Simulation vs. hardware:** Endpoint-management actions are demonstrations, not proof of real device execution.
3. **Authorization:** Authentication and role context do not automatically guarantee complete backend-enforced RBAC.
4. **Production readiness:** Device agents, deployment infrastructure, security reviews, and operational safeguards would be required before handling real customer environments.
5. **Integration scope:** Do not assume live integrations with CCTV/NVR, biometric, networking, or remote-access equipment unless separately implemented and tested.

## Development context

**Organization:** Digivista Infotech  
**Project:** Digivista SecureOps  
**Intern:** Ayush Bhatt  
**Role:** Software Development Intern  
**Internship period:** 25 June – 6 August 2026  
**Supervisor:** Sandeep Saxena  

The work involved understanding business and IT service requirements, translating them into workflows and application modules, and iterating on a functional prototype using AI-assisted development tools.

## Repository

**Source code:** [ayush-bhatt-07/Digivista-SecureOps](https://github.com/ayush-bhatt-07/Digivista-SecureOps)

## License and usage

No open-source license is asserted here. Unless the repository contains an explicit license and the project owner has authorized its publication and reuse, do not assume third-party permission to redistribute or commercially deploy the code. Confirm ownership and publication permissions with Digivista Infotech before making additional company-related assets public.

---

<div align="center">

**Digivista SecureOps** · An internship prototype exploring centralized IT operations and service management.

</div>
