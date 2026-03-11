export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'pending' | 'reconciled' | 'error' | 'flagged';
  category: string;
  riskScore?: number;
}

export interface AgentStatus {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'processing' | 'alert';
  lastAction: string;
}

export interface PredictionData {
  period: string;
  actual: number;
  forecast: number;
  lowerBound: number;
  upperBound: number;
}

export interface Invoice {
  id: string;
  vendor: string;
  amount: number;
  dueDate?: string;
  date?: string;
  status: 'pending' | 'paid' | 'overdue' | 'validated' | 'posted';
  glAccount?: string;
  currency?: string;
  taxCode?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface FinanceState {
  balance: number;
  pendingInvoices: number;
  reconciliationProgress: number;
  transactions: Transaction[];
  invoices: Invoice[];
  cashFlowForecast: PredictionData[];
  agents: AgentStatus[];
  kpis: {
    workingCapital: number;
    dso: number;
    dpo: number;
    ebitda: number;
  };
}
