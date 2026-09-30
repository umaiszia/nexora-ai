import { BarChart3, BrainCircuit, Clock3, Database, FileText, Gauge, Lightbulb, MessageSquare, Sparkles, Target, Users, Zap } from 'lucide-react';
import type { IconKey } from '@/config/content';

export type IconType = typeof Zap;
export const iconMap: Record<IconKey, IconType> = {
  database: Database, gauge: Gauge, zap: Zap, brain: BrainCircuit, target: Target, sparkles: Sparkles,
  users: Users, clock: Clock3, lightbulb: Lightbulb, chart: BarChart3, file: FileText, message: MessageSquare,
};
export const iconKeys = Object.keys(iconMap) as IconKey[];
