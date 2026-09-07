/**
 * projects.js — project catalogue (structure only).
 *
 * Prose (title, tagline, problem, solution, features, challenges, role,
 * screenshot captions) lives in lang/*.json under `projects.items.<id>`.
 *
 * Naming rule: internal repository names are never surfaced. Related
 * services are presented as the one engineering system they actually form —
 * e.g. the datalogger core, sync services and XML/DB converters are a single
 * "Industrial Data Acquisition & Synchronisation Platform".
 *
 * `shots` reference real screenshots only. Systems whose interfaces are not
 * publishable are drawn as generated architecture schematics instead of
 * being padded out with stock photography.
 */

export const CATEGORIES = [
  { id: 'all',        color: 'var(--accent)' },
  { id: 'cloud',      color: '#8ab4ff' },
  { id: 'industrial', color: 'var(--accent)' },
  { id: 'data',       color: 'var(--violet)' },
  { id: 'energy',     color: 'var(--accent-2)' },
  { id: 'tools',      color: 'var(--ok)' },
  { id: 'embedded',   color: '#63b3ff' },
  { id: 'apps',       color: '#f472b6' },
];

export const PROJECTS = [
  /* ---------------------------------------------------------------- */
  {
    id: 'israr-cloud',
    category: 'cloud',
    flagship: true,
    schematic: 'hub',
    tag: 'Cloud Platform',
    tech: ['ASP.NET Core', '.NET 8', 'C#', 'Web API', 'JWT', 'MySQL', 'Redis', 'Angular'],
    pipeline: ['Site Databases', 'Discovery Layer', 'ASP.NET Core API', 'JWT / RBAC', 'Angular Client'],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'datalogger',
    category: 'data',
    flagship: true,
    schematic: 'chain',
    tag: 'Data Acquisition',
    tech: ['C#', '.NET', 'Modbus TCP/RTU', 'MQTT', 'MySQL', 'SQLite', 'Redis', 'Background Services'],
    pipeline: ['Field Devices', 'Modbus / MQTT', 'Datalogger Service', 'Local Buffer', 'Sync Service', 'Central Database', 'REST API'],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'ppc',
    category: 'energy',
    flagship: true,
    schematic: 'loop',
    tag: 'Renewable Energy',
    tech: ['C#', '.NET', 'Modbus TCP', 'Power Meters', 'Inverters', 'SQL', 'Background Services'],
    pipeline: ['Grid Meter', 'Setpoint Logic', 'Control Service', 'Inverter Commands', 'Feedback Loop', 'SCADA Telemetry'],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'alarm-engine',
    category: 'industrial',
    flagship: true,
    schematic: 'tree',
    tag: 'SCADA',
    tech: ['ASP.NET Core', 'C#', 'SignalR', 'SQL Server', 'Redis', 'REST API'],
    pipeline: ['Tag Stream', 'Rule Evaluation', 'Alarm State Machine', 'Event Store', 'Push Channel', 'Operator Console'],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'solar-tracker',
    category: 'energy',
    tag: 'Solar Tracking',
    tech: ['C#', '.NET', 'Modbus RTU', 'Serial / RS-485', 'Sensors', 'Actuator Control'],
    pipeline: ['Position Sensors', 'Modbus RTU', 'Tracking Logic', 'Actuator Commands', 'Status Telemetry'],
    shots: [
      'images/Tracker01.webp',
      'images/Tracker02.webp',
      'images/Tracker03.webp',
      'images/Tracker04.webp',
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'protocol-toolkit',
    category: 'tools',
    tag: 'Engineering Tools',
    tech: ['C#', '.NET', 'Modbus TCP', 'Modbus RTU', 'RS-485', 'TCP / UDP', 'WinForms'],
    pipeline: ['Device Under Test', 'Modbus Master / Slave', 'Register Map & Scaling', 'Serial-to-IP Bridge', 'Tx/Rx Diagnostics'],
    shots: [
      'images/modbusMaster01.webp',
      'images/modbusMaster03.webp',
      'images/modbusMaster02.webp',
      'images/Slave01.webp',
      'images/Slave02.webp',
      'images/Portforwarder01.webp',
      'images/Portforwarder02.webp',
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'device-configurator',
    category: 'embedded',
    tag: 'Device Commissioning',
    tech: ['C#', '.NET', 'SAMD21 / ARM Cortex-M', 'Modbus', 'I²C', 'Arduino', 'PlatformIO', 'RS-485'],
    pipeline: ['Device Database', 'Interface & Protocol Config', 'Write to Device (USB / HTTP)', 'Register & IO Verification', 'Firmware Project Generation'],
    shots: [
      'images/Config01.webp',
      'images/Config02.webp',
      'images/Config03.webp',
      'images/Config04.webp',
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'breaker-control',
    category: 'industrial',
    schematic: 'loop',
    tag: 'Remote Control',
    tech: ['C#', '.NET', 'Modbus TCP', 'REST API', 'VPN', 'SQL'],
    pipeline: ['Operator Request', 'Command Validation', 'Control Service', 'Switchgear Interface', 'Status Readback', 'Audit Trail'],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'api-integrations',
    category: 'cloud',
    schematic: 'hub',
    tag: 'System Integration',
    tech: ['Python', 'FastAPI', 'C#', 'REST', 'OAuth2', 'JSON / XML', 'MySQL'],
    pipeline: ['Vendor Cloud APIs', 'Auth & Token Handling', 'Normalisation Layer', 'Scheduler', 'Internal Database', 'Downstream API'],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'cmms',
    category: 'apps',
    schematic: 'tree',
    tag: 'Asset Management',
    tech: ['ASP.NET Core', 'C#', 'MySQL', 'REST API', 'Bootstrap', 'Role-Based Access'],
    pipeline: ['Asset Register', 'Maintenance Plans', 'Work Orders', 'Equipment History', 'Reporting'],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'cowrmat',
    category: 'apps',
    tag: 'Decision Support',
    tech: ['Web Application', 'MySQL', 'FAO-56 ETo / Kc / ETc', 'CSV Import', 'Charting', 'Excel / PDF Export', 'RBAC'],
    pipeline: ['Crop & Planting Inputs', 'WWTP Flow Data (CSV)', 'ETo / Kc / ETc Model', 'Irrigation Efficiency', 'Allocation Results', 'Excel / PDF Reports'],
    shots: [
      'images/agri1.webp',
      'images/agri2.webp',
      'images/agri3.webp',
      'images/agri4.webp',
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'ecommerce',
    category: 'apps',
    schematic: 'tree',
    tag: 'E-Commerce',
    tech: ['ASP.NET Core', 'C#', 'MySQL', 'Payment APIs', 'REST API', 'Redis'],
    pipeline: ['Storefront', 'Catalogue & Cart', 'Order Service', 'Payment Gateway', 'Order Tracking', 'Admin Dashboard'],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'hotel',
    category: 'apps',
    schematic: 'hub',
    tag: 'Reservations',
    tech: ['ASP.NET Core', 'C#', 'MySQL', 'Payment APIs', 'Email Notifications', 'REST API'],
    pipeline: ['Availability Search', 'Rate & Room Calendar', 'Reservation Service', 'Payment Gateway', 'Confirmation Email', 'Admin Dashboard'],
  },

];

/** Resolve a category's accent colour, falling back to the primary accent. */
export const categoryColor = (id) =>
  CATEGORIES.find((c) => c.id === id)?.color || 'var(--accent)';

/** Card visual: first real screenshot if one exists, otherwise a schematic. */
export const coverOf = (p) => (p.shots?.length ? p.shots[0] : null);
