/**
 * In-memory operational data store for Digivista SecureOps.
 * Provides real CRUD operations with subscription support so every
 * button in the UI performs an actual state mutation.
 */

export type Status = "active" | "inactive" | "maintenance" | "faulty";
export type TicketStatus = "open" | "in_progress" | "on_hold" | "resolved" | "closed";
export type Priority = "critical" | "high" | "medium" | "low";

export interface Company {
  id: string;
  name: string;
  gstin: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  branches: number;
  assets: number;
  amcStatus: "active" | "expiring" | "expired";
  status: Status;
}

export interface Asset {
  id: string;
  name: string;
  type:
    | "CCTV"
    | "NVR"
    | "DVR"
    | "Server"
    | "Switch"
    | "Router"
    | "Firewall"
    | "Access Point"
    | "Biometric"
    | "Laptop"
    | "UPS"
    | "Printer";
  serial: string;
  brand: string;
  company: string;
  branch: string;
  warrantyEnd: string;
  health: number;
  status: Status;
  engineer: string;
}

export interface Ticket {
  id: string;
  subject: string;
  company: string;
  category: "CCTV" | "Network" | "Biometric" | "Server" | "Inventory" | "Other";
  priority: Priority;
  status: TicketStatus;
  engineer: string;
  slaHours: number;
  createdAt: string;
}

export interface Engineer {
  id: string;
  name: string;
  role: string;
  region: string;
  availability: "online" | "on_site" | "offline";
  openTickets: number;
  rating: number;
  phone: string;
}

export interface Endpoint {
  id: string;
  hostname: string;
  os: string;
  ip: string;
  company: string;
  agent: "online" | "offline";
  cpu: number;
  ram: number;
  disk: number;
  patchLevel: "current" | "pending" | "critical";
  lastHeartbeat: string;
}

export type ContractStatus = "active" | "expiring" | "expired" | "draft";
export type InvoiceStatus = "paid" | "unpaid" | "overdue" | "draft";
export type VisitStatus = "scheduled" | "completed" | "missed";

export interface AmcContract {
  id: string;
  company: string;
  plan: "Comprehensive" | "Non-Comprehensive" | "Labour Only";
  startDate: string;
  endDate: string;
  value: number;
  billingCycle: "monthly" | "quarterly" | "half_yearly" | "annual";
  coveredAssets: number;
  visitsPerYear: number;
  slaHours: number;
  owner: string;
  status: ContractStatus;
  autoRenew: boolean;
}

export interface AmcInvoice {
  id: string;
  contractId: string;
  company: string;
  amount: number;
  taxPercent: number;
  issuedOn: string;
  dueOn: string;
  status: InvoiceStatus;
}

export interface AmcVisit {
  id: string;
  contractId: string;
  company: string;
  scheduledOn: string;
  engineer: string;
  type: "preventive" | "corrective" | "audit";
  notes: string;
  status: VisitStatus;
}

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  entity: string;
  at: string;
}

interface DB {
  companies: Company[];
  assets: Asset[];
  tickets: Ticket[];
  engineers: Engineer[];
  endpoints: Endpoint[];
  contracts: AmcContract[];
  invoices: AmcInvoice[];
  visits: AmcVisit[];
  audit: AuditEntry[];
}

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

