/**
 * Utility per convertire icone Lucide in SVG strings stilizzati
 * per la collezione Isometric Shapes
 */

import {
  Cpu,
  Server,
  Database,
  Cloud,
  CloudUpload,
  CloudDownload,
  Wifi,
  Bluetooth,
  Usb,
  Laptop,
  Smartphone,
  Monitor,
  Terminal,
  Code,
  Braces,
  GitBranch,
  GitMerge,
  Lock,
  Unlock,
  Shield,
  Key,
  Settings,
  FolderOpen,
  FileText,
  FileCode,
  QrCode,
  Hash,
  AtSign,
  Zap,
  Battery,
  Network,
  HardDrive,
  Router,
  Globe,
  Link,
  Webhook,
  Box,
  Layers,
  Package,
  Archive,
  Inbox,
  Send,
  Download,
  Upload,
  RefreshCw,
  RotateCw,
  Play,
  Pause,
  Square,
  Circle,
  Eye,
  EyeOff,
  Search,
  Filter,
  SlidersHorizontal,
  Mic,
  Camera,
  Image,
  Video,
  Music,
  Headphones,
  Speaker,
  Volume2,
  Radio,
  Podcast,
  Rss,
  Share2,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Navigation,
  Compass,
  Clock,
  Calendar,
  Timer,
  AlarmClock,
  Bell,
  BellRing,
  Bookmark,
  Heart,
  Star,
  ThumbsUp,
  Award,
  Trophy,
  Medal,
  Target,
  Crosshair,
  Sparkles,
  Lightbulb,
  Flame,
  Droplet,
  Sun,
  Moon,
  CloudSun,
  Thermometer,
  Wind,
  Umbrella
} from 'lucide-static';

// Colori consistenti con lo stile esistente
const COLORS = {
  stroke: '#c8c8c8',
  strokeLight: '#b0b0b0',
};

interface IconConfig {
  svg: string;
  width: number;
  height: number;
}

/**
 * Wrappa un'icona Lucide SVG con dimensioni e stili personalizzati
 */
function wrapLucideIcon(
  lucideSvg: string,
  targetWidth: number,
  targetHeight: number,
  iconSize?: number
): string {
  const size = iconSize || Math.min(targetWidth, targetHeight) - 20;
  const offsetX = (targetWidth - size) / 2;
  const offsetY = (targetHeight - size) / 2;

  // Modifica l'SVG Lucide: sostituisci currentColor e aggiusta dimensioni
  // Prima rimuovi newlines e spazi extra per evitare problemi di parsing
  let modifiedSvg = lucideSvg
    .replace(/\n\s*/g, ' ') // Rimuovi newlines e spazi
    .replace(/stroke="currentColor"/g, `stroke="${COLORS.stroke}"`)
    .replace(/stroke-width="2"/g, 'stroke-width="1.5"')
    .replace(/width="24"/g, `width="${size}"`)
    .replace(/height="24"/g, `height="${size}"`)
    .replace(/class="[^"]*"/g, ''); // Rimuovi classi non necessarie

  // Wrappa in un SVG container con le dimensioni target
  return `<svg width="${targetWidth}" height="${targetHeight}" viewBox="0 0 ${targetWidth} ${targetHeight}" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(${offsetX.toFixed(1)}, ${offsetY.toFixed(1)})">${modifiedSvg}</g></svg>`;
}

// ============ TECH ICONS ============

