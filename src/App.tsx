import React, { useState, useMemo } from 'react';
import {
  HotspotConfig,
  TemplateId,
  PreviewPage,
  DeviceViewport,
  WorkspaceTab,
  IconType,
  QuickLinkItem,
} from './types/hotspot';
import { INITIAL_TEMPLATES } from './data/templates';
import { HotspotTemplateRenderer } from './components/HotspotTemplateRenderer';
import {
  generateMikrotikFiles,
  downloadHotspotZip,
  downloadSingleFile,
  GeneratedMikrotikFiles,
} from './utils/mikrotikCodeGenerator';
import {
  Download,
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw,
  Copy,
  Check,
  Plus,
  Trash2,
  Upload,
  Eye,
  Code2,
  LayoutGrid,
  Sliders,
  FileCode,
  Sparkles,
  Image as ImageIcon,
  Columns2,
} from 'lucide-react';

const ICON_OPTIONS: { value: IconType; label: string }[] = [
  { value: 'book', label: 'Buku / Materi' },
  { value: 'lms', label: 'Layar LMS' },
  { value: 'globe', label: 'Website / Globe' },
  { value: 'cloud', label: 'Cloud / E-Learning' },
  { value: 'grad', label: 'Topi Akademik' },
  { value: 'video', label: 'Video Pembelajaran' },
  { value: 'download', label: 'Unduhan Cloud' },
  { value: 'users', label: 'Siswa / Grup' },
  { value: 'user', label: 'Guru / Profil' },
  { value: 'settings', label: 'Tendik / Pengaturan' },
  { value: 'file', label: 'Dokumen / E-Rapor' },
  { value: 'award', label: 'PPDB / Prestasi' },
  { value: 'info', label: 'Informasi' },
  { value: 'wifi', label: 'Sinyal Wi-Fi' },
];

