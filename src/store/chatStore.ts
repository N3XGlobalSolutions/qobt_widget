// ============================================================
// Zustand Chat Store
// ============================================================
// Manages widget chat state: messages, conversation ID,
// loading state, open/closed, and the send-message action.
// ============================================================

import { create } from 'zustand';
import { v4 as uuidv4 } from '../utils/uuid';
import { Message, MessageRole, ChatResponse } from '../types';
import { sendMessage as apiSendMessage } from '../services/api';
import { WidgetConfig } from '../types';

interface ChatStore {
  // State
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  conversationStarted: boolean;
  conversationId: string | null;
  quickReplies: string[];
  showActions: boolean;
  error: string | null;
  config: WidgetConfig | null;

  // Actions
  setConfig: (config: WidgetConfig) => void;
  openWidget: () => void;
  closeWidget: () => void;
  toggleWidget: () => void;
  startConversation: () => void;
  sendMessage: (text: string) => Promise<void>;
  addFeedback: (messageId: string, feedback: 'up' | 'down') => void;
  handleScheduleCall: () => void;
  handleMaybeLater: () => void;
  resetConversation: () => void;
  clearError: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  isOpen: false,
  messages: [],
  isLoading: false,
  conversationStarted: false,
  conversationId: null,
  quickReplies: [],
  showActions: false,
  error: null,
  config: null,

  setConfig: (config) => set({ config }),

  openWidget: () => set({ isOpen: true }),
  closeWidget: () => set({ isOpen: false }),
  toggleWidget: () => set((s) => ({ isOpen: !s.isOpen })),

  startConversation: () => {
    set({ conversationStarted: true });
    get().sendMessage('I am interested');
  },

  sendMessage: async (text: string) => {
    const { config, conversationId, messages } = get();
    if (!config) return;

    // Add user message
    const userMsg: Message = {
      id: uuidv4(),
      role: MessageRole.User,
      text,
      timestamp: new Date(),
    };

    // Add optimistic bot placeholder while loading
    const botPlaceholderId = uuidv4();
    const botPlaceholder: Message = {
      id: botPlaceholderId,
      role: MessageRole.Bot,
      text: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    set({
      messages: [...messages, userMsg, botPlaceholder],
      isLoading: true,
      quickReplies: [],
      showActions: false,
      error: null,
    });

    try {
      const response: ChatResponse = await apiSendMessage(
        {
          query: text,
          tenant_id: config.tenantId,
          conversation_id: conversationId,
          user_identifier: `widget_${config.tenantId}_${Date.now()}`,
        },
        config.apiBaseUrl,
        config.apiKey
      );

      // Build final bot message from response
      const botMessage: Message = {
        id: response.message_id || botPlaceholderId,
        role: MessageRole.Bot,
        text: response.answer,
        timestamp: new Date(),
        isStreaming: false,
        isSummary: !!response.summary_data,
        summaryData: response.summary_data,
        showActions: !!response.show_actions,
        isSoftDQ: false,
        sources: response.sources,
      };

      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === botPlaceholderId ? botMessage : m
        ),
        conversationId: response.conversation_id || conversationId,
        isLoading: false,
        quickReplies: response.quick_replies || [],
        showActions: !!response.show_actions,
      }));
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || 'Something went wrong. Please try again.';

      // Replace placeholder with error message
      const errBotMsg: Message = {
        id: botPlaceholderId,
        role: MessageRole.Bot,
        text: '⚠️ ' + errorMessage,
        timestamp: new Date(),
        isStreaming: false,
      };

      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === botPlaceholderId ? errBotMsg : m
        ),
        isLoading: false,
        error: errorMessage,
      }));
    }
  },

  addFeedback: (messageId, feedback) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, feedback } : m
      ),
    }));
  },

  handleScheduleCall: () => {
    const { sendMessage } = get();
    set({ showActions: false });
    sendMessage('Yes, I would like to schedule a call.');
  },

  handleMaybeLater: () => {
    const { sendMessage } = get();
    set({ showActions: false });
    sendMessage('Maybe later, thank you.');
  },

  resetConversation: () => {
    set({
      messages: [],
      conversationStarted: false,
      conversationId: null,
      quickReplies: [],
      showActions: false,
      isLoading: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
