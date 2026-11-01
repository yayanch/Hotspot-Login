import React, { useState, useEffect } from 'react';
import { HotspotConfig, PreviewPage } from '../types/hotspot';
import { DEFAULT_SCHOOL_LOGO_DATA_URL } from '../data/templates';
import {
  QuickLinkIcon,
  SchoolGateBanner,
  SchoolCourtyardBanner,
  SmkStudentsIllustration,
  GarutMountainBackground,
  TjktHexagonShowcase,
  EduDoodleBackground,
} from './TemplateIllustrations';
import {
  User,
  Lock,
  Ticket,
  ArrowRight,
  Wifi,
  QrCode,
  LogOut,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface HotspotTemplateRendererProps {
  config: HotspotConfig;
  activePage: PreviewPage;
  onPageChange: (page: PreviewPage) => void;
  compact?: boolean;
}

export const HotspotTemplateRenderer: React.FC<HotspotTemplateRendererProps> = ({
  config,
  activePage,
  onPageChange,
  compact = false,
}) => {
  const [activeAuthTab, setActiveAuthTab] = useState<'member' | 'voucher'>(
    config.loginMode === 'voucher' ? 'voucher' : 'member'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [uptimeSeconds, setUptimeSeconds] = useState(854);
  const [activeLinkModal, setActiveLinkModal] = useState<{ label: string; url: string } | null>(
    null
  );

  useEffect(() => {
    if (config.loginMode === 'voucher') {
      setActiveAuthTab('voucher');
    } else if (config.loginMode === 'member') {
      setActiveAuthTab('member');
    }
  }, [config.loginMode]);

  useEffect(() => {
    if (activePage !== 'status') return;
    const timer = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activePage]);

  const formatUptime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (activeAuthTab === 'voucher') {
      if (!voucherCode.trim()) {
        setErrorMessage('Masukkan kode voucher terlebih dahulu');
        return;
      }
      setUsername(voucherCode.trim());
    } else {
      if (!username.trim()) {
        setErrorMessage('Username tidak boleh kosong');
        return;
      }
    }
    onPageChange('status');
  };

  const logoSrc = config.customLogoDataUrl || DEFAULT_SCHOOL_LOGO_DATA_URL;
  const tid = config.templateId;

  // Button style computation
  const getButtonStyle = (): React.CSSProperties => {
    if (tid === 5) {
      return {
        background: 'rgba(10, 17, 44, 0.9)',
        color: config.buttonTextColor,
        border: `2px solid ${config.accentColor}`,
        boxShadow: `0 0 18px ${config.accentColor}66, inset 0 0 12px ${config.buttonGradientEnd || '#A855F7'}55`,
      };
    }
    if (config.buttonGradientEnd) {
      return {
        background: `linear-gradient(90deg, ${config.accentColor} 0%, ${config.buttonGradientEnd} 100%)`,
        color: config.buttonTextColor,
      };
    }
    return {
      backgroundColor: config.accentColor,
      color: config.buttonTextColor,
    };
  };

  // Render Input Fields or Status/Logout Content
  const renderFormOrStatusBody = () => {
    if (activePage === 'status') {
      const displayUser = username || voucherCode || 'siswa.smkn6';
      return (
        <div
          className={`w-full rounded-2xl p-4 border backdrop-blur-md transition-all ${
            config.isDarkTheme
              ? 'bg-slate-900/80 border-slate-700/80 text-white'
              : 'bg-white/90 border-slate-200 text-slate-800 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-3 text-emerald-500 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Terhubung ke Hotspot</span>
          </div>
          <div className="text-center mb-3">
            <p className="text-xs opacity-75">Selamat datang,</p>
            <p className="text-base font-bold">{displayUser}</p>
          </div>
          <div className="space-y-2 text-xs font-mono tabular-nums border-t border-b border-current/10 py-3 my-2">
            <div className="flex justify-between">
              <span className="opacity-70 font-sans">IP Address</span>
              <span className="font-semibold">192.168.88.254</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70 font-sans">MAC Address</span>
              <span className="font-semibold">D4:CA:6D:81:29:F0</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70 font-sans">Traffic Up / Down</span>
              <span className="font-semibold">14.2 MiB / 128.6 MiB</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70 font-sans">Waktu Aktif</span>
              <span className="font-semibold text-emerald-500">{formatUptime(uptimeSeconds)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onPageChange('logout')}
            className={`w-full py-2.5 px-4 mt-2 font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-98 bg-rose-600 hover:bg-rose-700 text-white ${config.inputRadius}`}
          >
            <LogOut className="w-4 h-4" />
            <span>Putuskan Koneksi (Logout)</span>
          </button>
        </div>
      );
    }

    if (activePage === 'logout') {
      return (
        <div
          className={`w-full rounded-2xl p-4 border backdrop-blur-md text-center ${
            config.isDarkTheme
              ? 'bg-slate-900/80 border-slate-700/80 text-white'
              : 'bg-white/90 border-slate-200 text-slate-800 shadow-sm'
          }`}
        >
          <p className="text-sm font-bold mb-1">Sesi Internet Berakhir</p>
          <p className="text-xs opacity-75 mb-4">
            Terima kasih telah menggunakan layanan Hotspot {config.schoolName}.
          </p>
          <div className="text-xs font-mono tabular-nums bg-current/5 rounded-xl p-3 mb-4 space-y-1.5 text-left">
            <div className="flex justify-between">
              <span className="opacity-70 font-sans">Durasi Sesi</span>
              <span>{formatUptime(uptimeSeconds)}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70 font-sans">Total Kuota Terpakai</span>
              <span>142.8 MiB</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onPageChange('login')}
            style={getButtonStyle()}
            className={`w-full py-2.5 px-4 font-bold text-sm flex items-center justify-center gap-2 shadow-md ${config.inputRadius}`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Login Kembali</span>
          </button>
        </div>
      );
    }

    // Default: LOGIN PAGE
    return (
      <form onSubmit={handleLoginSubmit} className="w-full space-y-2.5">
        {config.announcementText && (
          <div
            className={`text-[11px] px-3 py-1.5 rounded-lg text-center font-medium ${
              config.isDarkTheme
                ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
                : 'bg-amber-50 text-amber-900 border border-amber-200'
            }`}
          >
            {config.announcementText}
          </div>
        )}

        {config.loginMode === 'dual' && (
          <div
            className={`grid grid-cols-2 p-1 rounded-xl text-xs font-semibold mb-1 ${
              config.isDarkTheme ? 'bg-slate-800/90 text-slate-300' : 'bg-slate-200/80 text-slate-700'
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveAuthTab('member')}
              className={`py-1.5 rounded-lg transition-all ${
                activeAuthTab === 'member'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'hover:opacity-85'
              }`}
            >
              Siswa / Guru
            </button>
            <button
              type="button"
              onClick={() => setActiveAuthTab('voucher')}
              className={`py-1.5 rounded-lg transition-all ${
                activeAuthTab === 'voucher'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'hover:opacity-85'
              }`}
            >
              Voucher
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-1.5 text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {activeAuthTab === 'voucher' ? (
          <div
            style={{
              backgroundColor: config.inputBgColor,
              borderColor: config.inputBorderColor,
              color: config.inputTextColor,
            }}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 border shadow-2xs backdrop-blur-xs ${config.inputRadius}`}
          >
            <Ticket className="w-4 h-4 opacity-60 shrink-0" />
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              placeholder={config.voucherPlaceholder}
              style={{ color: config.inputTextColor }}
              className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder:opacity-60"
            />
          </div>
        ) : (
          <>
            <div
              style={{
                backgroundColor: config.inputBgColor,
                borderColor: config.inputBorderColor,
                color: config.inputTextColor,
              }}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 border shadow-2xs backdrop-blur-xs ${config.inputRadius}`}
            >
              <User className="w-4 h-4 opacity-60 shrink-0" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={config.usernamePlaceholder}
                style={{ color: config.inputTextColor }}
                className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder:opacity-60"
              />
            </div>

            <div
              style={{
                backgroundColor: config.inputBgColor,
                borderColor: config.inputBorderColor,
                color: config.inputTextColor,
              }}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 border shadow-2xs backdrop-blur-xs ${config.inputRadius}`}
            >
              <Lock className="w-4 h-4 opacity-60 shrink-0" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={config.passwordPlaceholder}
                style={{ color: config.inputTextColor }}
                className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder:opacity-60"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          style={getButtonStyle()}
          className={`w-full py-2.5 px-5 font-bold text-base flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all cursor-pointer mt-1 ${
            tid === 9 || tid === 10 ? 'rounded-full' : config.inputRadius
          }`}
        >
          <span>{config.buttonText}</span>
          {config.showButtonArrow && <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
        </button>

        {(config.enableTrial || config.enableQrScanner) && (
          <div className="flex items-center justify-center gap-2 pt-1">
            {config.enableTrial && (
              <button
                type="button"
                onClick={() => onPageChange('status')}
                className={`text-[11px] font-semibold px-3 py-1 rounded-lg border transition-colors ${
                  config.isDarkTheme
                    ? 'border-white/20 text-white/90 hover:bg-white/10'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                {config.trialText}
              </button>
            )}
            {config.enableQrScanner && (
              <button
                type="button"
                onClick={() =>
                  setActiveLinkModal({ label: 'Scan QR Voucher', url: config.qrScannerUrl })
                }
                className={`text-[11px] font-semibold px-3 py-1 rounded-lg border flex items-center gap-1 transition-colors cursor-pointer ${
                  config.isDarkTheme
                    ? 'border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/10'
                    : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                }`}
              >
                <QrCode className="w-3 h-3" />
                <span>Scan QR</span>
              </button>
            )}
          </div>
        )}
      </form>
    );
  };

  const renderLinkPreviewModal = () => {
    if (!activeLinkModal) return null;
    return (
      <div className="absolute inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-5">
        <div className="w-full bg-white text-slate-900 rounded-2xl p-4 shadow-2xl border border-slate-200 text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Simulasi Pintasan Walled Garden
            </p>
            <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
              {activeLinkModal.label}
            </h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pada jaringan MikroTik asli, tautan ini akan membuka alamat tujuan berikut (pastikan
            domain sudah didaftarkan di <code className="font-mono">walled-garden.rsc</code>):
          </p>
          <div className="px-3 py-2 bg-slate-100 rounded-lg font-mono text-[11px] text-slate-800 break-all border border-slate-200">
            {activeLinkModal.url}
          </div>
          <button
            type="button"
            onClick={() => setActiveLinkModal(null)}
            className="w-full py-2 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Tutup Pratinjau Tautan
          </button>
        </div>
      </div>
    );
  };

  // Render Bottom Quick Links according to template style
  const renderQuickLinks = () => {
    if (!config.showQuickLinks || config.quickLinks.length === 0) return null;

    if (config.quickLinksStyle === 'colorful-tiles') {
      return (
        <>
          {renderLinkPreviewModal()}
          <div className="grid grid-cols-4 gap-2 w-full pt-4">
            {config.quickLinks.slice(0, 4).map((item, idx) => {
              const defaultColors = ['#1A73E8', '#F97316', '#8B5CF6', '#0284C7'];
              const tileBg = item.color || defaultColors[idx % defaultColors.length];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveLinkModal({ label: item.label, url: item.url })}
                  className="flex flex-col items-center text-center group cursor-pointer"
                >
                  <div
                    style={{ backgroundColor: tileBg }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform"
                  >
                    <QuickLinkIcon icon={item.icon} className="w-6 h-6" />
                  </div>
                  <span
                    style={{ color: config.textColor }}
                    className="text-[10px] font-bold leading-tight mt-1.5 line-clamp-2"
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      );
    }

    if (config.quickLinksStyle === 'neon-outline') {
      return (
        <>
          {renderLinkPreviewModal()}
          <div className="grid grid-cols-4 gap-2 w-full pt-4">
            {config.quickLinks.slice(0, 4).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveLinkModal({ label: item.label, url: item.url })}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl border border-cyan-400/50 bg-slate-900/80 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)] group-hover:border-cyan-300 transition-colors">
                  <QuickLinkIcon icon={item.icon} className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-cyan-100/90 mt-1.5 truncate max-w-full">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </>
      );
    }

    // minimal-icon or role-Clean (Templates 2, 3, 9)
    return (
      <>
        {renderLinkPreviewModal()}
        <div
          className={`grid gap-2 w-full pt-3 ${
            config.quickLinks.length === 4
              ? 'grid-cols-4'
              : config.quickLinks.length === 3
              ? 'grid-cols-3'
              : 'grid-cols-2'
          }`}
        >
          {config.quickLinks.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveLinkModal({ label: item.label, url: item.url })}
              className="flex flex-col items-center text-center group py-1 cursor-pointer"
            >
              <div
                style={{ color: config.isDarkTheme ? config.accentColor : config.accentColor }}
                className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
              >
                <QuickLinkIcon icon={item.icon} className="w-6 h-6" />
              </div>
              <span
                style={{ color: config.isDarkTheme ? '#E2E8F0' : config.textColor }}
                className="text-[11px] font-bold leading-tight mt-0.5"
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </>
    );
  };

  // ============================================================================
  // TEMPLATE-SPECIFIC LAYOUTS (1 TO 10)
  // ============================================================================

  // TEMPLATE 1: Modern & Profesional
  if (tid === 1) {
    return (
      <div
        style={{ backgroundColor: config.cardBgColor, color: config.textColor }}
        className={`relative w-full h-full flex flex-col justify-between overflow-hidden select-none ${
          compact ? 'text-xs' : ''
        }`}
      >
        <div>
          <SchoolGateBanner schoolName={config.schoolName} customBannerUrl={config.customBannerDataUrl} />
          {/* Overlapping School Crest Logo */}
          <div className="relative -mt-11 flex justify-center z-10">
            <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg flex items-center justify-center">
              <img
                src={logoSrc}
                alt={config.schoolName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="px-6 pt-2 text-center">
            <h1
              style={{ color: config.textColor }}
              className="text-2xl font-extrabold tracking-tight leading-tight"
            >
              {config.mainHeading}
            </h1>
            {config.subtitle && (
              <div className="flex items-center justify-center gap-1.5 mt-1.5">
                {config.showWifiIconInSubtitle && (
                  <Wifi className="w-4 h-4 shrink-0" style={{ color: config.accentColor }} />
                )}
                <p className="text-sm font-bold" style={{ color: config.textColor }}>
                  {config.subtitle}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 my-auto py-3">
          {renderFormOrStatusBody()}
          {renderQuickLinks()}
        </div>

        {/* Footer with MikroTik wave */}
        <div className="relative pt-3 pb-4 text-center">
          <svg
            className="absolute bottom-0 left-0 w-full h-14 pointer-events-none"
            viewBox="0 0 400 60"
            preserveAspectRatio="none"
          >
            <path d="M0,45 Q140,15 280,42 T400,25 L400,60 L0,60 Z" fill="#DBEAFE" opacity="0.7" />
            <path d="M0,52 Q180,28 320,48 T400,38 L400,60 L0,60 Z" fill="#BFDBFE" opacity="0.6" />
          </svg>
          {config.footerText && (
            <p className="relative z-10 text-xs font-bold tracking-tight" style={{ color: config.textColor }}>
              <span className="italic font-extrabold">{config.footerText}</span>{' '}
              <span className="font-semibold opacity-80">{config.footerSubtext}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  // TEMPLATE 2: Teknologi & Edukasi
  if (tid === 2) {
    return (
      <div
        style={{
          background: `radial-gradient(circle at 50% 20%, #0C2D5E 0%, ${config.cardBgColor} 65%, #020B18 100%)`,
          color: config.textColor,
        }}
        className="relative w-full h-full flex flex-col justify-between overflow-hidden px-6 py-5 select-none"
      >
        {/* Tech Constellation Background SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
          viewBox="0 0 400 700"
        >
          <g stroke="#38BDF8" strokeWidth="0.8" fill="#38BDF8">
            <circle cx="40" cy="80" r="2.5" />
            <circle cx="95" cy="45" r="2" />
            <circle cx="350" cy="70" r="2.5" />
            <circle cx="310" cy="120" r="2" />
            <line x1="40" y1="80" x2="95" y2="45" />
            <line x1="40" y1="80" x2="80" y2="140" />
            <line x1="350" y1="70" x2="310" y2="120" />
            <path
              d="M0,640 Q120,590 240,635 T400,605"
              fill="none"
              stroke="#00D2FF"
              strokeWidth="1.5"
            />
            <path
              d="M0,655 Q150,610 270,650 T400,625"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1"
            />
          </g>
        </svg>

        <div className="relative z-10 flex flex-col items-center text-center pt-1">
          <img
            src={logoSrc}
            alt={config.schoolName}
            referrerPolicy="no-referrer"
            className="w-16 h-16 object-contain drop-shadow-[0_4px_12px_rgba(0,210,255,0.3)]"
          />
          <p className="text-base font-extrabold tracking-wide mt-2 text-white">{config.schoolName}</p>
          <h1 className="text-2xl font-extrabold tracking-tight mt-2 text-white">
            {config.mainHeading}
          </h1>
          {config.subtitle && (
            <p className="text-xs font-medium text-sky-200/85 mt-1 max-w-[240px] leading-relaxed">
              {config.subtitle}
            </p>
          )}
        </div>

        <div className="relative z-10 my-auto py-2">
          {renderFormOrStatusBody()}
          {renderQuickLinks()}
        </div>

        <div className="relative z-10 text-center pt-1">
          {config.footerText && (
            <p className="text-xs font-bold tracking-wide text-sky-100/90">
              <span className="italic">{config.footerText}</span> {config.footerSubtext}
            </p>
          )}
        </div>
      </div>
    );
  }

  // TEMPLATE 3: Minimalis dengan Foto Sekolah
  if (tid === 3) {
    return (
      <div
        style={{ backgroundColor: config.cardBgColor, color: config.textColor }}
        className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none"
      >
        <div>
          {/* Top Sky Header with Crest + School Name */}
          <div className="bg-gradient-to-b from-sky-200/90 to-sky-100 pt-4 pb-2 px-4 flex flex-col items-center text-center">
            <img
              src={logoSrc}
              alt={config.schoolName}
              referrerPolicy="no-referrer"
              className="w-14 h-14 object-contain drop-shadow-xs"
            />
            <p className="text-lg font-extrabold tracking-tight mt-1" style={{ color: config.textColor }}>
              {config.schoolName}
            </p>
          </div>
          {/* Courtyard Photo Section */}
          <SchoolCourtyardBanner customBannerUrl={config.customBannerDataUrl} />
        </div>

        <div className="px-6 my-auto py-2 text-center">
          <h1 className="text-xl font-extrabold mb-3" style={{ color: config.textColor }}>
            {config.mainHeading}
          </h1>
          {renderFormOrStatusBody()}
          {renderQuickLinks()}
        </div>

        <div className="relative h-6">
          <svg className="absolute bottom-0 left-0 w-full h-6" viewBox="0 0 400 24" preserveAspectRatio="none">
            <path d="M0,12 Q200,24 400,8 L400,24 L0,24 Z" fill="#93C5FD" opacity="0.5" />
          </svg>
        </div>
      </div>
    );
  }

  // TEMPLATE 4: Ilustratif & Ramah Siswa
  if (tid === 4) {
    return (
      <div
        style={{ backgroundColor: config.cardBgColor, color: config.textColor }}
        className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none"
      >
        <div>
          <div className="bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100 pt-4 pb-1 px-4 flex flex-col items-center text-center">
            <img
              src={logoSrc}
              alt={config.schoolName}
              referrerPolicy="no-referrer"
              className="w-14 h-14 object-contain drop-shadow-xs"
            />
            <p className="text-xl font-extrabold tracking-tight mt-1" style={{ color: config.textColor }}>
              {config.schoolName}
            </p>
          </div>
          <SmkStudentsIllustration customBannerUrl={config.customBannerDataUrl} />
        </div>

        <div className="px-6 my-auto py-2 text-center">
          <h1 className="text-lg font-extrabold mb-3" style={{ color: config.textColor }}>
            {config.mainHeading}
          </h1>
          {renderFormOrStatusBody()}
          {renderQuickLinks()}
        </div>

        <div className="h-4" />
      </div>
    );
  }

  // TEMPLATE 5: Dark Mode Futuristik
  if (tid === 5) {
    return (
      <div
        style={{
          background: 'radial-gradient(circle at 50% 28%, #10193F 0%, #070B1E 60%, #040611 100%)',
          color: config.textColor,
        }}
        className="relative w-full h-full flex flex-col justify-between overflow-hidden px-6 py-5 select-none"
      >
        {/* Neon Laser Diagonal Streaks SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 700">
          <defs>
            <linearGradient id="neonCyan" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="neonPurple" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D946EF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#D946EF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="-20" y1="120" x2="110" y2="220" stroke="url(#neonCyan)" strokeWidth="3" />
          <line x1="-10" y1="160" x2="85" y2="235" stroke="url(#neonPurple)" strokeWidth="2" />
          <line x1="420" y1="120" x2="290" y2="220" stroke="url(#neonPurple)" strokeWidth="3" />
          <line x1="410" y1="160" x2="315" y2="235" stroke="url(#neonCyan)" strokeWidth="2" />
        </svg>

        <div className="relative z-10 flex flex-col items-center text-center">
          <img
            src={logoSrc}
            alt={config.schoolName}
            referrerPolicy="no-referrer"
            className="w-15 h-15 object-contain drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]"
          />
          <p className="text-base font-extrabold tracking-wider text-white mt-1.5">
            {config.schoolName}
          </p>
          {/* Glowing Neon Wi-Fi Icon */}
          <div className="my-2.5 flex items-center justify-center">
            <Wifi className="w-14 h-14 text-cyan-400 drop-shadow-[0_0_16px_rgba(34,211,238,0.85)]" />
          </div>
          <h1 className="text-xl font-extrabold tracking-wide text-white leading-tight max-w-[240px]">
            {config.mainHeading}
          </h1>
        </div>

        <div className="relative z-10 my-auto py-2">
          {renderFormOrStatusBody()}
          {renderQuickLinks()}
        </div>

        <div className="relative z-10 text-center text-[11px] text-slate-400">
          {config.footerText}
        </div>
      </div>
    );
  }

  // TEMPLATE 6: Flat & Fungsional
  if (tid === 6) {
    return (
      <div
        style={{ backgroundColor: config.cardBgColor, color: config.textColor }}
        className="relative w-full h-full flex flex-col justify-between overflow-hidden px-6 py-6 select-none"
      >
        <div className="flex flex-col items-center text-center pt-1">
          <img
            src={logoSrc}
            alt={config.schoolName}
            referrerPolicy="no-referrer"
            className="w-16 h-16 object-contain"
          />
          <h1 className="text-2xl font-extrabold tracking-tight mt-2.5" style={{ color: config.textColor }}>
            {config.mainHeading}
          </h1>
          {config.subtitle && (
            <p className="text-sm font-bold mt-1" style={{ color: config.textColor }}>
              {config.subtitle}
            </p>
          )}
        </div>

        <div className="my-auto py-3">
          {renderFormOrStatusBody()}
          {renderQuickLinks()}
        </div>

        <div className="relative h-5">
          <svg
            className="absolute -bottom-6 -left-6 w-[calc(100%+48px)] h-12"
            viewBox="0 0 400 45"
            preserveAspectRatio="none"
          >
            <path d="M0,22 Q160,42 400,12 L400,45 L0,45 Z" fill="#38BDF8" opacity="0.35" />
            <path d="M0,30 Q220,10 400,28 L400,45 L0,45 Z" fill="#0284C7" opacity="0.25" />
          </svg>
        </div>
      </div>
    );
  }

  // TEMPLATE 7: Bernuansa Lokal (Garut)
  if (tid === 7) {
    return (
      <div className="relative w-full h-full flex flex-col justify-between overflow-hidden px-6 py-6 select-none">
        <GarutMountainBackground customBannerUrl={config.customBannerDataUrl} />

        <div className="relative z-10 flex flex-col items-center text-center pt-1">
          <img
            src={logoSrc}
            alt={config.schoolName}
            referrerPolicy="no-referrer"
            className="w-16 h-16 object-contain drop-shadow-md"
          />
          <h1
            className="text-2xl font-extrabold tracking-tight mt-2 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]"
            style={{ color: config.textColor }}
          >
            {config.mainHeading}
          </h1>
          {config.subtitle && (
            <p
              className="text-sm font-extrabold mt-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]"
              style={{ color: config.textColor }}
            >
              {config.subtitle}
            </p>
          )}
        </div>

        <div className="relative z-10 my-auto py-3">{renderFormOrStatusBody()}</div>

        {/* Garut Kota Intan Mountain Line-Art Crest */}
        <div className="relative z-10 flex flex-col items-center text-center text-white pt-2">
          <svg viewBox="0 0 160 42" className="w-32 h-9 stroke-white fill-none" strokeWidth="2.2">
            <polyline points="15,38 52,12 78,30 105,6 145,38" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="42,20 52,26 62,19" strokeWidth="1.6" />
            <polyline points="93,15 105,22 117,15" strokeWidth="1.6" />
          </svg>
          <p className="text-xl font-extrabold leading-none tracking-wide mt-0.5">
            {config.footerText || 'Garut'}
          </p>
          <p className="text-xs font-medium text-emerald-100 tracking-wider mt-0.5">
            {config.footerSubtext || 'Kota Intan'}
          </p>
        </div>
      </div>
    );
  }

  // TEMPLATE 8: Bertema TJKT / Jaringan
  if (tid === 8) {
    return (
      <div
        style={{ backgroundColor: config.cardBgColor, color: config.textColor }}
        className="relative w-full h-full flex flex-col justify-between overflow-hidden pt-5 pb-3 select-none"
      >
        {/* Top Geometric Hexagons */}
        <svg className="absolute top-0 left-0 w-full h-40 pointer-events-none" viewBox="0 0 400 160">
          <polygon points="-10,-10 85,-10 115,45 85,100 -10,100" fill="#1D4ED8" opacity="0.85" />
          <polygon points="70,-10 140,-10 165,35 140,80 70,80" fill="#60A5FA" opacity="0.35" />
          <polygon points="330,-10 410,-10 410,95 330,95 300,42" fill="#DBEAFE" opacity="0.7" />
        </svg>

        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <img
            src={logoSrc}
            alt={config.schoolName}
            referrerPolicy="no-referrer"
            className="w-16 h-16 object-contain"
          />
          <h1 className="text-2xl font-extrabold tracking-tight mt-2" style={{ color: config.textColor }}>
            {config.mainHeading}
          </h1>
          {config.subtitle && (
            <p className="text-sm font-bold mt-1" style={{ color: config.textColor }}>
              {config.subtitle}
            </p>
          )}
        </div>

        <div className="relative z-10 px-6 my-auto py-2">{renderFormOrStatusBody()}</div>

        {/* TJKT 3-Hexagon Showcase at Bottom */}
        <div className="relative z-10">
          <TjktHexagonShowcase />
        </div>
      </div>
    );
  }

  // TEMPLATE 9: Simpel & Elegan
  if (tid === 9) {
    return (
      <div
        style={{ backgroundColor: config.cardBgColor, color: config.textColor }}
        className="relative w-full h-full flex flex-col justify-between overflow-hidden px-6 py-6 select-none"
      >
        {/* Top Abstract Blue Polygon Waves */}
        <svg className="absolute top-0 left-0 w-full h-36 pointer-events-none" viewBox="0 0 400 140" preserveAspectRatio="none">
          <polygon points="0,0 240,0 120,65 0,115" fill="#0A2E75" />
          <polygon points="0,0 160,0 70,85 0,60" fill="#2563EB" opacity="0.75" />
          <polygon points="240,0 400,0 400,85 330,35" fill="#93C5FD" opacity="0.45" />
        </svg>

        <div className="relative z-10 flex flex-col items-center text-center pt-1">
          <img
            src={logoSrc}
            alt={config.schoolName}
            referrerPolicy="no-referrer"
            className="w-15 h-15 object-contain"
          />
          <h1 className="text-xl font-extrabold tracking-tight mt-2" style={{ color: config.textColor }}>
            {config.mainHeading}
          </h1>
          <div className="my-2 text-blue-600">
            <Wifi className="w-12 h-12" />
          </div>
          {config.subtitle && (
            <p className="text-base font-extrabold" style={{ color: config.textColor }}>
              {config.subtitle}
            </p>
          )}
        </div>

        <div className="relative z-10 my-auto py-2">
          {renderFormOrStatusBody()}
          {renderQuickLinks()}
        </div>

        <div className="relative h-3">
          <svg
            className="absolute -bottom-6 -left-6 w-[calc(100%+48px)] h-10"
            viewBox="0 0 400 40"
            preserveAspectRatio="none"
          >
            <path d="M0,25 Q180,5 400,28 L400,40 L0,40 Z" fill="#60A5FA" opacity="0.35" />
          </svg>
        </div>
      </div>
    );
  }

  // TEMPLATE 10: Edukatif & Kreatif
  return (
    <div
      style={{
        background: `linear-gradient(165deg, #128293 0%, ${config.cardBgColor} 55%, #075966 100%)`,
        color: config.textColor,
      }}
      className="relative w-full h-full flex flex-col justify-between overflow-hidden px-6 py-6 select-none"
    >
      <EduDoodleBackground />

      <div className="relative z-10 flex flex-col items-center text-center pt-1">
        <img
          src={logoSrc}
          alt={config.schoolName}
          referrerPolicy="no-referrer"
          className="w-16 h-16 object-contain drop-shadow-md"
        />

        {/* Yellow Tilted Speech-Ribbon Banner */}
        <div className="relative mt-3 mb-2 px-5 py-2 bg-yellow-400 text-slate-900 rounded-2xl -rotate-3 shadow-lg border-2 border-yellow-300">
          <h1 className="text-xl font-extrabold tracking-tight leading-none">{config.mainHeading}</h1>
          {/* Speech bubble tail */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-yellow-400 rotate-45 border-r-2 border-b-2 border-yellow-300" />
        </div>

        {config.subtitle && (
          <p className="text-base font-bold text-white mt-2 drop-shadow-xs">{config.subtitle}</p>
        )}
      </div>

      <div className="relative z-10 my-auto py-2">
        {renderFormOrStatusBody()}
        {renderQuickLinks()}
      </div>

      <div className="relative z-10 h-10" />
    </div>
  );
};
