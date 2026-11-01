import {
  Boat,
  ForkKnife,
  Bed,
  Car,
  Leaf,
  Basket,
  Motorcycle,
  CableCar,
  BowlFood,
  Waves,
  Sun,
  Wind,
  SunHorizon,
  Sparkle,
  ShieldCheck,
  Wallet,
  FileText,
  Lightning,
  MagnifyingGlass,
  CaretRight,
  MapPin,
  Bookmark,
  User,
} from '@phosphor-icons/react';
import type { ComponentProps } from 'react';

const MAP = {
  boat: Boat,
  utensils: ForkKnife,
  bed: Bed,
  car: Car,
  leaf: Leaf,
  basket: Basket,
  motorbike: Motorcycle,
  cablecar: CableCar,
  bowl: BowlFood,
  waves: Waves,
  sun: Sun,
  wind: Wind,
  sunset: SunHorizon,
  sparkles: Sparkle,
  shield: ShieldCheck,
  wallet: Wallet,
  doc: FileText,
  bolt: Lightning,
  search: MagnifyingGlass,
  chevronRight: CaretRight,
  mapPin: MapPin,
  bookmark: Bookmark,
  user: User,
};

export type IconName = keyof typeof MAP;

export default function Icon({
  name,
  ...props
}: { name: IconName } & ComponentProps<typeof Boat>) {
  const C = MAP[name];
  return <C {...props} />;
}
