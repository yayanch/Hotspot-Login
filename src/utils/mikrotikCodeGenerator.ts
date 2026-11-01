import JSZip from 'jszip';
import { HotspotConfig } from '../types/hotspot';
import { DEFAULT_SCHOOL_LOGO_DATA_URL } from '../data/templates';

export interface GeneratedMikrotikFiles {
  'login.html': string;
  'status.html': string;
  'logout.html': string;
  'alogin.html': string;
  'error.html': string;
  'md5.js': string;
  'walled-garden.rsc': string;
}

const getRadiusPx = (radius: HotspotConfig['inputRadius'], tid: number, isButton = false) => {
  if (isButton && (tid === 9 || tid === 10)) return '9999px';
  if (radius === 'rounded-full') return '9999px';
  if (radius === 'rounded-lg') return '8px';
  return '12px';
};

const getTemplateHeaderDecorationSvg = (config: HotspotConfig): string => {
  const tid = config.templateId;
  if (tid === 1) {
    if (config.customBannerDataUrl) {
      return `<div class="hero-banner"><img src="${config.customBannerDataUrl}" alt="${config.schoolName}" /><div class="wave-bottom"></div></div>`;
    }
    return `<div class="hero-banner">
      <svg viewBox="0 0 400 175" width="100%" height="165" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="175" fill="#38BDF8"/>
        <circle cx="40" cy="100" r="38" fill="#15803D"/>
        <circle cx="365" cy="100" r="38" fill="#15803D"/>
        <polygon points="15,90 95,52 175,90" fill="#B91C1C"/>
        <rect x="25" y="90" width="140" height="50" fill="#FDE68A"/>
        <path d="M168,48 L358,32 L358,72 L168,80 Z" fill="#1E3A8A" stroke="#93C5FD" stroke-width="2"/>
        <text x="264" y="60" fill="#FFFFFF" font-size="14" font-weight="800" font-family="sans-serif" text-anchor="middle">${config.schoolName}</text>
        <path d="M0,132 Q120,100 245,128 T400,114 L400,175 L0,175 Z" fill="#1D4ED8"/>
        <path d="M0,142 Q135,110 265,136 T400,122 L400,175 L0,175 Z" fill="${config.cardBgColor}"/>
      </svg>
    </div>`;
  }
  if (tid === 3) {
    return `<div class="courtyard-banner">
      <svg viewBox="0 0 400 120" width="100%" height="115" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="120" fill="#BAE6FD"/>
        <polygon points="40,46 75,18 325,18 360,46" fill="#C2410C"/>
        <rect x="52" y="46" width="296" height="52" fill="#F8FAFC"/>
        <rect x="52" y="70" width="296" height="5" fill="#1D4ED8"/>
        <rect x="0" y="96" width="400" height="24" fill="#4ADE80"/>
        <path d="M0,102 Q200,84 400,102 L400,120 L0,120 Z" fill="#2563EB"/>
        <path d="M0,108 Q200,90 400,108 L400,120 L0,120 Z" fill="${config.cardBgColor}"/>
      </svg>
    </div>`;
  }
  return '';
};

