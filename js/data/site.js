/**
 * site.js — structural site data.
 *
 * Split of concerns: this file holds *structure* (ids, ordering, icons,
 * accent colours, technology tokens). All prose lives in lang/en.json and
 * lang/ar.json under the matching id, so adding a language never means
 * touching JavaScript.
 *
 * Technology tokens are deliberately NOT translated — protocol and product
 * names ("Modbus TCP", "ASP.NET Core") stay in Latin script in both locales.
 */

/* --------------------------------------------------------------------------
   Hero signal chain — field device through to operator interface
   -------------------------------------------------------------------------- */

export const SIGNAL_CHAIN = [
  { id: 'field',   icon: 'cpu',      proto: 'RS-485 / TCP' },
  { id: 'protocol',icon: 'radio',    proto: 'Modbus · MQTT' },
  { id: 'edge',    icon: 'gateway',  proto: 'Edge' },
  { id: 'service', icon: 'server',   proto: '.NET · Python' },
  { id: 'store',   icon: 'database', proto: 'SQL · Redis' },
  { id: 'cloud',   icon: 'cloud',    proto: 'REST · JWT' },
  { id: 'ui',      icon: 'gauge',    proto: 'SCADA', out: true },
];

/* --------------------------------------------------------------------------
   Hero metrics — every figure here is taken verbatim from the CV.
   -------------------------------------------------------------------------- */

export const METRICS = [
  { id: 'throughput', value: 60000, suffix: '+', countable: true },
  { id: 'sites',      value: 10,    suffix: '+', countable: true },
  { id: 'since',      value: 2022,  raw: '2022' },
  { id: 'layers',     value: 7,     countable: true },
];

/* --------------------------------------------------------------------------
   Engineering ecosystem — the seven layers I work across
   -------------------------------------------------------------------------- */

export const LAYERS = [
  {
    id: 'field',
    color: 'var(--accent-2)',
    tech: ['PLCs', 'Power Meters', 'Inverters', 'Sensors', 'Breakers', 'Solar Trackers', 'Arduino / MCU'],
  },
  {
    id: 'comms',
    color: '#63b3ff',
    tech: ['Modbus TCP', 'Modbus RTU', 'MQTT', 'Serial / RS-485', 'TCP / UDP', 'HTTP / REST', 'WireGuard VPN'],
  },
  {
    id: 'edge',
    color: 'var(--accent)',
    tech: ['Dataloggers', 'Protocol Gateways', 'Background Services', 'Buffering & Retry', 'Serial-to-IP', 'Local Store & Forward'],
  },
  {
    id: 'backend',
    color: '#4fd1c5',
    tech: ['ASP.NET Core', '.NET 8', 'C#', 'Web API', 'EF Core', 'Python', 'FastAPI', 'PHP / Laravel', 'SignalR', 'Async & Multithreading'],
  },
  {
    id: 'data',
    color: 'var(--violet)',
    tech: ['SQL Server', 'MySQL', 'Redis', 'SQLite', 'Time-Series Storage', 'Query Optimisation', 'JSON / XML'],
  },
  {
    id: 'app',
    color: '#f472b6',
    tech: ['SCADA / HMI', 'Angular', 'Operator Dashboards', 'Historical Trends', 'Alarm Views', 'CMMS', 'Reporting'],
  },
  {
    id: 'infra',
    color: 'var(--ok)',
    tech: ['Linux', 'Windows Server', 'IIS', 'Nginx', 'Plesk', 'cPanel', 'SSL / TLS', 'Reverse Proxy', 'Backups'],
  },
];

/* --------------------------------------------------------------------------
   "From Field Device to Cloud" — interactive architecture walk-through.
   `io` gives the concrete input/output contract of each stage.
   -------------------------------------------------------------------------- */

export const STAGES = [
  {
    id: 'device',
    icon: 'chip',
    color: 'var(--accent-2)',
    tech: ['Inverters', 'Power Meters', 'PLCs', 'Sensors', 'Solar Trackers'],
  },
  {
    id: 'protocol',
    icon: 'radio',
    color: '#63b3ff',
    tech: ['Modbus TCP', 'Modbus RTU', 'MQTT', 'RS-485', 'TCP / UDP'],
  },
  {
    id: 'edge',
    icon: 'gateway',
    color: 'var(--accent)',
    tech: ['Datalogger', 'Polling Scheduler', 'Store & Forward', 'SQLite Buffer'],
  },
  {
    id: 'service',
    icon: 'server',
    color: '#4fd1c5',
    tech: ['ASP.NET Core', 'Background Services', 'Python', 'Parallel Processing'],
  },
  {
    id: 'store',
    icon: 'database',
    color: 'var(--violet)',
    tech: ['SQL Server', 'MySQL', 'Redis', 'Historical Tables'],
  },
  {
    id: 'api',
    icon: 'cloud',
    color: '#8ab4ff',
    tech: ['REST API', 'JWT / OAuth2', 'Swagger', 'Role-Based Access'],
  },
  {
    id: 'ui',
    icon: 'monitor',
    color: '#f472b6',
    tech: ['SCADA Dashboards', 'Angular', 'Trends', 'Alarm Console'],
  },
];

/* --------------------------------------------------------------------------
   "What I Build" — capability / services grid
   -------------------------------------------------------------------------- */