export default function App() {
  const [templates, setTemplates] = useState<Record<TemplateId, HotspotConfig>>(() =>
    structuredClone(INITIAL_TEMPLATES)
  );
  const [selectedId, setSelectedId] = useState<TemplateId>(1);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('editor');
  const [previewPage, setPreviewPage] = useState<PreviewPage>('login');
  const [viewport, setViewport] = useState<DeviceViewport>('mobile');
  const [inspectorSection, setInspectorSection] = useState<'identity' | 'form' | 'style' | 'links'>(
    'identity'
  );
  const [compareWithReference, setCompareWithReference] = useState<boolean>(false);
  const [selectedCodeFile, setSelectedCodeFile] = useState<keyof GeneratedMikrotikFiles>('login.html');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeConfig = templates[selectedId];

  const updateActiveConfig = <K extends keyof HotspotConfig>(key: K, value: HotspotConfig[K]) => {
    setTemplates((prev) => ({
      ...prev,
      [selectedId]: {
        ...prev[selectedId],
        [key]: value,
      },
    }));
  };

  const applySchoolIdentityToAll = () => {
    setTemplates((prev) => {
      const next = structuredClone(prev);
      (Object.keys(next) as unknown as TemplateId[]).forEach((id) => {
        next[id].schoolName = activeConfig.schoolName;
        if (activeConfig.customLogoDataUrl) {
          next[id].customLogoDataUrl = activeConfig.customLogoDataUrl;
        }
      });
      return next;
    });
  };

  const resetCurrentTemplate = () => {
    setTemplates((prev) => ({
      ...prev,
      [selectedId]: structuredClone(INITIAL_TEMPLATES[selectedId]),
    }));
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'customLogoDataUrl' | 'customBannerDataUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateActiveConfig(field, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddQuickLink = () => {
    const newItem: QuickLinkItem = {
      id: String(Date.now()),
      label: 'Portal Baru',
      url: 'https://smkn6garut.sch.id',
      icon: 'globe',
      color: '#2563EB',
    };
    updateActiveConfig('quickLinks', [...activeConfig.quickLinks, newItem]);
  };

  const handleUpdateQuickLink = (id: string, patch: Partial<QuickLinkItem>) => {
    updateActiveConfig(
      'quickLinks',
      activeConfig.quickLinks.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const handleRemoveQuickLink = (id: string) => {
    updateActiveConfig(
      'quickLinks',
      activeConfig.quickLinks.filter((item) => item.id !== id)
    );
  };

  const generatedFiles = useMemo(() => generateMikrotikFiles(activeConfig), [activeConfig]);

  const handleCopyCode = async (filename: keyof GeneratedMikrotikFiles) => {
    await navigator.clipboard.writeText(generatedFiles[filename]);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleDownloadZip = async (configToExport: HotspotConfig = activeConfig) => {
    setIsExporting(true);
    try {
      await downloadHotspotZip(configToExport);
    } finally {
      setIsExporting(false);
    }
  };

  const filteredTemplateList = useMemo(() => {
    const all = Object.values(templates) as HotspotConfig[];
    if (!searchQuery.trim()) return all;
    const q = searchQuery.toLowerCase();
    return all.filter(
      (t) =>
        t.templateName.toLowerCase().includes(q) ||
        t.templateCategory.toLowerCase().includes(q) ||
        t.templateDescription.toLowerCase().includes(q)
    );
  }, [templates, searchQuery]);

  // Calculate background position percentage for cropping the 5x2 reference image
  const getReferenceCropStyle = (config: HotspotConfig): React.CSSProperties => {
    const xPercent = (config.gridCol / 4) * 100;
    const yPercent = config.gridRow * 100;
    return {
      backgroundImage: `url('/assets/aistudio/SMKN_6_Garut_Wi-Fi_Login_Designs_d884b51e.png')`,
      backgroundSize: '500% 200%',
      backgroundPosition: `${xPercent}% ${yPercent}%`,
      backgroundRepeat: 'no-repeat',
    };
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-white border-b border-slate-200 sticky top-0 z-30">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('editor');
          }}
          className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          MikroSpot Studio
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'editor'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600'
            }`}
          >
            Visual Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'gallery'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600'
            }`}
          >
            Galeri 10 Template
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'code'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600'
            }`}
          >
            Kode RouterOS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reference')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'reference'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600'
            }`}
          >
            Desain Referensi
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            disabled={isExporting}
            onClick={() => handleDownloadZip(activeConfig)}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Menyiapkan ZIP...' : 'Unduh Paket ZIP'}</span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Bar */}
      <div className="flex md:hidden items-center justify-around bg-white border-b border-slate-200 px-2 py-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('editor')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'editor' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
          }`}
        >
          Editor
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gallery')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'gallery' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
          }`}
        >
          10 Template
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('code')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'code' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
          }`}
        >
          Kode HTML
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reference')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
            activeTab === 'reference' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
          }`}
        >
          Referensi
        </button>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: VISUAL EDITOR WORKSPACE                                      */}
      {/* =================================================================== */}
      {activeTab === 'editor' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-57px)]">
          {/* LEFT SIDEBAR: 10 Template Selector */}
          <aside className="lg:col-span-3 xl:col-span-3 bg-white border-r border-slate-200 flex flex-col max-h-[calc(100vh-57px)] overflow-y-auto">
            <div className="p-4 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-slate-900">Daftar 10 Template</h2>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  {filteredTemplateList.length}/10
                </span>
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari tema (TJKT, Garut, Dark...)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="divide-y divide-slate-100 flex-1">
              {filteredTemplateList.map((item) => {
                const isSelected = item.templateId === selectedId;
                return (
                  <button
                    key={item.templateId}
                    type="button"
                    onClick={() => setSelectedId(item.templateId)}
                    className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 cursor-pointer ${
                      isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Mini Color Swatch Thumbnail */}
                    <div
                      style={{
                        backgroundColor: item.primaryColor,
                        borderColor: item.accentColor,
                      }}
                      className="w-9 h-12 rounded-lg border-2 shrink-0 flex items-center justify-center text-white font-mono text-xs font-bold shadow-2xs"
                    >
                      {item.templateId}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-bold truncate ${
                          isSelected ? 'text-blue-700' : 'text-slate-900'
                        }`}
                      >
                        {item.templateName}
                      </p>
                      {/* Unboxed clean metadata with typographic separator */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 truncate">
                        <span>{item.templateCategory}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.isDarkTheme ? 'Dark' : 'Light'}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                        {item.templateDescription}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* CENTER STAGE: Live Interactive Captive Portal Viewport */}
          <main className="lg:col-span-5 xl:col-span-5 bg-slate-100/80 flex flex-col justify-between p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-57px)]">
            {/* Stage Controls Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl p-2 shadow-2xs mb-4">
              {/* Captive Portal Page Selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                {(['login', 'status', 'logout'] as PreviewPage[]).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setPreviewPage(page)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      previewPage === page
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {page}.html
                  </button>
                ))}
              </div>

              {/* Viewport & Compare Controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewport('mobile')}
                  title="Tampilan HP (375px)"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewport === 'mobile'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport('tablet')}
                  title="Tampilan Tablet"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewport === 'tablet'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport('desktop')}
                  title="Tampilan Desktop Captive Portal"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewport === 'desktop'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-slate-200 mx-1" />
                <button
                  type="button"
                  onClick={() => setCompareWithReference(!compareWithReference)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    compareWithReference
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Columns2 className="w-3.5 h-3.5" />
                  <span>Sandingkan Asli</span>
                </button>
              </div>
            </div>

            {/* Interactive Preview Container */}
            <div className="flex-1 flex items-center justify-center py-2">
              <div
                className={`flex flex-col xl:flex-row items-center justify-center gap-6 w-full ${
                  compareWithReference ? 'max-w-3xl' : ''
                }`}
              >
                {/* Live Editable MikroTik Portal Device Frame */}
                <div className="flex flex-col items-center">
                  <div className="text-xs text-slate-500 mb-2 flex items-center gap-2">
                    <span className="font-semibold text-slate-700">{activeConfig.templateName}</span>
                    <span aria-hidden="true">·</span>
                    <span>Pratinjau Interaktif</span>
                  </div>
                  <div
                    className={`relative rounded-[34px] p-2.5 bg-slate-900 shadow-xl border border-slate-800 transition-all duration-200 ${
                      viewport === 'mobile'
                        ? 'w-[340px] h-[650px]'
                        : viewport === 'tablet'
                        ? 'w-[420px] h-[660px]'
                        : 'w-full max-w-[460px] h-[660px]'
                    }`}
                  >
                    {/* Top Speaker Notch */}
                    <div className="w-20 h-1.5 bg-slate-800 rounded-full mx-auto mb-2" />
                    <div className="w-full h-[calc(100%-14px)] rounded-[24px] overflow-hidden bg-white">
                      <HotspotTemplateRenderer
                        config={activeConfig}
                        activePage={previewPage}
                        onPageChange={setPreviewPage}
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Side-by-Side Reference Artwork Comparison */}
                {compareWithReference && (
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-slate-500 mb-2 flex items-center gap-2">
                      <span className="font-semibold text-slate-700">Gambar Referensi Asli</span>
                      <span aria-hidden="true">·</span>
                      <span>Desain #{activeConfig.templateId}</span>
                    </div>
                    <div className="w-[320px] h-[630px] rounded-[28px] overflow-hidden border border-slate-300 shadow-lg bg-white">
                      <div
                        style={getReferenceCropStyle(activeConfig)}
                        className="w-full h-full"
                        title={`Referensi ${activeConfig.templateName}`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Stage Helper Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
              <span>
                Ketik Username bebas lalu klik <strong>Login</strong> pada pratinjau untuk menguji
                aliran halaman.
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className="font-semibold text-blue-600 hover:underline flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Lihat Kode login.html</span>
              </button>
            </div>
          </main>

          {/* RIGHT SIDEBAR: Customization Inspector */}
          <aside className="lg:col-span-4 xl:col-span-4 bg-white border-l border-slate-200 flex flex-col max-h-[calc(100vh-57px)] overflow-y-auto">
            {/* Inspector Section Tabs */}
            <div className="p-3 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setInspectorSection('identity')}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    inspectorSection === 'identity'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Identitas
                </button>
                <button
                  type="button"
                  onClick={() => setInspectorSection('form')}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    inspectorSection === 'form'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Form Login
                </button>
                <button
                  type="button"
                  onClick={() => setInspectorSection('style')}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    inspectorSection === 'style'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Warna & Gaya
                </button>
                <button
                  type="button"
                  onClick={() => setInspectorSection('links')}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    inspectorSection === 'links'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pintasan
                </button>
              </div>
            </div>

            {/* Inspector Body */}
            <div className="p-5 space-y-5 flex-1">
              {/* SECTION 1: IDENTITAS SEKOLAH & MEDIA */}
              {inspectorSection === 'identity' && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Identitas Sekolah / Instansi</h3>
                      <p className="text-xs text-slate-500">
                        Ubah teks header, logo, dan gambar latar belakang.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={applySchoolIdentityToAll}
                      title="Terapkan Nama Sekolah & Logo ini ke ke-10 template sekaligus"
                      className="px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Terapkan ke 10 Template
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nama Sekolah / Instansi
                      </label>
                      <input
                        type="text"
                        value={activeConfig.schoolName}
                        onChange={(e) => updateActiveConfig('schoolName', e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Judul Utama (Heading)
                      </label>
                      <input
                        type="text"
                        value={activeConfig.mainHeading}
                        onChange={(e) => updateActiveConfig('mainHeading', e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Sub-Judul / Keterangan Akses
                      </label>
                      <input
                        type="text"
                        value={activeConfig.subtitle}
                        onChange={(e) => updateActiveConfig('subtitle', e.target.value)}
                        placeholder="Contoh: Hotspot Sekolah / Akses Internet Sekolah"
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Teks Footer Utama
                        </label>
                        <input
                          type="text"
                          value={activeConfig.footerText}
                          onChange={(e) => updateActiveConfig('footerText', e.target.value)}
                          placeholder="MikroTik / Garut"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Sub-Teks Footer
                        </label>
                        <input
                          type="text"
                          value={activeConfig.footerSubtext}
                          onChange={(e) => updateActiveConfig('footerSubtext', e.target.value)}
                          placeholder="Hotspot / Kota Intan"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>

                    {/* Logo Upload */}
                    <div className="pt-2 border-t border-slate-100">
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Logo Sekolah (Otomatis Disematkan Offline di HTML)
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 border-dashed rounded-lg cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5 text-blue-600" />
                          <span>Unggah Logo (PNG/SVG/JPG)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'customLogoDataUrl')}
                            className="hidden"
                          />
                        </label>
                        {activeConfig.customLogoDataUrl && (
                          <button
                            type="button"
                            onClick={() => updateActiveConfig('customLogoDataUrl', '')}
                            className="px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            Reset Logo
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Banner / Background Photo Upload for Templates 1, 3, 4, 7 */}
                    <div className="pt-2 border-t border-slate-100">
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Foto Gedung / Latar Kustom (Opsional)
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 border-dashed rounded-lg cursor-pointer transition-colors">
                          <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                          <span>Ganti Foto Gedung / Latar</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'customBannerDataUrl')}
                            className="hidden"
                          />
                        </label>
                        {activeConfig.customBannerDataUrl && (
                          <button
                            type="button"
                            onClick={() => updateActiveConfig('customBannerDataUrl', '')}
                            className="px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            Gunakan Ilustrasi Bawaan
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* SECTION 2: FORM & FITUR MIKROTIK */}
              {inspectorSection === 'form' && (
                <>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Konfigurasi Form & RouterOS</h3>
                    <p className="text-xs text-slate-500">
                      Atur metode autentikasi siswa/guru, voucher, dan fitur tambahan.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Mode Login Hotspot
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
                        {(
                          [
                            { id: 'member', label: 'User & Pass' },
                            { id: 'voucher', label: '1-Input Voucher' },
                            { id: 'dual', label: 'Dual Tab' },
                          ] as const
                        ).map((mode) => (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => updateActiveConfig('loginMode', mode.id)}
                            className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                              activeConfig.loginMode === mode.id
                                ? 'bg-white text-slate-900 shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {mode.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Placeholder Username
                        </label>
                        <input
                          type="text"
                          value={activeConfig.usernamePlaceholder}
                          onChange={(e) => updateActiveConfig('usernamePlaceholder', e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Placeholder Password
                        </label>
                        <input
                          type="text"
                          value={activeConfig.passwordPlaceholder}
                          onChange={(e) => updateActiveConfig('passwordPlaceholder', e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Placeholder Kode Voucher
                        </label>
                        <input
                          type="text"
                          value={activeConfig.voucherPlaceholder}
                          onChange={(e) => updateActiveConfig('voucherPlaceholder', e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Teks Tombol Login
                        </label>
                        <input
                          type="text"
                          value={activeConfig.buttonText}
                          onChange={(e) => updateActiveConfig('buttonText', e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Pesan Pengumuman Sekolah (Opsional)
                      </label>
                      <input
                        type="text"
                        value={activeConfig.announcementText}
                        onChange={(e) => updateActiveConfig('announcementText', e.target.value)}
                        placeholder="Contoh: Gunakan akun NISN/NIP untuk login jaringan sekolah"
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-slate-100">
                      <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                        <span>Tampilkan Ikon Panah pada Tombol Login (&rarr;)</span>
                        <input
                          type="checkbox"
                          checked={activeConfig.showButtonArrow}
                          onChange={(e) => updateActiveConfig('showButtonArrow', e.target.checked)}
                          className="w-4 h-4 accent-blue-600 rounded"
                        />
                      </label>

                      <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                        <span>Aktifkan Tombol Free Trial MikroTik</span>
                        <input
                          type="checkbox"
                          checked={activeConfig.enableTrial}
                          onChange={(e) => updateActiveConfig('enableTrial', e.target.checked)}
                          className="w-4 h-4 accent-blue-600 rounded"
                        />
                      </label>

                      <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                        <span>Tampilkan Tombol Scan QR Code Voucher</span>
                        <input
                          type="checkbox"
                          checked={activeConfig.enableQrScanner}
                          onChange={(e) => updateActiveConfig('enableQrScanner', e.target.checked)}
                          className="w-4 h-4 accent-blue-600 rounded"
                        />
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* SECTION 3: WARNA & GAYA */}
              {inspectorSection === 'style' && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Warna & Gaya Visual</h3>
                      <p className="text-xs text-slate-500">
                        Sesuaikan palet warna dan bentuk komponen.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={resetCurrentTemplate}
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Default</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Warna Tombol / Aksen
                      </label>
                      <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1.5">
                        <input
                          type="color"
                          value={activeConfig.accentColor}
                          onChange={(e) => updateActiveConfig('accentColor', e.target.value)}
                          className="w-7 h-7 rounded cursor-pointer border-0"
                        />
                        <span className="text-xs font-mono uppercase">{activeConfig.accentColor}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Warna Teks Tombol
                      </label>
                      <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1.5">
                        <input
                          type="color"
                          value={activeConfig.buttonTextColor}
                          onChange={(e) => updateActiveConfig('buttonTextColor', e.target.value)}
                          className="w-7 h-7 rounded cursor-pointer border-0"
                        />
                        <span className="text-xs font-mono uppercase">
                          {activeConfig.buttonTextColor}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Warna Latar Kartu
                      </label>
                      <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1.5">
                        <input
                          type="color"
                          value={activeConfig.cardBgColor}
                          onChange={(e) => updateActiveConfig('cardBgColor', e.target.value)}
                          className="w-7 h-7 rounded cursor-pointer border-0"
                        />
                        <span className="text-xs font-mono uppercase">{activeConfig.cardBgColor}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Warna Judul & Teks
                      </label>
                      <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1.5">
                        <input
                          type="color"
                          value={activeConfig.textColor}
                          onChange={(e) => updateActiveConfig('textColor', e.target.value)}
                          className="w-7 h-7 rounded cursor-pointer border-0"
                        />
                        <span className="text-xs font-mono uppercase">{activeConfig.textColor}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Lengkungan Sudut Input & Tombol
                    </label>
                    <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl">
                      {(
                        [
                          { id: 'rounded-lg', label: 'Tegas (8px)' },
                          { id: 'rounded-xl', label: 'Modern (12px)' },
                          { id: 'rounded-full', label: 'Kapsul Penuh' },
                        ] as const
                      ).map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => updateActiveConfig('inputRadius', r.id)}
                          className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            activeConfig.inputRadius === r.id
                              ? 'bg-white text-slate-900 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* SECTION 4: PINTASAN PORTAL AKADEMIK (QUICK LINKS) */}
              {inspectorSection === 'links' && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Ikon Pintasan Bawah</h3>
                      <p className="text-xs text-slate-500">
                        Tautan cepat ke LMS, E-Rapor, PPDB, atau Website Sekolah.
                      </p>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-bold text-blue-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeConfig.showQuickLinks}
                        onChange={(e) => updateActiveConfig('showQuickLinks', e.target.checked)}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />
                      <span>Aktifkan</span>
                    </label>
                  </div>

                  {activeConfig.showQuickLinks && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Gaya Tampilan Ikon Pintasan
                        </label>
                        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
                          {(
                            [
                              { id: 'minimal-icon', label: 'Minimalis' },
                              { id: 'colorful-tiles', label: 'Ubin Warna' },
                              { id: 'neon-outline', label: 'Neon Cyber' },
                            ] as const
                          ).map((st) => (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => updateActiveConfig('quickLinksStyle', st.id)}
                              className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                                activeConfig.quickLinksStyle === st.id
                                  ? 'bg-white text-slate-900 shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {st.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {activeConfig.quickLinks.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) =>
                                  handleUpdateQuickLink(item.id, { label: e.target.value })
                                }
                                placeholder="Nama Pintasan (mis: LMS)"
                                className="flex-1 px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg"
                              />
                              <select
                                value={item.icon}
                                onChange={(e) =>
                                  handleUpdateQuickLink(item.id, {
                                    icon: e.target.value as IconType,
                                  })
                                }
                                className="px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                              >
                                {ICON_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => handleRemoveQuickLink(item.id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                title="Hapus Pintasan"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="url"
                                value={item.url}
                                onChange={(e) =>
                                  handleUpdateQuickLink(item.id, { url: e.target.value })
                                }
                                placeholder="https://lms.smkn6garut.sch.id"
                                className="flex-1 px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                              />
                              {activeConfig.quickLinksStyle === 'colorful-tiles' && (
                                <input
                                  type="color"
                                  value={item.color || '#1A73E8'}
                                  onChange={(e) =>
                                    handleUpdateQuickLink(item.id, { color: e.target.value })
                                  }
                                  className="w-7 h-7 rounded cursor-pointer border-0"
                                  title="Warna Ubin"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {activeConfig.quickLinks.length < 4 && (
                        <button
                          type="button"
                          onClick={handleAddQuickLink}
                          className="w-full py-2 px-3 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Tambah Pintasan (Maks. 4)</span>
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bottom Inspector Quick Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() =>
                  downloadSingleFile('login.html', generatedFiles['login.html'])
                }
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                Unduh login.html Saja
              </button>
              <button
                type="button"
                onClick={() => handleDownloadZip(activeConfig)}
                className="flex-1 py-2 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Paket Lengkap (.ZIP)</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: GALERI 10 TEMPLATE (5x2 GRID SEPERTI GAMBAR TERLAMPIR)        */}
      {/* =================================================================== */}
      {activeTab === 'gallery' && (
        <div className="max-w-[1440px] mx-auto w-full px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Koleksi 10 Template Hotspot MikroTik ({activeConfig.schoolName})
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Klik pada salah satu desain untuk mengedit detailnya atau langsung unduh paket file
                RouterOS.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={applySchoolIdentityToAll}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer whitespace-nowrap"
              >
                Sinkronkan Nama Sekolah ke Semua
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {(Object.values(templates) as HotspotConfig[]).map((tpl) => {
              const isCurrent = tpl.templateId === selectedId;
              return (
                <div key={tpl.templateId} className="flex flex-col items-center">
                  {/* Live Miniature Card */}
                  <div
                    onClick={() => {
                      setSelectedId(tpl.templateId);
                      setActiveTab('editor');
                    }}
                    className={`w-full h-[540px] rounded-[26px] overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer border-2 ${
                      isCurrent ? 'border-blue-600 ring-4 ring-blue-600/15' : 'border-slate-200'
                    }`}
                  >
                    <HotspotTemplateRenderer
                      config={tpl}
                      activePage="login"
                      onPageChange={() => {}}
                      compact
                    />
                  </div>

                  {/* Caption matching the attached reference sheet */}
                  <h3 className="text-sm font-extrabold text-slate-900 mt-3 text-center">
                    {tpl.templateName}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(tpl.templateId);
                        setActiveTab('editor');
                      }}
                      className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      Edit Desain
                    </button>
                    <span className="text-slate-300">·</span>
                    <button
                      type="button"
                      onClick={() => handleDownloadZip(tpl)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Unduh ZIP
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: KODE SUMBER ROUTEROS & WALLED GARDEN                          */}
      {/* =================================================================== */}
      {activeTab === 'code' && (
        <div className="max-w-6xl mx-auto w-full px-6 py-8 flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                Kode Sumber MikroTik RouterOS — {activeConfig.templateName}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Seluruh variabel standar RouterOS seperti{' '}
                <code className="font-mono text-slate-700">$(link-login-only)</code>,{' '}
                <code className="font-mono text-slate-700">$(chap-id)</code>, dan{' '}
                <code className="font-mono text-slate-700">$(error)</code> telah dikonfigurasi.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyCode(selectedCodeFile)}
                className="px-3.5 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                {copiedFile === selectedCodeFile ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin {selectedCodeFile}</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() =>
                  downloadSingleFile(selectedCodeFile, generatedFiles[selectedCodeFile])
                }
                className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh {selectedCodeFile}</span>
              </button>
            </div>
          </div>

          {/* File Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-200/70 p-1.5 rounded-xl mb-4">
            {(Object.keys(generatedFiles) as Array<keyof GeneratedMikrotikFiles>).map((fname) => (
              <button
                key={fname}
                type="button"
                onClick={() => setSelectedCodeFile(fname)}
                className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedCodeFile === fname
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {fname}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-slate-900 text-slate-100 rounded-2xl p-5 overflow-auto max-h-[600px] border border-slate-800 shadow-inner">
            <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap break-all">
              {generatedFiles[selectedCodeFile]}
            </pre>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 4: GAMBAR REFERENSI ASLI INTERAKTIF                              */}
      {/* =================================================================== */}
      {activeTab === 'reference' && (
        <div className="max-w-6xl mx-auto w-full px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                Lembar Desain Referensi Asli (10 Desain Login Wi-Fi SMKN 6 Garut)
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                Klik langsung pada salah satu dari 10 kartu pada gambar di bawah untuk membuka dan
                mengedit template tersebut di Visual Editor.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap"
            >
              Kembali ke Visual Editor
            </button>
          </div>

          {/* Interactive Clickable Overlay Grid on Top of Reference Image */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <img
              src="/assets/aistudio/SMKN_6_Garut_Wi-Fi_Login_Designs_d884b51e.png"
              alt="10 Desain Login Hotspot SMKN 6 Garut"
              referrerPolicy="no-referrer"
              className="w-full h-auto block"
            />
            <div className="absolute inset-0 grid grid-cols-5 grid-rows-2">
              {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as TemplateId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setSelectedId(id);
                    setActiveTab('editor');
                  }}
                  className="group relative w-full h-full border border-transparent hover:border-blue-500/80 hover:bg-blue-600/15 transition-all flex items-center justify-center cursor-pointer"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-slate-900/90 text-white text-xs font-bold rounded-lg shadow-md">
                    Edit Template #{id}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
