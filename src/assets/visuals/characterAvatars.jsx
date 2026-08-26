/* ============================================
   LOST IN THE CLOUD — Character Portrait Visuals
   Stylized high-definition illustrated portraits
   with ambient glow, emotional expressions, and
   consistent character design.
   ============================================ */

import React from 'react';

export const CHARACTER_PORTRAITS = {
  maya: {
    id: 'maya',
    name: 'Maya Chen',
    title: 'Engineering Manager',
    accentColor: '#00d4ff',
    avatarSvg: (expression = 'neutral') => (
      <svg viewBox="0 0 200 240" className="character-portrait-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="maya-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a192f" />
            <stop offset="100%" stopColor="#050d1a" />
          </linearGradient>
          <linearGradient id="maya-glow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="maya-hair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1c24" />
            <stop offset="100%" stopColor="#0d0e12" />
          </linearGradient>
          <linearGradient id="maya-suit" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#162032" />
            <stop offset="100%" stopColor="#0d1420" />
          </linearGradient>
          <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Backlight */}
        <circle cx="100" cy="100" r="85" fill="url(#maya-glow)" />
        <circle cx="100" cy="100" r="75" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="4 6" />

        {/* Shoulders / Tech Blazer */}
        <path d="M30 240 L45 175 L80 160 L120 160 L155 175 L170 240 Z" fill="url(#maya-suit)" stroke="#00d4ff" strokeWidth="1" strokeOpacity="0.3" />
        <path d="M80 160 L100 195 L120 160" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeOpacity="0.6" />
        
        {/* Nexora Manager Badge */}
        <rect x="52" y="190" width="22" height="12" rx="2" fill="#0c1626" stroke="#00d4ff" strokeWidth="1" />
        <circle cx="58" cy="196" r="2" fill="#00d4ff" />
        <line x1="63" y1="196" x2="70" y2="196" stroke="#00d4ff" strokeWidth="1.5" />

        {/* Neck */}
        <path d="M88 135 L88 165 L112 165 L112 135 Z" fill="#e8c4a2" />

        {/* Hair - Back */}
        <path d="M60 80 C50 110 50 150 55 170 C65 175 75 165 75 150 C75 120 70 95 70 80 Z" fill="url(#maya-hair)" />
        <path d="M140 80 C150 110 150 150 145 170 C135 175 125 165 125 150 C125 120 130 95 130 80 Z" fill="url(#maya-hair)" />

        {/* Head Base */}
        <path d="M72 85 C72 50 128 50 128 85 C128 120 115 145 100 145 C85 145 72 120 72 85 Z" fill="#f4d1b4" />

        {/* Hair - Front Sleek Bob */}
        <path d="M68 80 C68 45 132 45 132 80 C132 90 125 70 100 68 C75 66 68 85 68 80 Z" fill="url(#maya-hair)" />
        <path d="M68 75 C65 95 62 120 72 135 C74 115 76 90 80 80 Z" fill="url(#maya-hair)" />
        <path d="M132 75 C135 95 138 120 128 135 C126 115 124 90 120 80 Z" fill="url(#maya-hair)" />

        {/* Eyebrows */}
        <path d="M80 88 Q90 85 96 89" stroke="#1f222e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M120 88 Q110 85 104 89" stroke="#1f222e" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Eyes (Observant & Sharp) */}
        <ellipse cx="88" cy="98" rx="5.5" ry="3.5" fill="#141722" />
        <ellipse cx="112" cy="98" rx="5.5" ry="3.5" fill="#141722" />
        <circle cx="89" cy="97" r="1.5" fill="#00d4ff" />
        <circle cx="113" cy="97" r="1.5" fill="#00d4ff" />

        {/* Sleek Minimalist Rimless Glasses */}
        <rect x="79" y="92" width="18" height="12" rx="3" fill="none" stroke="#00d4ff" strokeWidth="1.2" strokeOpacity="0.7" />
        <rect x="103" y="92" width="18" height="12" rx="3" fill="none" stroke="#00d4ff" strokeWidth="1.2" strokeOpacity="0.7" />
        <line x1="97" y1="97" x2="103" y2="97" stroke="#00d4ff" strokeWidth="1.2" strokeOpacity="0.7" />

        {/* Nose */}
        <path d="M100 98 L98 112 L103 112" stroke="#d4a884" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Mouth */}
        {expression === 'concerned' ? (
          <path d="M94 126 Q100 122 106 126" stroke="#b86b6b" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M93 124 Q100 127 107 124" stroke="#a25858" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Earring Tech Accent */}
        <circle cx="68" cy="108" r="2" fill="#00d4ff" filter="url(#cyan-glow)" />
      </svg>
    ),
  },

  arjun: {
    id: 'arjun',
    name: 'Arjun Mehta',
    title: 'Senior Cloud Engineer',
    accentColor: '#ff9900',
    avatarSvg: (expression = 'neutral') => (
      <svg viewBox="0 0 200 240" className="character-portrait-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="arjun-glow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff9900" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff9900" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="arjun-hoodie" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#252422" />
            <stop offset="100%" stopColor="#141312" />
          </linearGradient>
          <linearGradient id="arjun-hair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1c1815" />
            <stop offset="100%" stopColor="#0d0b09" />
          </linearGradient>
          <filter id="amber-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Backlight */}
        <circle cx="100" cy="100" r="85" fill="url(#arjun-glow)" />
        <circle cx="100" cy="100" r="75" fill="none" stroke="#ff9900" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="3 5" />

        {/* Shoulders / Dark Tech Hoodie */}
        <path d="M25 240 L40 170 L75 155 L125 155 L160 170 L175 240 Z" fill="url(#arjun-hoodie)" stroke="#ff9900" strokeWidth="1" strokeOpacity="0.3" />
        
        {/* Hoodie Strings / AWS Orange accents */}
        <path d="M80 160 Q85 190 82 205" stroke="#ff9900" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />
        <path d="M120 160 Q115 190 118 205" stroke="#ff9900" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />

        {/* Neck */}
        <path d="M86 130 L86 160 L114 160 L114 130 Z" fill="#c9956b" />

        {/* Head */}
        <path d="M70 80 C70 45 130 45 130 80 C130 118 116 142 100 142 C84 142 70 118 70 80 Z" fill="#d8a378" />

        {/* Thick Modern Hair & Sideburns */}
        <path d="M66 75 C66 40 134 40 134 75 C134 60 120 48 100 48 C80 48 66 60 66 75 Z" fill="url(#arjun-hair)" />
        <path d="M66 75 L70 100 L76 75 Z" fill="url(#arjun-hair)" />
        <path d="M134 75 L130 100 L124 75 Z" fill="url(#arjun-hair)" />

        {/* Beard / Stubble */}
        <path d="M74 105 C74 136 84 144 100 144 C116 144 126 136 126 105 C126 125 116 136 100 136 C84 136 74 125 74 105 Z" fill="#8c603e" fillOpacity="0.5" />

        {/* Eyebrows */}
        <path d="M78 84 Q88 80 96 85" stroke="#15120e" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M122 84 Q112 80 104 85" stroke="#15120e" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Eyes & Smart Glasses */}
        <ellipse cx="87" cy="94" rx="5" ry="3.5" fill="#1b1712" />
        <ellipse cx="113" cy="94" rx="5" ry="3.5" fill="#1b1712" />
        <circle cx="88" cy="93" r="1.5" fill="#ff9900" />
        <circle cx="114" cy="93" r="1.5" fill="#ff9900" />

        {/* Bold Black Frame Glasses */}
        <rect x="76" y="86" width="22" height="16" rx="4" fill="none" stroke="#2a2520" strokeWidth="2.5" />
        <rect x="102" y="86" width="22" height="16" rx="4" fill="none" stroke="#2a2520" strokeWidth="2.5" />
        <line x1="98" y1="92" x2="102" y2="92" stroke="#2a2520" strokeWidth="2.5" />

        {/* Nose */}
        <path d="M100 94 L97 110 L103 110" stroke="#b07d54" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Amused / Pragmatic Smirk */}
        <path d="M92 122 Q100 126 108 120" stroke="#8a5332" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },

  lena: {
    id: 'lena',
    name: 'Lena Voss',
    title: 'Security Engineer',
    accentColor: '#ff3b3b',
    avatarSvg: (expression = 'neutral') => (
      <svg viewBox="0 0 200 240" className="character-portrait-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lena-glow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff3b3b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff3b3b" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lena-tactical" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f181c" />
            <stop offset="100%" stopColor="#100b0e" />
          </linearGradient>
          <linearGradient id="lena-hair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b82638" />
            <stop offset="100%" stopColor="#300d14" />
          </linearGradient>
        </defs>

        <circle cx="100" cy="100" r="85" fill="url(#lena-glow)" />
        <circle cx="100" cy="100" r="75" fill="none" stroke="#ff3b3b" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="6 4" />

        {/* High Collar Tactical Jacket */}
        <path d="M28 240 L42 165 L76 150 L124 150 L158 165 L172 240 Z" fill="url(#lena-tactical)" stroke="#ff3b3b" strokeWidth="1" strokeOpacity="0.4" />
        <path d="M78 150 L100 185 L122 150" fill="#2d151c" stroke="#ff3b3b" strokeWidth="1.5" strokeOpacity="0.6" />
        
        {/* Security Lead Keycard */}
        <rect x="130" y="185" width="18" height="24" rx="2" fill="#140a0e" stroke="#ff3b3b" strokeWidth="1" />
        <rect x="134" y="190" width="10" height="4" fill="#ff3b3b" />

        {/* Neck */}
        <path d="M88 130 L88 155 L112 155 L112 130 Z" fill="#e2c5b0" />

        {/* Head */}
        <path d="M72 82 C72 48 128 48 128 82 C128 118 116 140 100 140 C84 140 72 118 72 82 Z" fill="#efd4c2" />

        {/* Sharp Undercut Asymmetric Hair */}
        <path d="M64 78 C64 42 132 40 136 78 C136 100 128 120 132 145 C124 130 120 105 120 85 C100 70 75 75 64 78 Z" fill="url(#lena-hair)" />

        {/* Skeptical Piercing Eyebrows */}
        <path d="M78 86 L94 84" stroke="#1f0f14" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M122 83 L106 85" stroke="#1f0f14" strokeWidth="2.5" strokeLinecap="round" />

        {/* Intense Eyes */}
        <ellipse cx="86" cy="94" rx="5" ry="3.2" fill="#1c0b10" />
        <ellipse cx="114" cy="94" rx="5" ry="3.2" fill="#1c0b10" />
        <circle cx="87" cy="93" r="1.5" fill="#ff3b3b" />
        <circle cx="113" cy="93" r="1.5" fill="#ff3b3b" />

        {/* Nose */}
        <path d="M100 94 L98 108 L103 108" stroke="#cfa48c" strokeWidth="1.5" fill="none" />

        {/* Skeptical Straight Mouth */}
        <line x1="93" y1="122" x2="107" y2="122" stroke="#8a3b4c" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },

  daniel: {
    id: 'daniel',
    name: 'Daniel Reyes',
    title: 'DevOps Engineer',
    accentColor: '#00e676',
    avatarSvg: (expression = 'neutral') => (
      <svg viewBox="0 0 200 240" className="character-portrait-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="daniel-glow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00e676" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00e676" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="daniel-shirt" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16291e" />
            <stop offset="100%" stopColor="#0c1711" />
          </linearGradient>
        </defs>

        <circle cx="100" cy="100" r="85" fill="url(#daniel-glow)" />
        <circle cx="100" cy="100" r="75" fill="none" stroke="#00e676" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="4 4" />

        {/* Casual DevOps Tee & Headphones around neck */}
        <path d="M28 240 L45 170 L80 155 L120 155 L155 170 L172 240 Z" fill="url(#daniel-shirt)" stroke="#00e676" strokeWidth="1" strokeOpacity="0.3" />
        
        {/* Neon Headphone Band */}
        <path d="M60 145 C60 175 140 175 140 145" stroke="#222" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M60 145 C60 175 140 175 140 145" stroke="#00e676" strokeWidth="2" fill="none" strokeLinecap="round" strokeOpacity="0.7" />
        <circle cx="58" cy="142" r="8" fill="#1b3324" stroke="#00e676" strokeWidth="1.5" />
        <circle cx="142" cy="142" r="8" fill="#1b3324" stroke="#00e676" strokeWidth="1.5" />

        {/* Neck */}
        <path d="M88 128 L88 155 L112 155 L112 128 Z" fill="#d6a27e" />

        {/* Head */}
        <path d="M72 80 C72 45 128 45 128 80 C128 116 116 138 100 138 C84 138 72 116 72 80 Z" fill="#e5b492" />

        {/* Messy energetic hair */}
        <path d="M66 75 C66 35 134 35 134 75 C134 65 125 50 100 50 C75 50 66 65 66 75 Z" fill="#2b1e17" />
        <path d="M80 50 L88 38 L94 48 L104 36 L112 48" stroke="#2b1e17" strokeWidth="4" fill="none" strokeLinejoin="round" />

        {/* Energetic Eyebrows */}
        <path d="M78 84 Q88 82 94 86" stroke="#2b1e17" strokeWidth="2.5" fill="none" />
        <path d="M122 84 Q112 82 106 86" stroke="#2b1e17" strokeWidth="2.5" fill="none" />

        {/* Bright Eyes */}
        <circle cx="87" cy="94" r="4.5" fill="#1a120e" />
        <circle cx="113" cy="94" r="4.5" fill="#1a120e" />
        <circle cx="88" cy="93" r="1.5" fill="#00e676" />
        <circle cx="114" cy="93" r="1.5" fill="#00e676" />

        {/* Nose */}
        <path d="M100 94 L98 108 L103 108" stroke="#be8966" strokeWidth="1.5" fill="none" />

        {/* Cheerful grin */}
        <path d="M91 118 Q100 126 109 118" stroke="#7a3e22" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },

  elias: {
    id: 'elias',
    name: 'Elias Ward',
    title: 'Former Cloud Architect',
    accentColor: '#a855f7',
    avatarSvg: (expression = 'neutral') => (
      <svg viewBox="0 0 200 240" className="character-portrait-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="elias-glow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="elias-glitch" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <filter id="purple-glitch" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05 0.95" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* Mysterious Ambient Aura */}
        <circle cx="100" cy="100" r="85" fill="url(#elias-glow)" />
        <circle cx="100" cy="100" r="75" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="2 8" />

        {/* Shadowed Silhouette with scanlines */}
        <g filter="url(#purple-glitch)">
          <path d="M25 240 L45 170 L80 155 L120 155 L155 170 L175 240 Z" fill="#0c0714" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.4" />
          <path d="M72 80 C72 45 128 45 128 80 C128 116 116 138 100 138 C84 138 72 116 72 80 Z" fill="#130b20" />
          
          {/* Glowing Digital Glitch Visage / Specter */}
          <line x1="60" y1="70" x2="140" y2="70" stroke="url(#elias-glitch)" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="10 5" />
          <line x1="50" y1="95" x2="150" y2="95" stroke="url(#elias-glitch)" strokeWidth="2" strokeOpacity="0.8" strokeDasharray="30 8" />
          <line x1="65" y1="120" x2="135" y2="120" stroke="url(#elias-glitch)" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="8 4" />
          
          {/* Glowing purple eye glyphs */}
          <rect x="83" y="92" width="8" height="3" fill="#00d4ff" />
          <rect x="109" y="92" width="8" height="3" fill="#a855f7" />
        </g>

        {/* Glitch artifacts */}
        <rect x="40" y="110" width="20" height="2" fill="#a855f7" fillOpacity="0.7" />
        <rect x="140" y="75" width="25" height="2" fill="#00d4ff" fillOpacity="0.7" />
        <rect x="85" y="170" width="30" height="2" fill="#a855f7" fillOpacity="0.8" />
      </svg>
    ),
  },

  system: {
    id: 'system',
    name: 'NEXORA SYSTEMS',
    title: 'Internal Network',
    accentColor: '#5a5a72',
    avatarSvg: () => (
      <svg viewBox="0 0 200 240" className="character-portrait-svg" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="70" fill="#0d111a" stroke="#00d4ff" strokeWidth="2" strokeDasharray="4 6" />
        <polygon points="100,50 140,90 100,130 60,90" fill="#00d4ff" fillOpacity="0.2" stroke="#00d4ff" strokeWidth="2" />
        <circle cx="100" cy="90" r="6" fill="#00d4ff" />
      </svg>
    ),
  },
};

export default CHARACTER_PORTRAITS;