export const CAPABILITIES = [
  { id: 'industrial',  icon: 'layers' },
  { id: 'scada',       icon: 'gauge' },
  { id: 'acquisition', icon: 'activity' },
  { id: 'iot',         icon: 'chip' },
  { id: 'backend',     icon: 'server' },
  { id: 'energy',      icon: 'sun' },
  { id: 'protocols',   icon: 'radio' },
  { id: 'tools',       icon: 'wrench' },
  { id: 'deployment',  icon: 'terminal' },
  { id: 'remote',      icon: 'network' },
];

/* --------------------------------------------------------------------------
   Technical skills — grouped, never a single undifferentiated logo wall
   -------------------------------------------------------------------------- */

export const SKILL_GROUPS = [
  {
    id: 'software',
    icon: 'code',
    color: 'var(--accent)',
    items: ['C#', '.NET 8', 'ASP.NET Core', 'Entity Framework Core', 'LINQ', 'Python', 'PHP', 'Laravel', 'JavaScript', 'TypeScript'],
  },
  {
    id: 'frontend',
    icon: 'monitor',
    color: '#f472b6',
    items: ['Angular', 'HTML5', 'CSS3', 'Responsive UI', 'SCADA Dashboards', 'Data Visualisation'],
  },
  {
    id: 'backend',
    icon: 'server',
    color: '#4fd1c5',
    items: ['REST APIs', 'Web API', 'FastAPI', 'Background Services', 'SignalR', 'WebSockets', 'JWT', 'OAuth2', 'RBAC', 'Async / Await', 'Multithreading', 'Message Queuing'],
  },
  {
    id: 'data',
    icon: 'database',
    color: 'var(--violet)',
    items: ['SQL Server', 'MySQL', 'Redis', 'SQLite', 'Database Design', 'Query Optimisation', 'Time-Series Data', 'JSON / XML'],
  },
  {
    id: 'industrial',
    icon: 'gauge',
    color: 'var(--accent-2)',
    items: ['SCADA', 'PPC', 'Modbus TCP / RTU', 'MQTT', 'Serial Communication', 'Data Acquisition', 'Datalogging', 'Real-Time Telemetry', 'PLC Integration'],
  },
  {
    id: 'embedded',
    icon: 'chip',
    color: '#63b3ff',
    items: ['Arduino', 'Microcontrollers', 'Sensors', 'Dataloggers', 'Inverters', 'Power Meters', 'Solar Tracking Systems'],
  },
  {
    id: 'infra',
    icon: 'terminal',
    color: 'var(--ok)',
    items: ['Linux', 'Windows Server', 'IIS', 'Nginx', 'Plesk', 'cPanel', 'VPS Administration', 'Reverse Proxy', 'SSL / TLS', 'Backup & Recovery'],
  },
  {
    id: 'network',
    icon: 'network',
    color: '#8ab4ff',
    items: ['WireGuard', 'VPN', 'TCP/IP', 'Port Forwarding', 'Serial-to-IP', 'Remote Site Connectivity', 'DNS'],
  },
  {
    id: 'practice',
    icon: 'clipboard',
    color: '#a3a3a3',
    items: ['Git / GitHub', 'Visual Studio', 'VS Code', 'Swagger / OpenAPI', 'Postman', 'Agile / Scrum', 'SDLC', 'System Design'],
  },
];

/* --------------------------------------------------------------------------
   Infrastructure operations — the deploy-and-run side of the work
   -------------------------------------------------------------------------- */

export const INFRA_OPS = [
  { id: 'windows',  icon: 'server',   meta: 'Windows Server · IIS' },
  { id: 'linux',    icon: 'terminal', meta: 'Ubuntu / Debian VPS · Nginx' },
  { id: 'panels',   icon: 'sliders',  meta: 'Plesk · cPanel' },
  { id: 'tunnels',  icon: 'shield',   meta: 'WireGuard · Port Forwarding' },
  { id: 'tls',      icon: 'lock',     meta: 'SSL/TLS · DNS · Reverse Proxy' },
  { id: 'backup',   icon: 'refresh',  meta: 'Backups · Monitoring' },
];

/* --------------------------------------------------------------------------
   Contact channels
   -------------------------------------------------------------------------- */

export const CHANNELS = [
  {
    id: 'email',
    icon: 'mail',
    color: 'var(--accent)',
    value: 'mohannad.muhana@gmail.com',
    href: 'mailto:mohannad.muhana@gmail.com',
  },
  {
    id: 'whatsapp',
    icon: 'chat',
    color: 'var(--ok)',
    value: '+962 7 8086 9084',
    href: 'https://wa.me/962780869084',
    external: true,
  },
  {
    id: 'phone',
    icon: 'phone',
    color: 'var(--accent-2)',
    value: '+962 7 8086 9084',
    href: 'tel:+962780869084',
  },
  {
    id: 'linkedin',
    icon: 'linkedin',
    color: '#63b3ff',
    value: 'linkedin.com/in/mohannadmuhana',
    href: 'https://www.linkedin.com/in/mohannadmuhana/',
    external: true,
  },
  {
    id: 'location',
    icon: 'pin',
    color: 'var(--violet)',
    valueKey: 'contact.channels.location.value',
    static: true,
  },
];

export const CV_PATH = 'assets/Mohannad-Muhana-CV.pdf';