export const LUCIDE_TECH_ICONS: Record<string, IconConfig> = {
  // Hardware
  'cpu': { svg: wrapLucideIcon(Cpu, 80, 80), width: 80, height: 80 },
  'server': { svg: wrapLucideIcon(Server, 80, 90), width: 80, height: 90 },
  'hard-drive': { svg: wrapLucideIcon(HardDrive, 90, 70), width: 90, height: 70 },
  'router': { svg: wrapLucideIcon(Router, 90, 70), width: 90, height: 70 },

  // Cloud & Database
  'cloud': { svg: wrapLucideIcon(Cloud, 90, 65), width: 90, height: 65 },
  'cloud-upload': { svg: wrapLucideIcon(CloudUpload, 90, 75), width: 90, height: 75 },
  'cloud-download': { svg: wrapLucideIcon(CloudDownload, 90, 75), width: 90, height: 75 },
  'database': { svg: wrapLucideIcon(Database, 70, 85), width: 70, height: 85 },

  // Connectivity
  'wifi': { svg: wrapLucideIcon(Wifi, 80, 70), width: 80, height: 70 },
  'bluetooth': { svg: wrapLucideIcon(Bluetooth, 70, 80), width: 70, height: 80 },
  'usb': { svg: wrapLucideIcon(Usb, 70, 80), width: 70, height: 80 },
  'network': { svg: wrapLucideIcon(Network, 85, 85), width: 85, height: 85 },
  'globe': { svg: wrapLucideIcon(Globe, 80, 80), width: 80, height: 80 },
  'link': { svg: wrapLucideIcon(Link, 90, 60), width: 90, height: 60 },
  'webhook': { svg: wrapLucideIcon(Webhook, 80, 80), width: 80, height: 80 },

  // Devices
  'laptop': { svg: wrapLucideIcon(Laptop, 100, 70), width: 100, height: 70 },
  'smartphone': { svg: wrapLucideIcon(Smartphone, 60, 90), width: 60, height: 90 },
  'monitor': { svg: wrapLucideIcon(Monitor, 90, 75), width: 90, height: 75 },

  // Development
  'terminal': { svg: wrapLucideIcon(Terminal, 90, 70), width: 90, height: 70 },
  'code': { svg: wrapLucideIcon(Code, 90, 60), width: 90, height: 60 },
  'braces': { svg: wrapLucideIcon(Braces, 80, 70), width: 80, height: 70 },
  'git-branch': { svg: wrapLucideIcon(GitBranch, 70, 80), width: 70, height: 80 },
  'git-merge': { svg: wrapLucideIcon(GitMerge, 70, 80), width: 70, height: 80 },

  // Security
  'lock': { svg: wrapLucideIcon(Lock, 65, 80), width: 65, height: 80 },
  'unlock': { svg: wrapLucideIcon(Unlock, 70, 80), width: 70, height: 80 },
  'shield': { svg: wrapLucideIcon(Shield, 70, 85), width: 70, height: 85 },
  'key': { svg: wrapLucideIcon(Key, 85, 60), width: 85, height: 60 },

  // Settings & Files
  'settings': { svg: wrapLucideIcon(Settings, 75, 75), width: 75, height: 75 },
  'folder': { svg: wrapLucideIcon(FolderOpen, 85, 70), width: 85, height: 70 },
  'file-text': { svg: wrapLucideIcon(FileText, 65, 80), width: 65, height: 80 },
  'file-code': { svg: wrapLucideIcon(FileCode, 65, 80), width: 65, height: 80 },

  // Misc Tech
  'qr-code': { svg: wrapLucideIcon(QrCode, 75, 75), width: 75, height: 75 },
  'hash': { svg: wrapLucideIcon(Hash, 70, 70), width: 70, height: 70 },
  'at-sign': { svg: wrapLucideIcon(AtSign, 75, 75), width: 75, height: 75 },
  'zap': { svg: wrapLucideIcon(Zap, 60, 85), width: 60, height: 85 },
  'battery': { svg: wrapLucideIcon(Battery, 90, 50), width: 90, height: 50 },

  // 3D & Packages
  'box': { svg: wrapLucideIcon(Box, 80, 80), width: 80, height: 80 },
  'layers': { svg: wrapLucideIcon(Layers, 80, 80), width: 80, height: 80 },
  'package': { svg: wrapLucideIcon(Package, 80, 80), width: 80, height: 80 },
  'archive': { svg: wrapLucideIcon(Archive, 85, 70), width: 85, height: 70 },

  // Actions
  'inbox': { svg: wrapLucideIcon(Inbox, 80, 70), width: 80, height: 70 },
  'send': { svg: wrapLucideIcon(Send, 75, 75), width: 75, height: 75 },
  'download': { svg: wrapLucideIcon(Download, 70, 80), width: 70, height: 80 },
  'upload': { svg: wrapLucideIcon(Upload, 70, 80), width: 70, height: 80 },
  'refresh': { svg: wrapLucideIcon(RefreshCw, 75, 75), width: 75, height: 75 },
  'rotate': { svg: wrapLucideIcon(RotateCw, 75, 75), width: 75, height: 75 },

  // Media Controls
  'play': { svg: wrapLucideIcon(Play, 70, 70), width: 70, height: 70 },
  'pause': { svg: wrapLucideIcon(Pause, 70, 70), width: 70, height: 70 },
  'stop': { svg: wrapLucideIcon(Square, 70, 70), width: 70, height: 70 },

  // View
  'eye': { svg: wrapLucideIcon(Eye, 85, 60), width: 85, height: 60 },
  'eye-off': { svg: wrapLucideIcon(EyeOff, 85, 60), width: 85, height: 60 },
  'search': { svg: wrapLucideIcon(Search, 75, 75), width: 75, height: 75 },
  'filter': { svg: wrapLucideIcon(Filter, 70, 70), width: 70, height: 70 },
  'sliders': { svg: wrapLucideIcon(SlidersHorizontal, 85, 60), width: 85, height: 60 },
};