export function generateMikrotikFiles(config: HotspotConfig): GeneratedMikrotikFiles {
  const logoSrc = config.customLogoDataUrl || DEFAULT_SCHOOL_LOGO_DATA_URL;
  const tid = config.templateId;
  const inputRadiusPx = getRadiusPx(config.inputRadius, tid, false);
  const btnRadiusPx = getRadiusPx(config.inputRadius, tid, true);

  const btnBackground =
    tid === 5
      ? `background: rgba(10,17,44,0.92); border: 2px solid ${config.accentColor}; box-shadow: 0 0 16px ${config.accentColor}66;`
      : config.buttonGradientEnd
      ? `background: linear-gradient(90deg, ${config.accentColor} 0%, ${config.buttonGradientEnd} 100%); border: none;`
      : `background: ${config.accentColor}; border: none;`;

  const cardBackgroundStyle =
    tid === 2
      ? `radial-gradient(circle at 50% 20%, #0C2D5E 0%, ${config.cardBgColor} 65%, #020B18 100%)`
      : tid === 5
      ? `radial-gradient(circle at 50% 28%, #10193F 0%, #070B1E 60%, #040611 100%)`
      : tid === 7
      ? `linear-gradient(180deg, #60A5FA 0%, #BAE6FD 38%, #15803D 72%, #052E16 100%)`
      : tid === 10
      ? `linear-gradient(165deg, #128293 0%, ${config.cardBgColor} 55%, #075966 100%)`
      : config.cardBgColor;

  const quickLinksHtml =
    config.showQuickLinks && config.quickLinks.length > 0
      ? `<div class="quick-links cols-${Math.min(config.quickLinks.length, 4)}">
          ${config.quickLinks
            .map((q, i) => {
              const colors = ['#1A73E8', '#F97316', '#8B5CF6', '#0284C7'];
              const tileColor =
                config.quickLinksStyle === 'colorful-tiles'
                  ? `background:${q.color || colors[i % 4]}; color:#fff;`
                  : config.quickLinksStyle === 'neon-outline'
                  ? `background:#0f172a; border:1px solid ${config.accentColor}; color:${config.accentColor};`
                  : `background:rgba(59,130,246,0.12); color:${config.accentColor};`;
              return `<a href="${q.url}" target="_blank" rel="noopener" class="q-item">
                <span class="q-icon" style="${tileColor}">&#9679;</span>
                <span class="q-label">${q.label}</span>
              </a>`;
            })
            .join('\n          ')}
        </div>`
      : '';

  const sharedStyles = `
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0f172a;
      padding: 16px;
    }
    .portal-card {
      width: 100%;
      max-width: 400px;
      min-height: 660px;
      border-radius: 24px;
      overflow: hidden;
      background: ${cardBackgroundStyle};
      color: ${config.textColor};
      box-shadow: 0 24px 48px rgba(0,0,0,0.35);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }
    .content-pad { padding: 24px; position: relative; z-index: 2; }
    .logo-wrap {
      width: 72px; height: 72px; margin: ${tid === 1 ? '-38px auto 8px' : '0 auto 10px'};
      border-radius: 50%; background: ${tid === 1 ? '#fff' : 'transparent'};
      padding: ${tid === 1 ? '4px' : '0'}; display: flex; align-items: center; justify-content: center;
      position: relative; z-index: 5;
    }
    .logo-wrap img { width: 100%; height: 100%; object-fit: contain; }
    .school-title {
      text-align: center; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;
      color: ${config.textColor};
      ${tid === 10 ? 'background:#FACC15; color:#0F172A; display:inline-block; padding:6px 18px; border-radius:14px; transform:rotate(-2deg); margin-top:6px;' : ''}
    }
    .subtitle {
      text-align: center; font-size: 14px; font-weight: 700; margin-top: 6px;
      color: ${config.textColor}; opacity: 0.92;
    }
    .form-box { margin-top: 18px; display: flex; flex-direction: column; gap: 10px; }
    .input-group {
      display: flex; align-items: center; gap: 10px;
      background: ${config.inputBgColor};
      border: 1px solid ${config.inputBorderColor};
      border-radius: ${inputRadiusPx};
      padding: 11px 14px;
    }
    .input-group input {
      width: 100%; border: none; outline: none; background: transparent;
      color: ${config.inputTextColor}; font-size: 14px; font-weight: 500;
    }
    .btn-login {
      width: 100%; padding: 12px 20px; border-radius: ${btnRadiusPx};
      ${btnBackground}
      color: ${config.buttonTextColor};
      font-size: 15px; font-weight: 800; cursor: pointer;
      margin-top: 4px; transition: opacity 0.15s;
    }
    .btn-login:hover { opacity: 0.92; }
    .error-msg {
      background: rgba(239, 68, 68, 0.14); border: 1px solid rgba(239, 68, 68, 0.4);
      color: ${config.isDarkTheme ? '#FCA5A5' : '#B91C1C'};
      padding: 8px 12px; border-radius: 10px; font-size: 12px; text-align: center; font-weight: 600;
    }
    .tabs {
      display: grid; grid-template-columns: 1fr 1fr; gap: 4px;
      background: rgba(148, 163, 184, 0.22); padding: 4px; border-radius: 10px; margin-bottom: 4px;
    }
    .tab-btn {
      padding: 6px; border: none; border-radius: 7px; font-size: 12px; font-weight: 700; cursor: pointer;
      background: transparent; color: inherit;
    }
    .tab-btn.active { background: #ffffff; color: #0f172a; }
    .quick-links {
      display: grid; gap: 8px; margin-top: 18px; text-align: center;
    }
    .quick-links.cols-2 { grid-template-columns: repeat(2, 1fr); }
    .quick-links.cols-3 { grid-template-columns: repeat(3, 1fr); }
    .quick-links.cols-4 { grid-template-columns: repeat(4, 1fr); }
    .q-item { text-decoration: none; color: inherit; display: flex; flex-direction: column; align-items: center; gap: 5px; }
    .q-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
    .q-label { font-size: 11px; font-weight: 700; line-height: 1.2; }
    .footer-bar { text-align: center; padding: 14px 20px; font-size: 12px; font-weight: 700; opacity: 0.88; }
    .stats-table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 13px; }
    .stats-table td { padding: 8px 4px; border-bottom: 1px solid rgba(148,163,184,0.25); }
    .stats-table td:last-child { text-align: right; font-family: monospace; font-weight: 700; }
  `;

  const loginHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="pragma" content="no-cache" />
  <meta http-equiv="expires" content="-1" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.schoolName} — Hotspot Login</title>
  <style>${sharedStyles}</style>
</head>
<body>
  $(if chap-id)
  <form name="sendin" action="$(link-login-only)" method="post" style="display:none">
    <input type="hidden" name="username" />
    <input type="hidden" name="password" />
    <input type="hidden" name="dst" value="$(link-orig)" />
    <input type="hidden" name="popup" value="true" />
  </form>
  <script src="/md5.js"></script>
  <script>
    function doLogin() {
      document.sendin.username.value = document.login.username.value;
      document.sendin.password.value = hexMD5('$(chap-id)' + document.login.password.value + '$(chap-challenge)');
      document.sendin.submit();
      return false;
    }
  </script>
  $(endif)

  <div class="portal-card">
    <div>
      ${getTemplateHeaderDecorationSvg(config)}
      <div class="content-pad" style="padding-bottom:0; text-align:center;">
        <div class="logo-wrap">
          <img src="${logoSrc}" alt="${config.schoolName}" />
        </div>
        <h1 class="school-title">${config.mainHeading}</h1>
        ${config.subtitle ? `<p class="subtitle">${config.subtitle}</p>` : ''}
      </div>
    </div>

    <div class="content-pad">
      $(if error)
      <div class="error-msg">$(error)</div>
      $(endif)

      <form name="login" action="$(link-login-only)" method="post" $(if chap-id) onSubmit="return doLogin()" $(endif) class="form-box">
        <input type="hidden" name="dst" value="$(link-orig)" />
        <input type="hidden" name="popup" value="true" />

        ${
          config.loginMode === 'dual'
            ? `<div class="tabs">
          <button type="button" id="btnMember" class="tab-btn active" onclick="setMode('member')">Siswa / Guru</button>
          <button type="button" id="btnVoucher" class="tab-btn" onclick="setMode('voucher')">Voucher</button>
        </div>`
            : ''
        }

        <div class="input-group">
          <input id="userField" name="username" type="text" value="$(username)" placeholder="${
            config.loginMode === 'voucher' ? config.voucherPlaceholder : config.usernamePlaceholder
          }" autocomplete="username" required />
        </div>

        <div class="input-group" id="passGroup" style="${config.loginMode === 'voucher' ? 'display:none;' : ''}">
          <input id="passField" name="password" type="password" placeholder="${config.passwordPlaceholder}" autocomplete="current-password" />
        </div>

        <button type="submit" class="btn-login">
          ${config.buttonText} ${config.showButtonArrow ? '&rarr;' : ''}
        </button>

        $(if trial == 'yes')
        <div style="text-align:center; margin-top:6px;">
          <a href="$(link-login-only)?dst=$(link-orig-esc)&amp;username=T-$(mac-esc)" style="font-size:12px; color:inherit; font-weight:700;">
            ${config.trialText || 'Uji Coba Gratis'}
          </a>
        </div>
        $(endif)
      </form>

      ${quickLinksHtml}
    </div>

    <div class="footer-bar">
      ${config.footerText} ${config.footerSubtext}
    </div>
  </div>

  <script>
    var currentMode = '${config.loginMode === 'voucher' ? 'voucher' : 'member'}';
    var userField = document.getElementById('userField');
    var passField = document.getElementById('passField');
    var passGroup = document.getElementById('passGroup');

    function syncVoucher() {
      if (currentMode === 'voucher') {
        passField.value = userField.value;
      }
    }
    userField.addEventListener('input', syncVoucher);

    function setMode(mode) {
      currentMode = mode;
      var btnM = document.getElementById('btnMember');
      var btnV = document.getElementById('btnVoucher');
      if (mode === 'voucher') {
        passGroup.style.display = 'none';
        userField.placeholder = '${config.voucherPlaceholder}';
        passField.value = userField.value;
        if (btnV) btnV.className = 'tab-btn active';
        if (btnM) btnM.className = 'tab-btn';
      } else {
        passGroup.style.display = 'flex';
        userField.placeholder = '${config.usernamePlaceholder}';
        passField.value = '';
        if (btnM) btnM.className = 'tab-btn active';
        if (btnV) btnV.className = 'tab-btn';
      }
    }
  </script>
</body>
</html>`;

  const statusHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  $(if refresh-timeout)
  <meta http-equiv="refresh" content="$(refresh-timeout-secs)" />
  $(endif)
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.schoolName} — Status Hotspot</title>
  <style>${sharedStyles}</style>
