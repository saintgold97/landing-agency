import {
    Leaf, Waves, Utensils, Helicopter, Compass, Heart, Wine, Baby,
    Sparkles, Bath, Sun, Moon, Flame, Droplet, Gem,
    type LucideIcon,
  } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
    "Leaf": Leaf,
    "Waves": Waves,
    "Utensils": Utensils,
    "Helicopter": Helicopter,
    "Compass": Compass,
    "Heart": Heart,
    "Wine": Wine,
    "Baby": Baby,
    "Sparkles": Sparkles,  // fallback
    "Bath": Bath,
    "Sun": Sun,
    "Moon": Moon,
    "Flame": Flame,
    "Droplet": Droplet,
    "Gem": Gem
  };
  
  /**
   * Risolve una stringa (dal config JSON) in un componente LucideIcon
   * @param name - Nome dell'icona (es. "Leaf")
   * @param fallback - Icona di fallback se non trovata (default: Sparkles)
   */
  export function getIconByName(name: string | undefined, fallback: LucideIcon = Sparkles): LucideIcon {
    if (!name) return fallback;
    return ICON_MAP[name] ?? fallback;
  }