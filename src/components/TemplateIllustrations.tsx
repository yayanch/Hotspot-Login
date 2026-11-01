import React from 'react';
import { IconType } from '../types/hotspot';
import {
  BookOpen,
  MonitorPlay,
  Globe,
  Cloud,
  GraduationCap,
  PlaySquare,
  DownloadCloud,
  Users,
  UserCheck,
  Settings,
  FileText,
  Award,
  Info,
  Wifi,
} from 'lucide-react';

export const QuickLinkIcon: React.FC<{ icon: IconType; className?: string }> = ({
  icon,
  className = 'w-5 h-5',
}) => {
  switch (icon) {
    case 'book':
      return <BookOpen className={className} />;
    case 'lms':
      return <MonitorPlay className={className} />;
    case 'globe':
      return <Globe className={className} />;
    case 'cloud':
      return <Cloud className={className} />;
    case 'grad':
      return <GraduationCap className={className} />;
    case 'video':
      return <PlaySquare className={className} />;
    case 'download':
      return <DownloadCloud className={className} />;
    case 'users':
      return <Users className={className} />;
    case 'user':
      return <UserCheck className={className} />;
    case 'settings':
      return <Settings className={className} />;
    case 'file':
      return <FileText className={className} />;
    case 'award':
      return <Award className={className} />;
    case 'info':
      return <Info className={className} />;
    case 'wifi':
      return <Wifi className={className} />;
    default:
      return <Globe className={className} />;
  }
};

