const DEFAULT_MAP_QUERY = 'La Paz, Bolivia';

export function buildMapQuery(address) {
  const value = String(address || '').trim();
  return value ? `${value}, La Paz, Bolivia` : DEFAULT_MAP_QUERY;
}

export function buildMapEmbedUrl(address) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(buildMapQuery(address))}&output=embed`;
}

export function buildMapLink(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(buildMapQuery(address))}`;
}