const db: DB = {
  companies: [
    { id: "CMP-1001", name: "Aurora Textiles Pvt Ltd", gstin: "27AAECA1234F1Z5", contactPerson: "Ravi Menon", email: "ravi@auroratex.in", phone: "+91 98200 11223", city: "Mumbai", branches: 7, assets: 214, amcStatus: "active", status: "active" },
    { id: "CMP-1002", name: "Northline Logistics", gstin: "29AAGCN5567K1Z2", contactPerson: "Sneha Rao", email: "sneha@northline.co", phone: "+91 98450 77112", city: "Bengaluru", branches: 12, assets: 486, amcStatus: "expiring", status: "active" },
    { id: "CMP-1003", name: "Meridian Health Group", gstin: "07AAFCM8890Q1Z9", contactPerson: "Dr. Anil Kapoor", email: "anil@meridianhg.in", phone: "+91 99100 44556", city: "New Delhi", branches: 5, assets: 178, amcStatus: "active", status: "active" },
    { id: "CMP-1004", name: "Sterling Retail Chain", gstin: "33AACCS2210L1ZB", contactPerson: "Divya Iyer", email: "divya@sterlingretail.in", phone: "+91 90030 33445", city: "Chennai", branches: 21, assets: 892, amcStatus: "active", status: "active" },
    { id: "CMP-1005", name: "Vertex Manufacturing", gstin: "24AABCV7788M1Z1", contactPerson: "Kunal Shah", email: "kunal@vertexmfg.com", phone: "+91 99790 66778", city: "Ahmedabad", branches: 3, assets: 96, amcStatus: "expired", status: "inactive" },
  ],
  assets: [
    { id: "AST-4401", name: "Lobby Dome Camera", type: "CCTV", serial: "HK-DS2CD-77812", brand: "Hikvision", company: "Aurora Textiles Pvt Ltd", branch: "Andheri HQ", warrantyEnd: "2027-03-14", health: 96, status: "active", engineer: "Imran Sheikh" },
    { id: "AST-4402", name: "Warehouse NVR Stack", type: "NVR", serial: "DA-NVR-33091", brand: "Dahua", company: "Northline Logistics", branch: "Whitefield DC", warrantyEnd: "2026-11-02", health: 71, status: "maintenance", engineer: "Priya Nair" },
    { id: "AST-4403", name: "Core Switch – Floor 3", type: "Switch", serial: "CS-C9200-1120", brand: "Cisco", company: "Meridian Health Group", branch: "Saket Wing B", warrantyEnd: "2028-01-20", health: 99, status: "active", engineer: "Rahul Verma" },
    { id: "AST-4404", name: "Entry Biometric Terminal", type: "Biometric", serial: "ES-F22-99120", brand: "ESSL", company: "Sterling Retail Chain", branch: "T. Nagar Store", warrantyEnd: "2026-08-09", health: 44, status: "faulty", engineer: "Imran Sheikh" },
    { id: "AST-4405", name: "Perimeter Firewall", type: "Firewall", serial: "FG-100F-22011", brand: "Fortinet", company: "Northline Logistics", branch: "Hebbal Hub", warrantyEnd: "2027-06-30", health: 88, status: "active", engineer: "Sanjay Pillai" },
    { id: "AST-4406", name: "Rack Server – ERP", type: "Server", serial: "DL380-G10-4412", brand: "HPE", company: "Vertex Manufacturing", branch: "Sanand Plant", warrantyEnd: "2026-02-18", health: 63, status: "maintenance", engineer: "Priya Nair" },
    { id: "AST-4407", name: "Cold Storage Camera 12", type: "CCTV", serial: "HK-DS2DE-11245", brand: "Hikvision", company: "Northline Logistics", branch: "Whitefield DC", warrantyEnd: "2027-09-11", health: 92, status: "active", engineer: "Rahul Verma" },
    { id: "AST-4408", name: "Branch UPS 6kVA", type: "UPS", serial: "APC-SRT6K-8891", brand: "APC", company: "Sterling Retail Chain", branch: "Velachery Store", warrantyEnd: "2026-05-27", health: 79, status: "active", engineer: "Sanjay Pillai" },
  ],
  tickets: [
    { id: "TKT-9001", subject: "Camera 12 offline in cold storage", company: "Northline Logistics", category: "CCTV", priority: "critical", status: "in_progress", engineer: "Rahul Verma", slaHours: 4, createdAt: "2026-07-27" },
    { id: "TKT-9002", subject: "Biometric punch sync failing", company: "Sterling Retail Chain", category: "Biometric", priority: "high", status: "open", engineer: "Imran Sheikh", slaHours: 8, createdAt: "2026-07-27" },
    { id: "TKT-9003", subject: "Packet loss on Hebbal uplink", company: "Northline Logistics", category: "Network", priority: "high", status: "on_hold", engineer: "Sanjay Pillai", slaHours: 8, createdAt: "2026-07-26" },
    { id: "TKT-9004", subject: "ERP server disk at 91%", company: "Vertex Manufacturing", category: "Server", priority: "medium", status: "in_progress", engineer: "Priya Nair", slaHours: 24, createdAt: "2026-07-26" },
    { id: "TKT-9005", subject: "NVR firmware upgrade request", company: "Aurora Textiles Pvt Ltd", category: "CCTV", priority: "low", status: "resolved", engineer: "Rahul Verma", slaHours: 48, createdAt: "2026-07-24" },
    { id: "TKT-9006", subject: "Add 4 cameras at Saket Wing C", company: "Meridian Health Group", category: "CCTV", priority: "medium", status: "open", engineer: "Priya Nair", slaHours: 24, createdAt: "2026-07-25" },
  ],
  engineers: [
    { id: "ENG-201", name: "Rahul Verma", role: "Senior Field Engineer", region: "Bengaluru", availability: "on_site", openTickets: 4, rating: 4.8, phone: "+91 98860 22331" },
    { id: "ENG-202", name: "Priya Nair", role: "Systems Engineer", region: "Ahmedabad", availability: "online", openTickets: 3, rating: 4.6, phone: "+91 99091 55420" },
    { id: "ENG-203", name: "Imran Sheikh", role: "Field Engineer", region: "Chennai", availability: "on_site", openTickets: 5, rating: 4.4, phone: "+91 90030 11987" },
    { id: "ENG-204", name: "Sanjay Pillai", role: "Network Engineer", region: "Bengaluru", availability: "online", openTickets: 2, rating: 4.9, phone: "+91 98456 77120" },
    { id: "ENG-205", name: "Neha Bhatt", role: "Helpdesk Executive", region: "Mumbai", availability: "offline", openTickets: 0, rating: 4.5, phone: "+91 98200 65431" },
  ],
  endpoints: [
    { id: "EP-7001", hostname: "AUR-HQ-NVR01", os: "Linux 6.1 (Embedded)", ip: "10.14.2.11", company: "Aurora Textiles Pvt Ltd", agent: "online", cpu: 34, ram: 61, disk: 72, patchLevel: "current", lastHeartbeat: "12s ago" },
    { id: "EP-7002", hostname: "NLL-WFD-SRV02", os: "Windows Server 2022", ip: "10.22.8.40", company: "Northline Logistics", agent: "online", cpu: 78, ram: 84, disk: 91, patchLevel: "pending", lastHeartbeat: "8s ago" },
    { id: "EP-7003", hostname: "MHG-SKT-FW01", os: "FortiOS 7.4", ip: "10.31.0.1", company: "Meridian Health Group", agent: "online", cpu: 21, ram: 38, disk: 25, patchLevel: "current", lastHeartbeat: "5s ago" },
    { id: "EP-7004", hostname: "SRC-TNG-BIO04", os: "Android 11 (Device)", ip: "10.44.5.22", company: "Sterling Retail Chain", agent: "offline", cpu: 0, ram: 0, disk: 48, patchLevel: "critical", lastHeartbeat: "3h 12m ago" },
    { id: "EP-7005", hostname: "VXM-SND-ERP01", os: "Ubuntu 22.04 LTS", ip: "10.55.1.9", company: "Vertex Manufacturing", agent: "online", cpu: 66, ram: 74, disk: 88, patchLevel: "pending", lastHeartbeat: "17s ago" },
  ],
  contracts: [
    { id: "AMC-3001", company: "Aurora Textiles Pvt Ltd", plan: "Comprehensive", startDate: "2025-09-01", endDate: "2026-08-31", value: 480000, billingCycle: "quarterly", coveredAssets: 214, visitsPerYear: 12, slaHours: 4, owner: "Rahul Verma", status: "expiring", autoRenew: true },
    { id: "AMC-3002", company: "Northline Logistics", plan: "Comprehensive", startDate: "2026-01-15", endDate: "2027-01-14", value: 1250000, billingCycle: "monthly", coveredAssets: 486, visitsPerYear: 24, slaHours: 4, owner: "Sanjay Pillai", status: "active", autoRenew: true },
    { id: "AMC-3003", company: "Meridian Health Group", plan: "Non-Comprehensive", startDate: "2026-04-01", endDate: "2027-03-31", value: 390000, billingCycle: "half_yearly", coveredAssets: 178, visitsPerYear: 8, slaHours: 8, owner: "Priya Nair", status: "active", autoRenew: false },
    { id: "AMC-3004", company: "Sterling Retail Chain", plan: "Comprehensive", startDate: "2025-11-01", endDate: "2026-09-15", value: 1740000, billingCycle: "quarterly", coveredAssets: 892, visitsPerYear: 24, slaHours: 4, owner: "Imran Sheikh", status: "expiring", autoRenew: false },
    { id: "AMC-3005", company: "Vertex Manufacturing", plan: "Labour Only", startDate: "2025-02-01", endDate: "2026-01-31", value: 210000, billingCycle: "annual", coveredAssets: 96, visitsPerYear: 4, slaHours: 24, owner: "Priya Nair", status: "expired", autoRenew: false },
  ],
  invoices: [
    { id: "INV-5001", contractId: "AMC-3002", company: "Northline Logistics", amount: 104166, taxPercent: 18, issuedOn: "2026-07-01", dueOn: "2026-07-15", status: "paid" },
    { id: "INV-5002", contractId: "AMC-3004", company: "Sterling Retail Chain", amount: 435000, taxPercent: 18, issuedOn: "2026-07-01", dueOn: "2026-07-31", status: "unpaid" },
    { id: "INV-5003", contractId: "AMC-3001", company: "Aurora Textiles Pvt Ltd", amount: 120000, taxPercent: 18, issuedOn: "2026-06-01", dueOn: "2026-06-30", status: "overdue" },
    { id: "INV-5004", contractId: "AMC-3003", company: "Meridian Health Group", amount: 195000, taxPercent: 18, issuedOn: "2026-08-01", dueOn: "2026-08-20", status: "unpaid" },
  ],
  visits: [
    { id: "VST-6001", contractId: "AMC-3002", company: "Northline Logistics", scheduledOn: "2026-08-12", engineer: "Sanjay Pillai", type: "preventive", notes: "Quarterly NVR health check, Whitefield DC", status: "scheduled" },
    { id: "VST-6002", contractId: "AMC-3001", company: "Aurora Textiles Pvt Ltd", scheduledOn: "2026-07-22", engineer: "Rahul Verma", type: "preventive", notes: "Camera lens cleaning and firmware audit", status: "completed" },
    { id: "VST-6003", contractId: "AMC-3004", company: "Sterling Retail Chain", scheduledOn: "2026-08-05", engineer: "Imran Sheikh", type: "corrective", notes: "Biometric terminal replacement, T. Nagar", status: "missed" },
    { id: "VST-6004", contractId: "AMC-3003", company: "Meridian Health Group", scheduledOn: "2026-08-19", engineer: "Priya Nair", type: "audit", notes: "Compliance audit for Saket Wing B", status: "scheduled" },
  ],
  audit: [
    { id: uid("AUD"), actor: "system", action: "Nightly AMC expiry scan completed", entity: "AMC Engine", at: "02:00" },
  ],
};

