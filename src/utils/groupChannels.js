export function extractCountry(channelName) {
  const match = channelName.match(/\[(\w+)\]$/);
  return match ? match[1] : 'International';
}

export function groupChannelsByCountry(channels) {
  const groups = {};
  (channels || []).forEach((ch) => {
    const country = extractCountry(ch.name);
    if (!groups[country]) groups[country] = [];
    groups[country].push(ch);
  });
  return groups;
}

export function extractNetworkName(channelName) {
  const cleaned = channelName.replace(/\[.*\]$/, '').replace(/\d+$/, '');
  return cleaned.replace(/([a-z])([A-Z])/g, '$1 $2').trim();
}

export function getCleanChannelName(channelName) {
  return channelName.replace(/\[.*\]$/, '').replace(/([a-z])([A-Z])/g, '$1 $2').trim();
}

export const COUNTRY_FLAGS = {
  UK: '🇬🇧', US: '🇺🇸', FR: '🇫🇷', DE: '🇩🇪', ES: '🇪🇸',
  IT: '🇮🇹', PT: '🇵🇹', NL: '🇳🇱', BR: '🇧🇷', AR: '🇦🇷',
  AU: '🇦🇺', ZA: '🇿🇦', IN: '🇮🇳', JP: '🇯🇵', KR: '🇰🇷',
  CA: '🇨🇦', MX: '🇲🇽', TR: '🇹🇷', RU: '🇷🇺', PL: '🇵🇱',
  International: '🌍',
};

export const COUNTRY_SORT_ORDER = ['UK', 'US', 'FR', 'DE', 'ES', 'IT', 'AU', 'IN', 'ZA', 'International'];