// Template 1: School Gate Banner SVG
export const SchoolGateBanner: React.FC<{ schoolName: string; customBannerUrl?: string }> = ({
  schoolName,
  customBannerUrl,
}) => {
  if (customBannerUrl) {
    return (
      <div className="relative w-full h-44 overflow-hidden">
        <img
          src={customBannerUrl}
          alt={schoolName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <svg
          className="absolute -bottom-1 left-0 w-full h-12"
          viewBox="0 0 400 50"
          preserveAspectRatio="none"
        >
          <path d="M0,30 Q120,0 240,28 T400,15 L400,50 L0,50 Z" fill="#1D4ED8" opacity="0.85" />
          <path d="M0,36 Q150,8 280,32 T400,22 L400,50 L0,50 Z" fill="#F3F7FC" />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-full h-44 overflow-hidden bg-sky-300">
      <svg viewBox="0 0 400 185" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="70%" stopColor="#BAE6FD" />
          </linearGradient>
          <linearGradient id="roof1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B91C1C" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </linearGradient>
        </defs>
        <rect width="400" height="185" fill="url(#sky1)" />
        {/* Soft Clouds */}
        <circle cx="70" cy="35" r="22" fill="#FFFFFF" opacity="0.65" />
        <circle cx="95" cy="38" r="18" fill="#FFFFFF" opacity="0.65" />
        <circle cx="320" cy="28" r="20" fill="#FFFFFF" opacity="0.5" />
        {/* Background Trees */}
        <circle cx="35" cy="105" r="42" fill="#15803D" />
        <circle cx="75" cy="115" r="35" fill="#166534" />
        <circle cx="370" cy="105" r="40" fill="#15803D" />
        {/* Main School Building Left */}
        <polygon points="10,95 95,55 180,95" fill="url(#roof1)" />
        <rect x="22" y="95" width="145" height="55" fill="#FDE68A" />
        <rect x="38" y="104" width="22" height="28" fill="#1E3A8A" rx="2" />
        <rect x="72" y="104" width="22" height="28" fill="#1E3A8A" rx="2" />
        <rect x="106" y="104" width="22" height="28" fill="#1E3A8A" rx="2" />
        {/* Modern School Gate Archway Right */}
        <rect x="175" y="75" width="16" height="80" fill="#334155" />
        <rect x="335" y="75" width="16" height="80" fill="#334155" />
        {/* Signboard Arch */}
        <path d="M168,52 L358,34 L358,76 L168,84 Z" fill="#1E3A8A" stroke="#93C5FD" strokeWidth="2" />
        <path d="M174,56 L352,40 L352,70 L174,78 Z" fill="#0F172A" />
        <text
          x="264"
          y="63"
          fill="#FFFFFF"
          fontSize="15"
          fontWeight="800"
          fontFamily="Plus Jakarta Sans, sans-serif"
          textAnchor="middle"
          letterSpacing="0.5"
        >
          {schoolName.slice(0, 18)}
        </text>
        {/* Gate Fence Bars */}
        <rect x="191" y="96" width="144" height="45" fill="#0F172A" opacity="0.45" />
        <line x1="210" y1="96" x2="210" y2="141" stroke="#94A3B8" strokeWidth="2" />
        <line x1="230" y1="96" x2="230" y2="141" stroke="#94A3B8" strokeWidth="2" />
        <line x1="250" y1="96" x2="250" y2="141" stroke="#94A3B8" strokeWidth="2" />
        <line x1="270" y1="96" x2="270" y2="141" stroke="#94A3B8" strokeWidth="2" />
        <line x1="290" y1="96" x2="290" y2="141" stroke="#94A3B8" strokeWidth="2" />
        <line x1="310" y1="96" x2="310" y2="141" stroke="#94A3B8" strokeWidth="2" />
        {/* Paved Road */}
        <rect x="0" y="138" width="400" height="47" fill="#64748B" />
        {/* Curved Blue & White Wave Overlay */}
        <path d="M0,138 Q120,105 245,134 T400,118 L400,185 L0,185 Z" fill="#1D4ED8" />
        <path d="M0,147 Q135,115 265,142 T400,126 L400,185 L0,185 Z" fill="#F3F7FC" />
      </svg>
    </div>
  );
};

// Template 3: School Courtyard Building Photo SVG
export const SchoolCourtyardBanner: React.FC<{ customBannerUrl?: string }> = ({ customBannerUrl }) => {
  if (customBannerUrl) {
    return (
      <div className="relative w-full h-36 overflow-hidden">
        <img
          src={customBannerUrl}
          alt="Gedung Sekolah"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <svg className="absolute -bottom-1 left-0 w-full h-8" viewBox="0 0 400 32" preserveAspectRatio="none">
          <path d="M0,18 Q200,0 400,18 L400,32 L0,32 Z" fill="#2563EB" />
          <path d="M0,23 Q200,6 400,23 L400,32 L0,32 Z" fill="#F4F8FD" />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-full h-36 overflow-hidden">
      <svg viewBox="0 0 400 145" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="145" fill="#BAE6FD" />
        {/* Trees left and right */}
        <circle cx="25" cy="75" r="38" fill="#15803D" />
        <circle cx="375" cy="75" r="38" fill="#15803D" />
        {/* Terracotta Roof */}
        <polygon points="40,56 75,26 325,26 360,56" fill="#B45309" />
        <polygon points="46,56 78,30 322,30 354,56" fill="#C2410C" />
        {/* Center Entrance Gable */}
        <polygon points="165,56 200,32 235,56" fill="#1E3A8A" />
        {/* 2-Story School Facade */}
        <rect x="52" y="56" width="296" height="58" fill="#F8FAFC" stroke="#CBD5E1" />
        <rect x="52" y="82" width="296" height="5" fill="#1D4ED8" />
        {/* Windows Row 1 */}
        {[70, 102, 134, 246, 278, 310].map((x) => (
          <rect key={`r1-${x}`} x={x} y="62" width="18" height="15" fill="#1E3A8A" rx="1.5" />
        ))}
        {/* Windows Row 2 */}
        {[70, 102, 134, 246, 278, 310].map((x) => (
          <rect key={`r2-${x}`} x={x} y="91" width="18" height="16" fill="#334155" rx="1.5" />
        ))}
        {/* Center Hallway Pillars */}
        <rect x="172" y="58" width="56" height="54" fill="#DBEAFE" />
        <rect x="184" y="88" width="32" height="24" fill="#0F172A" />
        {/* Courtyard Grass & Bushes */}
        <rect x="0" y="112" width="400" height="22" fill="#4ADE80" />
        <ellipse cx="110" cy="112" rx="28" ry="8" fill="#16A34A" />
        <ellipse cx="290" cy="112" rx="28" ry="8" fill="#16A34A" />
        {/* Bottom Wave Separator */}
        <path d="M0,122 Q200,104 400,122 L400,145 L0,145 Z" fill="#2563EB" />
        <path d="M0,128 Q200,110 400,128 L400,145 L0,145 Z" fill="#F4F8FD" />
      </svg>
    </div>
  );
};

// Template 4: Friendly Indonesian SMK Students Illustration (Male & Hijab Female Student Giving Thumbs Up)
export const SmkStudentsIllustration: React.FC<{ customBannerUrl?: string }> = ({ customBannerUrl }) => {
  if (customBannerUrl) {
    return (
      <div className="relative w-full h-44 overflow-hidden">
        <img
          src={customBannerUrl}
          alt="Ilustrasi Siswa"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-44 overflow-hidden">
      <svg viewBox="0 0 400 185" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        {/* Background School Courtyard */}
        <polygon points="0,70 90,40 120,70 0,95" fill="#C2410C" opacity="0.85" />
        <rect x="0" y="70" width="110" height="75" fill="#FDE68A" opacity="0.7" />
        <polygon points="280,70 315,40 400,70 400,95" fill="#C2410C" opacity="0.85" />
        <rect x="290" y="70" width="110" height="75" fill="#FDE68A" opacity="0.7" />
        <circle cx="40" cy="115" r="28" fill="#16A34A" opacity="0.8" />
        <circle cx="365" cy="115" r="28" fill="#16A34A" opacity="0.8" />

        {/* Male SMK Student (Left) */}
        <g transform="translate(88, 18)">
          {/* Backpack Straps & Shirt */}
          <path d="M18,98 Q55,88 92,98 L102,155 L8,155 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <path d="M24,96 L18,150" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
          <path d="M86,96 L92,150" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
          {/* Collar & Navy Tie */}
          <polygon points="40,92 55,112 70,92" fill="#E2E8F0" />
          <polygon points="51,102 59,102 61,142 55,150 49,142" fill="#1E3A8A" />
          {/* Neck & Head */}
          <rect x="47" y="76" width="16" height="20" fill="#FDBA74" rx="6" />
          <ellipse cx="55" cy="52" rx="25" ry="28" fill="#FED7AA" />
          {/* Hair */}
          <path
            d="M28,48 C26,22 45,16 62,18 C78,20 84,34 80,50 C77,36 68,32 55,34 C42,35 34,40 28,48 Z"
            fill="#1E293B"
          />
          {/* Eyes & Friendly Smile */}
          <ellipse cx="45" cy="52" rx="2.8" ry="3.5" fill="#0F172A" />
          <ellipse cx="65" cy="52" rx="2.8" ry="3.5" fill="#0F172A" />
          <path d="M40,44 Q45,41 50,44" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M60,44 Q65,41 70,44" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M47,64 Q55,71 63,64" fill="#FFFFFF" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" />
          {/* Thumbs Up Hand */}
          <rect x="2" y="102" width="14" height="22" rx="6" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
          <rect x="9" y="92" width="6" height="13" rx="3" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
        </g>

        {/* Female Hijab SMK Student (Right) */}
        <g transform="translate(202, 22)">
          {/* Uniform Tunic & Grey Vest */}
          <path d="M16,96 Q55,88 94,96 L104,155 L6,155 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* White Hijab Drape */}
          <path
            d="M55,14 C28,14 18,42 16,86 C15,112 32,126 55,128 C78,126 95,112 94,86 C92,42 82,14 55,14 Z"
            fill="#F8FAFC"
            stroke="#CBD5E1"
            strokeWidth="1.8"
          />
          {/* Face inside Hijab */}
          <ellipse cx="55" cy="54" rx="21" ry="23" fill="#FED7AA" />
          {/* Hijab Forehead Crease */}
          <path d="M34,48 Q55,34 76,48" fill="none" stroke="#94A3B8" strokeWidth="2" />
          {/* Eyes & Smile */}
          <ellipse cx="46" cy="54" rx="2.6" ry="3.2" fill="#0F172A" />
          <ellipse cx="64" cy="54" rx="2.6" ry="3.2" fill="#0F172A" />
          <path d="M41,46 Q46,43 51,46" fill="none" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M59,46 Q64,43 69,46" fill="none" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M48,65 Q55,71 62,65" fill="none" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
          {/* School Badge on Sleeve/Chest */}
          <circle cx="77" cy="118" r="7" fill="#1E40AF" stroke="#FACC15" strokeWidth="1.5" />
          {/* Thumbs Up Hand */}
          <rect x="14" y="102" width="14" height="20" rx="6" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
          <rect x="21" y="92" width="6" height="12" rx="3" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
        </g>

        {/* Bottom Curved Wave Transition */}
        <path d="M0,158 Q200,136 400,158 L400,185 L0,185 Z" fill="#3B82F6" opacity="0.3" />
        <path d="M0,164 Q200,142 400,164 L400,185 L0,185 Z" fill="#F5F8FC" />
      </svg>
    </div>
  );
};

// Template 7: Garut Mountain Landscape Background & Kota Intan Emblem
export const GarutMountainBackground: React.FC<{ customBannerUrl?: string }> = ({ customBannerUrl }) => {
  if (customBannerUrl) {
    return (
      <img
        src={customBannerUrl}
        alt="Garut Landscape"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 400 720"
      className="absolute inset-0 w-full h-full object-cover"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="garutSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="45%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#E0F2FE" />
        </linearGradient>
        <linearGradient id="cikuraySlope" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="55%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
        <linearGradient id="valleyGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#15803D" />
          <stop offset="50%" stopColor="#166534" />
          <stop offset="100%" stopColor="#052E16" />
        </linearGradient>
      </defs>
      <rect width="400" height="720" fill="url(#garutSky)" />
      {/* Soft Clouds around Peak */}
      <ellipse cx="85" cy="230" rx="95" ry="26" fill="#FFFFFF" opacity="0.75" />
      <ellipse cx="320" cy="245" rx="110" ry="30" fill="#FFFFFF" opacity="0.75" />
      {/* Mount Cikuray / Guntur Majestic Cone */}
      <polygon points="-40,430 165,205 235,205 440,430" fill="url(#cikuraySlope)" />
      {/* Crater Rim & Ridge Snow/Mist Highlights */}
      <path d="M165,205 Q200,212 235,205 L218,245 L195,225 L178,250 Z" fill="#E0F2FE" opacity="0.65" />
      {/* Mist Band at Mountain Foot */}
      <ellipse cx="200" cy="340" rx="240" ry="28" fill="#FFFFFF" opacity="0.55" />
      {/* Lush Green Tea Plantation Hills & Valleys of Garut */}
      <path d="M0,380 Q130,340 270,385 T400,370 L400,720 L0,720 Z" fill="#22C55E" opacity="0.7" />
      <path d="M0,415 Q160,375 310,425 T400,405 L400,720 L0,720 Z" fill="url(#valleyGreen)" />
      {/* Bottom Dark Scrim for Garut Kota Intan Emblem Legibility */}
      <rect x="0" y="540" width="400" height="180" fill="#041E12" opacity="0.55" />
    </svg>
  );
};

// Template 8: TJKT Trio of Hexagons (Server Rack, Fiber/RJ45 Cables, Network Laptop)
export const TjktHexagonShowcase: React.FC = () => {
  return (
    <div className="relative w-full pt-2 pb-1 px-2">
      <svg viewBox="0 0 380 140" className="w-full h-32">
        <defs>
          <linearGradient id="hexBorder" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>
        {/* Background Subtle Tech Hexagons */}
        <polygon
          points="190,5 245,35 245,95 190,125 135,95 135,35"
          fill="#DBEAFE"
          opacity="0.45"
        />

        {/* Hexagon 1 (Left): Data Center Server Rack */}
        <g transform="translate(12, 18)">
          <polygon
            points="55,2 104,28 104,82 55,108 6,82 6,28"
            fill="#0F172A"
            stroke="url(#hexBorder)"
            strokeWidth="3.5"
          />
          {/* Server Blades & Blinking LEDs */}
          <rect x="26" y="30" width="58" height="50" fill="#1E293B" rx="3" stroke="#38BDF8" strokeWidth="1" />
          {[36, 46, 56, 66].map((y, idx) => (
            <g key={y}>
              <rect x="30" y={y} width="50" height="6" fill="#0F172A" rx="1" />
              <circle cx="35" cy={y + 3} r="1.5" fill="#22C55E" />
              <circle cx="41" cy={y + 3} r="1.5" fill={idx % 2 === 0 ? '#38BDF8' : '#FACC15'} />
              <line x1="50" y1={y + 3} x2="75" y2={y + 3} stroke="#475569" strokeWidth="1.5" />
            </g>
          ))}
        </g>

        {/* Hexagon 2 (Center, Slightly Larger): RJ45 & Fiber Optic Patch Cables */}
        <g transform="translate(130, 8)">
          <polygon
            points="60,2 114,32 114,92 60,122 6,92 6,32"
            fill="#091E3A"
            stroke="#38BDF8"
            strokeWidth="4"
          />
          {/* Switch Ports */}
          <rect x="22" y="34" width="76" height="22" fill="#1E293B" rx="2" stroke="#64748B" strokeWidth="1" />
          {[28, 42, 56, 70, 84].map((x) => (
            <rect key={x} x={x} y="39" width="9" height="10" fill="#0F172A" stroke="#38BDF8" strokeWidth="0.8" />
          ))}
          {/* Glowing Blue & Cyan Patch Cables curving out */}
          <path d="M32,46 Q45,85 20,100" fill="none" stroke="#00E5FF" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M46,46 Q60,85 45,108" fill="none" stroke="#3B82F6" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M60,46 Q72,85 72,110" fill="none" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
          <path d="M74,46 Q88,80 98,98" fill="none" stroke="#38BDF8" strokeWidth="4.5" strokeLinecap="round" />
        </g>

        {/* Hexagon 3 (Right): WinBox / RouterOS Laptop Configuration */}
        <g transform="translate(258, 18)">
          <polygon
            points="55,2 104,28 104,82 55,108 6,82 6,28"
            fill="#0F172A"
            stroke="url(#hexBorder)"
            strokeWidth="3.5"
          />
          {/* Laptop Screen */}
          <rect x="26" y="32" width="58" height="36" rx="3" fill="#1E3A8A" stroke="#93C5FD" strokeWidth="1.5" />
          {/* Terminal Graph inside Screen */}
          <polyline
            points="32,58 42,48 50,54 62,40 76,45"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="2"
          />
          <line x1="32" y1="39" x2="55" y2="39" stroke="#93C5FD" strokeWidth="2" />
          {/* Laptop Base */}
          <polygon points="18,68 92,68 98,76 12,76" fill="#94A3B8" />
        </g>
      </svg>
    </div>
  );
};

// Template 10: Chalkboard Educational Doodles & Torn Paper Bottom
export const EduDoodleBackground: React.FC = () => {
  return (
    <svg
      viewBox="0 0 400 720"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Subtle Chalkboard Doodles in White Stroke */}
      <g stroke="#FFFFFF" strokeWidth="1.6" fill="none" opacity="0.32" strokeLinecap="round" strokeLinejoin="round">
        {/* Top-left Laptop Doodle */}
        <rect x="24" y="68" width="54" height="36" rx="3" />
        <polygon points="16,104 86,104 92,114 10,114" />
        {/* Lightbulb Doodle */}
        <path d="M105,58 C95,58 90,68 95,78 L98,86 L112,86 L115,78 C120,68 115,58 105,58 Z" />
        <line x1="100" y1="90" x2="110" y2="90" />
        {/* Top-right Open Book Doodle */}
        <path d="M325,52 Q342,46 355,54 Q368,46 385,52 L385,84 Q368,78 355,86 Q342,78 325,84 Z" />
        <line x1="355" y1="54" x2="355" y2="86" />
        {/* Mid-left Graduation Cap */}
        <polygon points="15,250 45,236 75,250 45,264" />
        <path d="M28,257 V272 Q45,280 62,272 V257" />
        {/* Mid-right Idea Bulb & Gear */}
        <circle cx="358" cy="245" r="14" />
        <line x1="358" y1="222" x2="358" y2="226" />
        <line x1="376" y1="232" x2="372" y2="235" />
        <line x1="340" y1="232" x2="344" y2="235" />
        {/* Lower-left Globe */}
        <circle cx="36" cy="540" r="20" />
        <ellipse cx="36" cy="540" rx="10" ry="20" />
        <line x1="16" y1="540" x2="56" y2="540" />
        {/* Lower-right Pencil */}
        <polygon points="355,520 370,505 380,515 365,530" />
      </g>

      {/* Realistic Torn Notebook Paper Bottom Edge */}
      <path
        d="M0,655 L22,648 L45,658 L72,644 L98,654 L128,638 L155,649 L188,634 L215,644 L248,628 L278,639 L312,622 L345,634 L375,616 L400,625 L400,720 L0,720 Z"
        fill="#CBD5E1"
        opacity="0.65"
      />
      <path
        d="M0,664 L25,656 L48,666 L76,652 L104,662 L134,646 L162,656 L195,642 L222,652 L254,636 L284,646 L318,630 L348,642 L378,624 L400,634 L400,720 L0,720 Z"
        fill="#F8FAFC"
      />
    </svg>
  );
};
