// ============================================================
// Widget Types — Shared across all components
// ============================================================

export enum MessageRole {
  User = 'user',
  Bot = 'model',
  System = 'system',
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
  isSummary?: boolean;
  summaryData?: Record<string, any>;
  showActions?: boolean;
  feedback?: 'up' | 'down';
  isSoftDQ?: boolean;
  sources?: string[];
}

export interface ChatResponse {
  answer: string;
  conversation_id: string;
  message_id: string;
  sources?: string[];
  suggested_actions?: string[];
  current_state?: string;
  current_step_index?: number;
  total_steps?: number;
  summary_data?: Record<string, any>;
  show_actions?: boolean;
  quick_replies?: string[];
  conversational_transition?: string;
  s2_lead_output?: {
    lead_priority: string;
    reasoning_summary: string;
    key_objections: string[];
    recommended_next_step: string;
  };
  s3_max_lead_output?: {
    verdict: string;
    lead_priority: string;
    reasoning_summary: string;
    key_objections: string[];
    recommended_next_step: string;
    qualification_score: number;
    dimension_scores?: Record<string, { score: number; notes: string }>;
  };
  estimated_progress?: number;
}

export interface WidgetConfig {
  apiKey: string;
  tenantId: string;
  apiBaseUrl: string;
  theme?: {
    primary?: string;
    secondary?: string;
  };
  botName?: string;
  botAvatar?: string;
  placeholder?: string;
  welcomeTitle?: string;
  welcomeSubtitle?: string;
  position?: 'bottom-right' | 'bottom-left';
  zIndex?: number;
}