type Listener = () => void;
const listeners = new Set<Listener>();
let snapshotVersion = { ...db };

function emit() {
  snapshotVersion = { ...db };
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot() {
  return snapshotVersion;
}

export function logAudit(actor: string, action: string, entity: string) {
  db.audit = [
    { id: uid("AUD"), actor, action, entity, at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ...db.audit,
  ].slice(0, 60);
}

/* ---------- Companies ---------- */
export function createCompany(input: Omit<Company, "id" | "branches" | "assets">) {
  const company: Company = { ...input, id: uid("CMP"), branches: 1, assets: 0 };
  db.companies = [company, ...db.companies];
  logAudit("D. Administrator", `Created company ${company.name}`, "Companies");
  emit();
  return company;
}
export function updateCompany(id: string, patch: Partial<Company>) {
  db.companies = db.companies.map((c) => (c.id === id ? { ...c, ...patch } : c));
  logAudit("D. Administrator", `Updated company ${id}`, "Companies");
  emit();
}
export function deleteCompany(id: string) {
  db.companies = db.companies.filter((c) => c.id !== id);
  logAudit("D. Administrator", `Deleted company ${id}`, "Companies");
  emit();
}

/* ---------- Assets ---------- */
export function createAsset(input: Omit<Asset, "id">) {
  const asset: Asset = { ...input, id: uid("AST") };
  db.assets = [asset, ...db.assets];
  logAudit("D. Administrator", `Registered asset ${asset.name}`, "Assets");
  emit();
  return asset;
}
export function updateAsset(id: string, patch: Partial<Asset>) {
  db.assets = db.assets.map((a) => (a.id === id ? { ...a, ...patch } : a));
  logAudit("D. Administrator", `Updated asset ${id}`, "Assets");
  emit();
}
export function deleteAssets(ids: string[]) {
  db.assets = db.assets.filter((a) => !ids.includes(a.id));
  logAudit("D. Administrator", `Deleted ${ids.length} asset(s)`, "Assets");
  emit();
}

/* ---------- Tickets ---------- */
export function createTicket(input: Omit<Ticket, "id" | "createdAt">) {
  const ticket: Ticket = { ...input, id: uid("TKT"), createdAt: new Date().toISOString().slice(0, 10) };
  db.tickets = [ticket, ...db.tickets];
  logAudit("Helpdesk", `Raised ticket ${ticket.id}`, "Tickets");
  emit();
  return ticket;
}
export function updateTicket(id: string, patch: Partial<Ticket>) {
  db.tickets = db.tickets.map((t) => (t.id === id ? { ...t, ...patch } : t));
  logAudit("Helpdesk", `Updated ticket ${id}`, "Tickets");
  emit();
}
export function deleteTicket(id: string) {
  db.tickets = db.tickets.filter((t) => t.id !== id);
  logAudit("Helpdesk", `Deleted ticket ${id}`, "Tickets");
  emit();
}

/* ---------- Endpoints ---------- */
export function endpointAction(id: string, action: "restart" | "shutdown" | "patch" | "diagnose") {
  db.endpoints = db.endpoints.map((e) => {
    if (e.id !== id) return e;
    if (action === "shutdown") return { ...e, agent: "offline", cpu: 0, ram: 0, lastHeartbeat: "just now" };
    if (action === "restart") return { ...e, agent: "online", cpu: 12, ram: 28, lastHeartbeat: "just now" };
    if (action === "patch") return { ...e, patchLevel: "current" as const, lastHeartbeat: "just now" };
    return { ...e, lastHeartbeat: "just now" };
  });
  logAudit("D. Administrator", `Remote ${action} on ${id}`, "Endpoints");
  emit();
}

/* ---------- AMC ---------- */
export function daysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000);
}

