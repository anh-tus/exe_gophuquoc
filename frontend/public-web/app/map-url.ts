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
