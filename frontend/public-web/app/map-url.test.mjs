import assert from 'node:assert/strict';
import test from 'node:test';
import { phuQuocMapUrl } from './map-url.ts';

test('Phu Quoc map URL uses valid bounds and a real marker', () => {
  const url = new URL(phuQuocMapUrl());
  const [west, south, east, north] = url.searchParams.get('bbox').split(',').map(Number);
  assert.ok(west < east);
  assert.ok(south < north && north <= 90);
  assert.equal(url.searchParams.get('layer'), 'mapnik');
  assert.equal(url.searchParams.get('marker'), '10.027,104.017');
});
