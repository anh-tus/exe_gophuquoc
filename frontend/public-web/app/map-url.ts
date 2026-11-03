const PHU_QUOC_BOUNDS = {
  west: 103.80,
  south: 9.95,
  east: 104.15,
  north: 10.45,
} as const;

export function phuQuocMapUrl() {
  const { west, south, east, north } = PHU_QUOC_BOUNDS;
  if (west >= east || south >= north || Math.abs(south) > 90 || Math.abs(north) > 90) {
    throw new Error('Invalid map bounds');
  }

  const url = new URL('https://www.openstreetmap.org/export/embed.html');
  url.searchParams.set('bbox', `${west},${south},${east},${north}`);
  url.searchParams.set('layer', 'mapnik');
  url.searchParams.set('marker', '10.027,104.017');
  return url.toString();
}

export function phuQuocGoogleMapUrl(options?: { satellite?: boolean; lat?: number; lon?: number; zoom?: number }) {
  const lat = options?.lat ?? 10.22;
  const lon = options?.lon ?? 103.96;
  const zoom = options?.zoom ?? 11;
  const type = options?.satellite ? 'k' : 'm';
  return `https://maps.google.com/maps?q=${lat},${lon}&z=${zoom}&t=${type}&hl=vi&output=embed`;
}
