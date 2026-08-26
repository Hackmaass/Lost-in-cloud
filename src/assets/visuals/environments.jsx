/* ============================================
   LOST IN THE CLOUD — Environment Visuals (.jsx)
   Rich, stylized atmospheric environments for scenes.
   ============================================ */

import React from 'react';

export const ENVIRONMENTS = {
  office_day: {
    id: 'office_day',
    name: 'Nexora Systems — Main Floor (Day)',
    lighting: 'day',
    svg: () => (
      <svg viewBox="0 0 1200 700" className="environment-backdrop-svg" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="office-day-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0b172a" />
            <stop offset="60%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="window-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="desk-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e2230" />
            <stop offset="100%" stopColor="#0f121a" />
          </linearGradient>
        </defs>

        {/* Backdrop Wall & Horizon */}
        <rect x="0" y="0" width="1200" height="700" fill="url(#office-day-sky)" />

        {/* Floor to ceiling architectural glass windows */}
        <rect x="100" y="60" width="1000" height="420" fill="url(#window-glow)" rx="8" stroke="#334155" strokeWidth="2" strokeOpacity="0.4" />
        <line x1="350" y1="60" x2="350" y2="480" stroke="#334155" strokeWidth="2" strokeOpacity="0.4" />
        <line x1="600" y1="60" x2="600" y2="480" stroke="#334155" strokeWidth="2" strokeOpacity="0.4" />
        <line x1="850" y1="60" x2="850" y2="480" stroke="#334155" strokeWidth="2" strokeOpacity="0.4" />

        {/* Distant Tech City Skyline outside window */}
        <rect x="150" y="240" width="60" height="240" fill="#0f172a" fillOpacity="0.7" />
        <rect x="230" y="180" width="80" height="300" fill="#0c1322" fillOpacity="0.8" />
        <rect x="380" y="210" width="90" height="270" fill="#0f172a" fillOpacity="0.7" />
        <rect x="500" y="160" width="70" height="320" fill="#090e1a" fillOpacity="0.9" />
        <rect x="640" y="220" width="110" height="260" fill="#0c1322" fillOpacity="0.8" />
        <rect x="780" y="190" width="50" height="290" fill="#0f172a" fillOpacity="0.7" />
        <rect x="870" y="250" width="90" height="230" fill="#0c1322" fillOpacity="0.8" />
        
        {/* Subtle window grid lights in buildings */}
        <circle cx="260" cy="220" r="1.5" fill="#38bdf8" fillOpacity="0.5" />
        <circle cx="530" cy="200" r="1.5" fill="#38bdf8" fillOpacity="0.6" />
        <circle cx="680" cy="260" r="1.5" fill="#38bdf8" fillOpacity="0.5" />

        {/* Office Acoustic Ceiling Baffles & Soft Lighting */}
        <line x1="0" y1="40" x2="1200" y2="40" stroke="#1e293b" strokeWidth="8" />
        <line x1="200" y1="44" x2="360" y2="44" stroke="#00d4ff" strokeWidth="3" strokeOpacity="0.6" />
        <line x1="500" y1="44" x2="700" y2="44" stroke="#00d4ff" strokeWidth="3" strokeOpacity="0.6" />
        <line x1="840" y1="44" x2="1000" y2="44" stroke="#00d4ff" strokeWidth="3" strokeOpacity="0.6" />

        {/* Open Office Workstations / Desks */}
        <polygon points="0,520 1200,520 1200,700 0,700" fill="#080c14" />
        
        {/* Midground Desks */}
        <rect x="120" y="440" width="280" height="120" rx="4" fill="url(#desk-grad)" stroke="#1e293b" strokeWidth="1" />
        <rect x="460" y="440" width="280" height="120" rx="4" fill="url(#desk-grad)" stroke="#1e293b" strokeWidth="1" />
        <rect x="800" y="440" width="280" height="120" rx="4" fill="url(#desk-grad)" stroke="#1e293b" strokeWidth="1" />

        {/* Monitors on desks */}
        <rect x="180" y="410" width="70" height="42" rx="2" fill="#0a0f18" stroke="#00d4ff" strokeWidth="1" strokeOpacity="0.4" />
        <rect x="255" y="415" width="65" height="42" rx="2" fill="#0a0f18" stroke="#334155" strokeWidth="1" />
        
        <rect x="520" y="410" width="70" height="42" rx="2" fill="#0a0f18" stroke="#ff9900" strokeWidth="1" strokeOpacity="0.4" />
        <rect x="595" y="415" width="65" height="42" rx="2" fill="#0a0f18" stroke="#334155" strokeWidth="1" />

        <rect x="860" y="410" width="70" height="42" rx="2" fill="#0a0f18" stroke="#00e676" strokeWidth="1" strokeOpacity="0.4" />
        <rect x="935" y="415" width="65" height="42" rx="2" fill="#0a0f18" stroke="#334155" strokeWidth="1" />

        {/* Nexora Wall Logo Branding */}
        <text x="600" y="100" textAnchor="middle" fill="#334155" fontSize="18" fontFamily="system-ui, sans-serif" fontWeight="700" letterSpacing="8" fillOpacity="0.4">
          NEXORA SYSTEMS // INFRASTRUCTURE
        </text>
      </svg>
    ),
  },

  workstation: {
    id: 'workstation',
    name: 'Engineering Workstation — Primary Terminal',
    lighting: 'focus',
    svg: () => (
      <svg viewBox="0 0 1200 700" className="environment-backdrop-svg" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="screen-glow-cyan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#081b2a" />
            <stop offset="100%" stopColor="#030c14" />
          </linearGradient>
          <linearGradient id="desk-mat" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#141722" />
            <stop offset="100%" stopColor="#0a0b10" />
          </linearGradient>
        </defs>

        {/* Ambient Dark Room */}
        <rect x="0" y="0" width="1200" height="700" fill="#05070c" />

        {/* Soft cyan monitor backlight glow */}
        <ellipse cx="600" cy="300" rx="450" ry="250" fill="#00d4ff" fillOpacity="0.06" />

        {/* Large Primary Ultrawide Curved Monitor */}
        <rect x="180" y="80" width="840" height="420" rx="14" fill="url(#screen-glow-cyan)" stroke="#00d4ff" strokeWidth="2" strokeOpacity="0.6" />
        <rect x="195" y="95" width="810" height="390" rx="8" fill="#030810" />

        {/* Monitor Bezel Brand */}
        <text x="600" y="515" textAnchor="middle" fill="#334155" fontSize="10" fontFamily="monospace" letterSpacing="4">NEXORA PRO-VIEW 4K</text>
        <circle cx="600" cy="505" r="2" fill="#00d4ff" />

        {/* Stand */}
        <polygon points="570,500 630,500 645,580 555,580" fill="#1e2230" />
        <ellipse cx="600" cy="580" rx="90" ry="12" fill="#161924" />

        {/* Screen Content: Terminal Prompt Header */}
        <rect x="210" y="115" width="780" height="30" rx="4" fill="#0a121e" />
        <circle cx="230" cy="130" r="4.5" fill="#ff3b3b" />
        <circle cx="245" cy="130" r="4.5" fill="#ffb347" />
        <circle cx="260" cy="130" r="4.5" fill="#00e676" />
        <text x="280" y="134" fill="#8a8aa2" fontSize="11" fontFamily="monospace">engineer@nexora-workstation-07:~$</text>

        {/* Terminal Line Snippets on Screen */}
        <text x="225" y="175" fill="#00d4ff" fontSize="13" fontFamily="monospace" fontWeight="600">NEXORA CLOUD CONSOLE v2.4.1</text>
        <text x="225" y="198" fill="#5a5a72" fontSize="12" fontFamily="monospace">Authentication: Active | Role: Junior Cloud Engineer | Region: us-east-1</text>
        <text x="225" y="230" fill="#b8b8cc" fontSize="13" fontFamily="monospace">&gt; System initialized. Awaiting user input.</text>

        {/* Yellow Sticky Note on Monitor Corner */}
        <g transform="rotate(-4 880 140)">
          <rect x="830" y="110" width="135" height="110" fill="#fef08a" rx="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
          <text x="840" y="132" fill="#854d0e" fontSize="11" fontFamily="sans-serif" fontWeight="700">STICKY NOTE:</text>
          <text x="840" y="152" fill="#713f12" fontSize="10" fontFamily="monospace" fontWeight="700">status</text>
          <text x="840" y="170" fill="#854d0e" fontSize="9" fontFamily="sans-serif">run this first.</text>
          <text x="840" y="198" fill="#a16207" fontSize="10" fontFamily="sans-serif" fontStyle="italic">— Arjun</text>
        </g>

        {/* Desk Surface & Mechanical Keyboard in Foreground */}
        <polygon points="0,560 1200,560 1200,700 0,700" fill="url(#desk-mat)" />
        <rect x="360" y="585" width="480" height="100" rx="8" fill="#0e111a" stroke="#2a2e40" strokeWidth="1.5" />
        
        {/* Subtle LED key backlight */}
        <rect x="375" y="595" width="450" height="80" rx="4" fill="#07090e" />
        <line x1="390" y1="635" x2="810" y2="635" stroke="#00d4ff" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="8 4" />
      </svg>
    ),
  },

  incident_room: {
    id: 'incident_room',
    name: 'Nexora War Room — Incident Operations',
    lighting: 'alert',
    svg: () => (
      <svg viewBox="0 0 1200 700" className="environment-backdrop-svg" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="incident-glow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#300d14" />
            <stop offset="50%" stopColor="#1a080c" />
            <stop offset="100%" stopColor="#090305" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1200" height="700" fill="url(#incident-glow)" />

        {/* Red Alert Ambient Glow on Ceiling & Floor */}
        <line x1="0" y1="30" x2="1200" y2="30" stroke="#ff3b3b" strokeWidth="4" strokeOpacity="0.8" />
        <ellipse cx="600" cy="260" rx="550" ry="220" fill="#ff3b3b" fillOpacity="0.08" />

        {/* Wall Of Giant Monitoring Displays */}
        <rect x="120" y="70" width="960" height="380" rx="10" fill="#0a0507" stroke="#ff3b3b" strokeWidth="2" strokeOpacity="0.7" />

        {/* Main Incident Display Header */}
        <rect x="140" y="90" width="920" height="50" rx="4" fill="#2d0d14" />
        <circle cx="170" cy="115" r="8" fill="#ff3b3b" />
        <text x="195" y="122" fill="#ffffff" fontSize="18" fontFamily="monospace" fontWeight="800" letterSpacing="2">
          CRITICAL ALERT // SEVERITY 1 — PRODUCTION OUTAGE
        </text>

        {/* Telemetry Panels */}
        <rect x="140" y="155" width="280" height="270" rx="6" fill="#14070a" stroke="#4a1520" strokeWidth="1" />
        <text x="160" y="185" fill="#ff3b3b" fontSize="12" fontFamily="monospace" fontWeight="700">SERVICE AVAILABILITY</text>
        <line x1="160" y1="260" x2="380" y2="260" stroke="#ff3b3b" strokeWidth="2" />
        <path d="M160 260 L240 260 L270 340 L380 340" stroke="#ff3b3b" strokeWidth="2.5" fill="none" />
        <text x="160" y="380" fill="#ff8585" fontSize="11" fontFamily="monospace">WEB TIER: 0% SUCCESS</text>

        {/* Architecture Topology View on War Room Screen */}
        <rect x="440" y="155" width="620" height="270" rx="6" fill="#14070a" stroke="#4a1520" strokeWidth="1" />
        <circle cx="560" cy="270" r="30" fill="#1f0a10" stroke="#ff3b3b" strokeWidth="2" strokeDasharray="4 4" />
        <text x="560" y="275" textAnchor="middle" fill="#ff3b3b" fontSize="11" fontFamily="monospace">EC2 PROD</text>
        <line x1="590" y1="270" x2="720" y2="270" stroke="#ff3b3b" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="760" cy="270" r="30" fill="#0d1822" stroke="#00d4ff" strokeWidth="2" />
        <text x="760" y="275" textAnchor="middle" fill="#00d4ff" fontSize="11" fontFamily="monospace">RDS PG</text>
        
        {/* Conference Room Table */}
        <polygon points="0,520 1200,520 1200,700 0,700" fill="#0a0507" />
        <polygon points="150,540 1050,540 1150,700 50,700" fill="#140b0e" stroke="#2e1017" strokeWidth="1" />
      </svg>
    ),
  },

  server_room: {
    id: 'server_room',
    name: 'Nexora Data Center — Mainframe Corridors',
    lighting: 'dark',
    svg: () => (
      <svg viewBox="0 0 1200 700" className="environment-backdrop-svg" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="1200" height="700" fill="#04060a" />

        {/* Perspective Racks */}
        <polygon points="0,0 280,180 280,540 0,700" fill="#0a0f18" stroke="#16253a" strokeWidth="2" />
        <polygon points="1200,0 920,180 920,540 1200,700" fill="#0a0f18" stroke="#16253a" strokeWidth="2" />

        {/* Glowing Server Blades Left */}
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={`rack-l-${i}`}>
            <line x1="40" y1={80 + i * 42} x2="250" y2={190 + i * 28} stroke="#00d4ff" strokeWidth="2" strokeOpacity={0.6} />
            <circle cx={60 + i * 8} cy={95 + i * 40} r="2" fill="#00e676" />
            <circle cx={90 + i * 8} cy={110 + i * 40} r="2" fill="#00d4ff" />
          </g>
        ))}

        {/* Glowing Server Blades Right */}
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={`rack-r-${i}`}>
            <line x1="1160" y1={80 + i * 42} x2="950" y2={190 + i * 28} stroke="#00d4ff" strokeWidth="2" strokeOpacity={0.6} />
            <circle cx={1140 - i * 8} cy={95 + i * 40} r="2" fill="#00e676" />
            <circle cx={1110 - i * 8} cy={110 + i * 40} r="2" fill="#00d4ff" />
          </g>
        ))}

        {/* Center Subfloor & Vanishing Point */}
        <polygon points="280,540 920,540 1200,700 0,700" fill="#070b12" />
        <line x1="600" y1="180" x2="600" y2="700" stroke="#00d4ff" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="12 8" />
      </svg>
    ),
  },

  office_night: {
    id: 'office_night',
    name: 'Nexora Systems — Late Night (03:17 AM)',
    lighting: 'night',
    svg: () => (
      <svg viewBox="0 0 1200 700" className="environment-backdrop-svg" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="1200" height="700" fill="#030407" />

        {/* Dark City Skyline outside with glittering night lights */}
        <rect x="100" y="80" width="1000" height="400" fill="#060912" rx="6" stroke="#161b2c" strokeWidth="1.5" />
        <rect x="220" y="160" width="100" height="320" fill="#0a0e1c" />
        <rect x="420" y="200" width="80" height="280" fill="#080c18" />
        <rect x="680" y="140" width="120" height="340" fill="#090d1a" />
        <rect x="880" y="220" width="90" height="260" fill="#070a14" />

        {/* Amber Desk Lamp Glow */}
        <ellipse cx="600" cy="480" rx="300" ry="120" fill="#ff9900" fillOpacity="0.08" />
        <circle cx="580" cy="420" r="6" fill="#ffb347" filter="drop-shadow(0 0 10px #ff9900)" />
      </svg>
    ),
  },
};

export const getEnvironment = (id) => ENVIRONMENTS[id] || ENVIRONMENTS.office_day;

export default ENVIRONMENTS;
