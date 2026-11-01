export type TemplateId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type LoginMode = 'member' | 'voucher' | 'dual';

export type PreviewPage = 'login' | 'status' | 'logout';

export type DeviceViewport = 'mobile' | 'tablet' | 'desktop';

export type WorkspaceTab = 'editor' | 'gallery' | 'code' | 'reference';

export type IconType =
  | 'book'
  | 'lms'
  | 'globe'
  | 'cloud'
  | 'grad'
  | 'video'
  | 'download'
  | 'users'
  | 'user'
  | 'settings'
  | 'file'
  | 'award'
  | 'info'
  | 'wifi';

export interface QuickLinkItem {
  id: string;
  label: string;
  url: string;
  icon: IconType;
  color?: string;
}

export interface HotspotConfig {
  templateId: TemplateId;
  templateName: string;
  templateCategory: string;
  templateDescription: string;

  // Identity
  schoolName: string;
  mainHeading: string;
  subtitle: string;
  description: string;
  showWifiIconInSubtitle: boolean;
  footerText: string;
  footerSubtext: string;

  // Form Controls
  loginMode: LoginMode;
  usernamePlaceholder: string;
  passwordPlaceholder: string;
  voucherPlaceholder: string;
  buttonText: string;
  showButtonArrow: boolean;
  enableTrial: boolean;
  trialText: string;
  enableQrScanner: boolean;
  qrScannerUrl: string;
  announcementText: string;
  adminContact: string;

  // Visual Styling
  primaryColor: string;
  accentColor: string;
  buttonGradientEnd?: string;
  buttonTextColor: string;
  cardBgColor: string;
  textColor: string;
  mutedTextColor: string;
  inputBgColor: string;
  inputBorderColor: string;
  inputTextColor: string;
  inputRadius: 'rounded-lg' | 'rounded-xl' | 'rounded-full';
  isDarkTheme: boolean;

  // Custom Media (Base64 or empty for built-in vector/illustration)
  customLogoDataUrl: string;
  customBannerDataUrl: string;

  // Bottom Quick Links / Portal Icons
  showQuickLinks: boolean;
  quickLinksStyle: 'minimal-icon' | 'colorful-tiles' | 'neon-outline' | 'role-Clean';
  quickLinks: QuickLinkItem[];

  // Reference image crop coordinates (row 0..1, col 0..4 in the 5x2 grid)
  gridRow: 0 | 1;
  gridCol: 0 | 1 | 2 | 3 | 4;
}
