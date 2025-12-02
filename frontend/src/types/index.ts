// src/types/index.ts

// Base input types
export type TextInput = {
  text_input: string;
  image_input?: string | null;
  audio_input?: string | null;
};

// Request types
export type StartConversationRequest = TextInput;

export type ContinueClarifierRequest = {
  thread_id: string;
  answers: string[];
};

export type RunWorkflowRequest = {
  thread_id: string;
};

export type RunWorkflowStreamRequest = TextInput;

// Response types
export type ClarifierQuestion = {
  question: string;
  answer?: string;
};

export type ClarifierResp = {
  resp: ClarifierQuestion[];
  done: boolean;
};

export type ProductFeature = {
  name: string;
  description: string;
};

export type ProductResp = {
  name: string;
  description: string;
  features: ProductFeature[];
};

export type ConversationState = {
  session_id: string;
  state: {
    clarifier?: ClarifierResp;
    product?: ProductResp;
    customer?: any;
    engineer?: any;
    risk?: any;
    summary?: string;
    diagram_url?: string;
    tts_file?: string;
  };
  clarifier_done: boolean;
  current_round: number;
};

export type WorkflowProgress = {
  session_id: string;
  progress: {
    current_step: string;
    status: 'running' | 'completed' | 'error' | 'idle' | 'not_started';
    message: string;
  };
  workflow_done: boolean;
};

export type WorkflowResult = {
  session_id: string;
  final_data: {
    customer?: any;
    engineer?: any;
    risk?: any;
    diagram_url?: string;
  };
  summary: string;
  tts_file: string;
  status: string;
};

// Stream event types
export type StreamEvent = 
  | { step: 'start'; status: string; data: any; session_id: string; timestamp: number }
  | { step: 'clarifier'; status: string; data: ClarifierResp; error: any; session_id: string; timestamp: number }
  | { step: 'product'; status: string; data: { product: ProductResp; diagram_url: string }; error: any; session_id: string; timestamp: number }
  | { step: 'customer'; status: string; data: any; error: any; session_id: string; timestamp: number }
  | { step: 'engineer'; status: string; data: any; error: any; session_id: string; timestamp: number }
  | { step: 'risk'; status: string; data: any; error: any; session_id: string; timestamp: number }
  | { step: 'summary'; status: string; data: { summary: string }; error: any; session_id: string; timestamp: number }
  | { step: 'tts'; status: string; data: { tts_file: string }; error: any; session_id: string; timestamp: number }
  | { step: 'error'; status: string; error: string; session_id: string; timestamp: number }
  | WorkflowResult;