</head>
<body>
  <div class="portal-card">
    <div class="content-pad" style="text-align:center;">
      <div class="logo-wrap">
        <img src="${logoSrc}" alt="${config.schoolName}" />
      </div>
      <h1 class="school-title">${config.schoolName}</h1>
      <p class="subtitle">Terhubung sebagai <strong>$(username)</strong></p>

      <table class="stats-table">
        <tr><td>IP Address</td><td>$(ip)</td></tr>
        <tr><td>MAC Address</td><td>$(mac)</td></tr>
        <tr><td>Upload / Download</td><td>$(bytes-in-nice) / $(bytes-out-nice)</td></tr>
        <tr><td>Waktu Aktif</td><td>$(uptime)</td></tr>
        $(if session-time-left)
        <tr><td>Sisa Waktu</td><td>$(session-time-left)</td></tr>
        $(endif)
      </table>

      <form action="$(link-logout)" name="logout" onSubmit="return openLogout()">
        <input type="hidden" name="erase-cookie" value="on" />
        $(if login-by-mac != 'yes')
        <button type="submit" class="btn-login" style="background:#e11d48; color:#fff;">
          Putuskan Koneksi (Logout)
        </button>
        $(endif)
      </form>

      ${quickLinksHtml}
    </div>
    <div class="footer-bar">${config.footerText} ${config.footerSubtext}</div>
  </div>