// ============ MEDIA ICONS ============

export const LUCIDE_MEDIA_ICONS: Record<string, IconConfig> = {
  'mic': { svg: wrapLucideIcon(Mic, 60, 85), width: 60, height: 85 },
  'camera': { svg: wrapLucideIcon(Camera, 85, 70), width: 85, height: 70 },
  'image': { svg: wrapLucideIcon(Image, 80, 70), width: 80, height: 70 },
  'video': { svg: wrapLucideIcon(Video, 90, 65), width: 90, height: 65 },
  'music': { svg: wrapLucideIcon(Music, 70, 70), width: 70, height: 70 },
  'headphones': { svg: wrapLucideIcon(Headphones, 75, 80), width: 75, height: 80 },
  'speaker': { svg: wrapLucideIcon(Speaker, 70, 85), width: 70, height: 85 },
  'volume': { svg: wrapLucideIcon(Volume2, 85, 70), width: 85, height: 70 },
  'radio': { svg: wrapLucideIcon(Radio, 80, 80), width: 80, height: 80 },
  'podcast': { svg: wrapLucideIcon(Podcast, 80, 80), width: 80, height: 80 },
  'rss': { svg: wrapLucideIcon(Rss, 70, 70), width: 70, height: 70 },
  'share': { svg: wrapLucideIcon(Share2, 75, 75), width: 75, height: 75 },
};

// ============ COMMUNICATION ICONS ============

export const LUCIDE_COMM_ICONS: Record<string, IconConfig> = {
  'message': { svg: wrapLucideIcon(MessageSquare, 80, 75), width: 80, height: 75 },
  'mail': { svg: wrapLucideIcon(Mail, 85, 65), width: 85, height: 65 },
  'phone': { svg: wrapLucideIcon(Phone, 70, 70), width: 70, height: 70 },
};

// ============ LOCATION ICONS ============

export const LUCIDE_LOCATION_ICONS: Record<string, IconConfig> = {
  'map-pin': { svg: wrapLucideIcon(MapPin, 60, 85), width: 60, height: 85 },
  'navigation': { svg: wrapLucideIcon(Navigation, 70, 75), width: 70, height: 75 },
  'compass': { svg: wrapLucideIcon(Compass, 75, 75), width: 75, height: 75 },
};

// ============ TIME ICONS ============