export function contractStatusFor(endDate: string): ContractStatus {
  const d = daysUntil(endDate);
  return d < 0 ? "expired" : d <= 60 ? "expiring" : "active";
}

export function createContract(
  input: Omit<AmcContract, "id" | "status"> & { status?: ContractStatus },
) {
  const contract: AmcContract = {
    ...input,
    id: uid("AMC"),
    status: input.status ?? contractStatusFor(input.endDate),
  };
  db.contracts = [contract, ...db.contracts];
  db.companies = db.companies.map((c) =>
    c.name === contract.company ? { ...c, amcStatus: contract.status === "expired" ? "expired" : contract.status === "expiring" ? "expiring" : "active" } : c,
  );
  logAudit("D. Administrator", `Created AMC contract ${contract.id} for ${contract.company}`, "AMC");
  emit();
  return contract;
}

export function updateContract(id: string, patch: Partial<AmcContract>) {
  db.contracts = db.contracts.map((c) => (c.id === id ? { ...c, ...patch } : c));
  logAudit("D. Administrator", `Updated AMC contract ${id}`, "AMC");
  emit();
}

export function deleteContract(id: string) {
  db.contracts = db.contracts.filter((c) => c.id !== id);
  db.invoices = db.invoices.filter((i) => i.contractId !== id);
  db.visits = db.visits.filter((v) => v.contractId !== id);
  logAudit("D. Administrator", `Terminated AMC contract ${id}`, "AMC");
  emit();
}