</body>
</html>`;

  const logoutHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.schoolName} — Logout Hotspot</title>
  <style>${sharedStyles}</style>
</head>
<body>
  <div class="portal-card">
    <div class="content-pad" style="text-align:center; margin:auto 0;">
      <div class="logo-wrap">
        <img src="${logoSrc}" alt="${config.schoolName}" />
      </div>
      <h1 class="school-title">Sesi Berakhir</h1>
      <p class="subtitle">Anda telah keluar dari jaringan Hotspot ${config.schoolName}.</p>

      <table class="stats-table">
        <tr><td>Username</td><td>$(username)</td></tr>
        <tr><td>IP Address</td><td>$(ip)</td></tr>
        <tr><td>Waktu Pakai</td><td>$(uptime)</td></tr>
        <tr><td>Total Kuota</td><td>$(bytes-in-nice) / $(bytes-out-nice)</td></tr>
      </table>

      <form action="$(link-login)" name="login" onSubmit="return openLogin()">
        <button type="submit" class="btn-login">Login Kembali</button>
      </form>
    </div>
    <div class="footer-bar">${config.footerText} ${config.footerSubtext}</div>
  </div>
</body>
</html>`;

  const aloginHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="2; url=$(link-redirect)" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login Berhasil — ${config.schoolName}</title>
  <style>${sharedStyles}</style>