export const LUCIDE_TIME_ICONS: Record<string, IconConfig> = {
  'clock': { svg: wrapLucideIcon(Clock, 75, 75), width: 75, height: 75 },
  'calendar': { svg: wrapLucideIcon(Calendar, 75, 80), width: 75, height: 80 },
  'timer': { svg: wrapLucideIcon(Timer, 75, 75), width: 75, height: 75 },
  'alarm': { svg: wrapLucideIcon(AlarmClock, 75, 75), width: 75, height: 75 },
};

// ============ NOTIFICATION ICONS ============

export const LUCIDE_NOTIFICATION_ICONS: Record<string, IconConfig> = {
  'bell': { svg: wrapLucideIcon(Bell, 65, 80), width: 65, height: 80 },
  'bell-ring': { svg: wrapLucideIcon(BellRing, 75, 80), width: 75, height: 80 },
  'bookmark': { svg: wrapLucideIcon(Bookmark, 60, 80), width: 60, height: 80 },
};

// ============ SOCIAL ICONS ============

export const LUCIDE_SOCIAL_ICONS: Record<string, IconConfig> = {
  'heart': { svg: wrapLucideIcon(Heart, 75, 70), width: 75, height: 70 },
  'star': { svg: wrapLucideIcon(Star, 75, 75), width: 75, height: 75 },
  'thumbs-up': { svg: wrapLucideIcon(ThumbsUp, 75, 75), width: 75, height: 75 },
  'award': { svg: wrapLucideIcon(Award, 70, 85), width: 70, height: 85 },
  'trophy': { svg: wrapLucideIcon(Trophy, 75, 80), width: 75, height: 80 },
  'medal': { svg: wrapLucideIcon(Medal, 65, 85), width: 65, height: 85 },
  'target': { svg: wrapLucideIcon(Target, 75, 75), width: 75, height: 75 },
  'crosshair': { svg: wrapLucideIcon(Crosshair, 75, 75), width: 75, height: 75 },
};

// ============ EFFECT ICONS ============

export const LUCIDE_EFFECT_ICONS: Record<string, IconConfig> = {
  'sparkles': { svg: wrapLucideIcon(Sparkles, 80, 80), width: 80, height: 80 },
  'lightbulb': { svg: wrapLucideIcon(Lightbulb, 65, 85), width: 65, height: 85 },
  'flame': { svg: wrapLucideIcon(Flame, 65, 85), width: 65, height: 85 },
  'droplet': { svg: wrapLucideIcon(Droplet, 60, 80), width: 60, height: 80 },
};

// ============ WEATHER ICONS ============

export const LUCIDE_WEATHER_ICONS: Record<string, IconConfig> = {
  'sun': { svg: wrapLucideIcon(Sun, 80, 80), width: 80, height: 80 },
  'moon': { svg: wrapLucideIcon(Moon, 75, 75), width: 75, height: 75 },
  'cloud-sun': { svg: wrapLucideIcon(CloudSun, 90, 70), width: 90, height: 70 },
  'thermometer': { svg: wrapLucideIcon(Thermometer, 50, 90), width: 50, height: 90 },
  'wind': { svg: wrapLucideIcon(Wind, 85, 60), width: 85, height: 60 },
  'umbrella': { svg: wrapLucideIcon(Umbrella, 75, 80), width: 75, height: 80 },
};

// Export tutti gli icon sets combinati
export const ALL_LUCIDE_ICONS = {
  ...LUCIDE_TECH_ICONS,
  ...LUCIDE_MEDIA_ICONS,
  ...LUCIDE_COMM_ICONS,
  ...LUCIDE_LOCATION_ICONS,
  ...LUCIDE_TIME_ICONS,
  ...LUCIDE_NOTIFICATION_ICONS,
  ...LUCIDE_SOCIAL_ICONS,
  ...LUCIDE_EFFECT_ICONS,
  ...LUCIDE_WEATHER_ICONS,
};