/** Renews a contract by N months and raises the renewal invoice. */
export function renewContract(id: string, months = 12) {
  const contract = db.contracts.find((c) => c.id === id);
  if (!contract) return;
  const base = new Date(contract.endDate);
  const start = new Date(base.getTime() + 86_400_000);
  const end = new Date(base);
  end.setMonth(end.getMonth() + months);
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  db.contracts = db.contracts.map((c) =>
    c.id === id ? { ...c, startDate: iso(start), endDate: iso(end), status: contractStatusFor(iso(end)) } : c,
  );
  db.companies = db.companies.map((c) => (c.name === contract.company ? { ...c, amcStatus: "active" } : c));

  const due = new Date();
  due.setDate(due.getDate() + 15);
  db.invoices = [
    {
      id: uid("INV"),
      contractId: id,
      company: contract.company,
      amount: Math.round(contract.value * (months / 12)),
      taxPercent: 18,
      issuedOn: iso(new Date()),
      dueOn: iso(due),
      status: "unpaid",
    },
    ...db.invoices,
  ];
  logAudit("D. Administrator", `Renewed ${id} for ${months} months`, "AMC");
  emit();
}

export function createInvoice(input: Omit<AmcInvoice, "id" | "issuedOn"> & { issuedOn?: string }) {
  const invoice: AmcInvoice = { ...input, id: uid("INV"), issuedOn: input.issuedOn ?? new Date().toISOString().slice(0, 10) };
  db.invoices = [invoice, ...db.invoices];
  logAudit("Billing", `Raised invoice ${invoice.id}`, "AMC Invoices");
  emit();
  return invoice;
}