</head>
<body>
  <div class="portal-card">
    <div class="content-pad" style="text-align:center; margin:auto 0;">
      <h1 class="school-title">Login Berhasil!</h1>
      <p class="subtitle" style="margin-top:10px;">Mengalihkan ke halaman tujuan...</p>
      <p style="margin-top:18px; font-size:13px;"><a href="$(link-redirect)" style="color:inherit;">Klik di sini jika tidak beralih otomatis</a></p>
    </div>
  </div>
</body>
</html>`;

  const errorHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kesalahan Hotspot — ${config.schoolName}</title>
  <style>${sharedStyles}</style>
</head>
<body>
  <div class="portal-card">
    <div class="content-pad" style="text-align:center; margin:auto 0;">
      <h1 class="school-title">Terjadi Kesalahan</h1>
      <div class="error-msg" style="margin:16px 0;">$(error)</div>
      <p style="font-size:13px;"><a href="$(link-login)" style="color:inherit; font-weight:700;">&larr; Kembali ke Halaman Login</a></p>
    </div>
  </div>
</body>
</html>`;

  const md5Js = `/*
 * Standard RouterOS CHAP MD5 Helper (RFC 1321)
 * Place inside the MikroTik hotspot/ directory alongside login.html
 */
function hexMD5(s) { return binl2hex(core_md5(str2binl(s), s.length * 8)); }
function core_md5(x, len) {
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;
  var a =  1732584193, b = -271733879, c = -1732584194, d =  271733878;
  for(var i = 0; i < x.length; i += 16) {
    var olda = a, oldb = b, oldc = c, oldd = d;
    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);
    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);
    a = safe_add(a, olda); b = safe_add(b, oldb); c = safe_add(c, oldc); d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);
}
function md5_cmn(q, a, b, x, s, t) { return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b); }
function md5_ff(a, b, c, d, x, s, t) { return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t); }
function md5_gg(a, b, c, d, x, s, t) { return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t); }
function md5_hh(a, b, c, d, x, s, t) { return md5_cmn(b ^ c ^ d, a, b, x, s, t); }
function md5_ii(a, b, c, d, x, s, t) { return md5_cmn(c ^ (b | (~d)), a, b, x, s, t); }
function safe_add(x, y) { var lsw = (x & 0xFFFF) + (y & 0xFFFF); var msw = (x >> 16) + (y >> 16) + (lsw >> 16); return (msw << 16) | (lsw & 0xFFFF); }
function bit_rol(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }
function str2binl(str) {
  var bin = Array();
  for(var i = 0; i < str.length * 8; i += 8) bin[i>>5] |= (str.charCodeAt(i / 8) & 255) << (i%32);
  return bin;
}
function binl2hex(binarray) {
  var hex_tab = "0123456789abcdef", str = "";
  for(var i = 0; i < binarray.length * 4; i++) {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) + hex_tab.charAt((binarray[i>>2] >> ((i%4)*8)) & 0xF);
  }
  return str;
}`;

  const walledGardenLines = config.quickLinks
    .map((q) => {
      try {
        const host = new URL(q.url).hostname;
        return `/ip hotspot walled-garden ip add action=accept dst-host="${host}" comment="Akses Gratis ${q.label}"`;
      } catch {
        return `# URL tidak valid untuk ${q.label}: ${q.url}`;
      }
    })
    .join('\n');

  const walledGardenRsc = `# ====================================================================
# Script Walled Garden MikroTik RouterOS — ${config.schoolName}
# Tempelkan di New Terminal WinBox agar link portal akademik dapat
# diakses oleh siswa/guru meskipun belum login hotspot.
# ====================================================================
${walledGardenLines || '# Tidak ada link pintasan aktif'}
`;

  return {
    'login.html': loginHtml,
    'status.html': statusHtml,
    'logout.html': logoutHtml,
    'alogin.html': aloginHtml,
    'error.html': errorHtml,
    'md5.js': md5Js,
    'walled-garden.rsc': walledGardenRsc,
  };
}

export async function downloadHotspotZip(config: HotspotConfig): Promise<void> {
  const files = generateMikrotikFiles(config);
  const zip = new JSZip();
  const folder = zip.folder('hotspot');

  if (folder) {
    Object.entries(files).forEach(([filename, content]) => {
      folder.file(filename, content);
    });
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const slug = config.schoolName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  a.href = url;
  a.download = `mikrotik-hotspot-${slug}-template-${config.templateId}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadSingleFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