export function updateInvoice(id: string, patch: Partial<AmcInvoice>) {
  db.invoices = db.invoices.map((i) => (i.id === id ? { ...i, ...patch } : i));
  logAudit("Billing", `Updated invoice ${id}`, "AMC Invoices");
  emit();
}

export function deleteInvoice(id: string) {
  db.invoices = db.invoices.filter((i) => i.id !== id);
  logAudit("Billing", `Voided invoice ${id}`, "AMC Invoices");
  emit();
}

export function scheduleVisit(input: Omit<AmcVisit, "id" | "status"> & { status?: VisitStatus }) {
  const visit: AmcVisit = { ...input, id: uid("VST"), status: input.status ?? "scheduled" };
  db.visits = [visit, ...db.visits];
  logAudit("D. Administrator", `Scheduled ${visit.type} visit ${visit.id}`, "AMC Visits");
  emit();
  return visit;
}

export function updateVisit(id: string, patch: Partial<AmcVisit>) {
  db.visits = db.visits.map((v) => (v.id === id ? { ...v, ...patch } : v));
  logAudit("D. Administrator", `Updated visit ${id}`, "AMC Visits");
  emit();
}

export function deleteVisit(id: string) {
  db.visits = db.visits.filter((v) => v.id !== id);
  logAudit("D. Administrator", `Cancelled visit ${id}`, "AMC Visits");
  emit();
}

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export function toCsv<T extends object>(rows: T[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape((r as Record<string, unknown>)[h])).join(",")),
  ].join("\n");
}

export function downloadCsv<T extends object>(filename: string, rows: T[]) {
  const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
