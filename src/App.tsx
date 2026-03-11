import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  Bell, 
  Search, 
  User,
  Menu,
  X,
  Database,
  Cpu,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatWidget } from './components/ChatWidget';
import { Dashboard } from './components/Dashboard';
import { FinanceState, Transaction, Invoice } from './types';

const INITIAL_STATE: FinanceState = {
  balance: 1245800,
  pendingInvoices: 14,
  reconciliationProgress: 88,
  transactions: [
    { id: 'TX-9921', date: '2024-03-10', description: 'Bank Transfer - JP Morgan', amount: 45000, type: 'credit', status: 'reconciled', category: 'Operating' },
    { id: 'TX-9922', date: '2024-03-10', description: 'Vendor Payment - AWS Cloud', amount: 12400, type: 'debit', status: 'pending', category: 'IT Services' },
    { id: 'TX-9923', date: '2024-03-09', description: 'Payroll Posting - March', amount: 285000, type: 'debit', status: 'reconciled', category: 'Human Capital' },
    { id: 'TX-9924', date: '2024-03-09', description: 'Customer Receipt - Siemens', amount: 89000, type: 'credit', status: 'reconciled', category: 'Sales' },
    { id: 'TX-9925', date: '2024-03-08', description: 'Office Rent - Berlin HQ', amount: 15000, type: 'debit', status: 'flagged', category: 'Facilities', riskScore: 82 },
    { id: 'TX-9926', date: '2024-03-08', description: 'Duplicate Vendor Payment - Oracle', amount: 12000, type: 'debit', status: 'flagged', category: 'Software', riskScore: 95 },
  ],
  invoices: [
    { id: 'INV-001', vendor: 'Microsoft', glAccount: '610000', amount: 5000, currency: 'USD', taxCode: 'V1', status: 'validated', date: '2024-03-10' },
  ],
  cashFlowForecast: [
    { period: 'Mar', actual: 1245000, forecast: 1245000, lowerBound: 1200000, upperBound: 1300000 },
    { period: 'Apr', actual: 0, forecast: 1350000, lowerBound: 1250000, upperBound: 1450000 },
    { period: 'May', actual: 0, forecast: 1100000, lowerBound: 1000000, upperBound: 1200000 },
    { period: 'Jun', actual: 0, forecast: 1450000, lowerBound: 1300000, upperBound: 1600000 },
  ],
  agents: [
    { id: 'a1', name: 'Recon Agent', role: 'Bank Matching', status: 'idle', lastAction: 'Matched 14 entries' },
    { id: 'a2', name: 'AP Agent', role: 'Invoice Validation', status: 'processing', lastAction: 'Validating INV-001' },
    { id: 'a3', name: 'Risk Agent', role: 'Fraud Detection', status: 'alert', lastAction: 'Flagged TX-9926' },
  ],
  kpis: {
    workingCapital: 4200000,
    dso: 42,
    dpo: 35,
    ebitda: 24.5
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat'>('dashboard');
  const [state, setState] = useState<FinanceState>(INITIAL_STATE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleAction = (type: string, data?: any) => {
    console.log(`Executing SAP Intelligence Action: ${type}`, data);
    
    switch (type) {
      case 'FORECAST_CASH':
        setNotifications(prev => ['HANA ML: Running 90-day liquidity simulation...', ...prev]);
        setActiveTab('dashboard');
        break;
      
      case 'DETECT_RISK':
        setNotifications(prev => ['Risk Agent: Scanning for anomalies in ledger...', ...prev]);
        setTimeout(() => {
          setNotifications(prev => ['⚠️ ALERT: Potential duplicate payment detected for Oracle.', ...prev]);
        }, 2000);
        break;

      case 'RECONCILE_BANK':
        // ... existing logic ...
        setNotifications(prev => ['Bank reconciliation task started via iRPA...', ...prev]);
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            reconciliationProgress: Math.min(100, prev.reconciliationProgress + 5),
            transactions: prev.transactions.map(tx => tx.status === 'pending' ? { ...tx, status: 'reconciled' } : tx)
          }));
          setNotifications(prev => ['Success: Bank reconciliation complete for current period.', ...prev]);
        }, 2000);
        break;
      
      case 'POST_INVOICE':
        setNotifications(prev => ['Validating invoice data against S/4HANA master records...', ...prev]);
        setTimeout(() => {
          const newInvoice: Invoice = {
            id: `INV-${Math.floor(Math.random() * 1000)}`,
            vendor: 'New Vendor',
            glAccount: '400000',
            amount: 1500,
            currency: 'EUR',
            taxCode: 'V1',
            status: 'posted',
            date: new Date().toISOString().split('T')[0]
          };
          setState(prev => ({
            ...prev,
            invoices: [newInvoice, ...prev.invoices],
            pendingInvoices: prev.pendingInvoices + 1
          }));
          setNotifications(prev => [`Invoice ${newInvoice.id} posted successfully.`, ...prev]);
        }, 1500);
        break;

      case 'GET_REPORT':
        setActiveTab('dashboard');
        setNotifications(prev => ['Financial dashboard updated with real-time OData feeds.', ...prev]);
        break;
      
      case 'VALIDATE_DATA':
        setNotifications(prev => ['Running anomaly detection on GL entries...', ...prev]);
        setTimeout(() => {
          setNotifications(prev => ['Validation complete: No critical accounting errors detected.', ...prev]);
        }, 1000);
        break;
    }
  };

  return (
    <div className="flex h-screen bg-[#0D0E12] text-zinc-300 font-sans selection:bg-emerald-500/30">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="bg-[#151619] border-r border-[#2A2D32] flex flex-col z-50"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
            <Database className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-white tracking-tight"
            >
              SAP Finance AI
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Workspace' },
            { id: 'chat', icon: MessageSquare, label: 'AI Assistant' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                activeTab === item.id 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'hover:bg-white/5 text-zinc-500 hover:text-zinc-200'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-emerald-400' : 'group-hover:text-zinc-200'}`} />
              {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#2A2D32]">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-zinc-500 transition-all"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            {isSidebarOpen && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[#151619]/80 backdrop-blur-md border-b border-[#2A2D32] flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search S/4HANA records..." 
                className="w-full bg-[#0D0E12] border border-[#2A2D32] rounded-lg py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">DNV Cyber Secured</span>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer" />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#151619]" />
                )}
              </button>

              <AnimatePresence>
                {isNotificationOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsNotificationOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-[#1C1F24] border border-[#2A2D32] rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-[#2A2D32] flex items-center justify-between">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h3>
                        <button 
                          onClick={() => setNotifications([])}
                          className="text-[10px] text-zinc-500 hover:text-emerald-400 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto scrollbar-thin">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <Bell className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                            <p className="text-xs text-zinc-500">No new notifications</p>
                          </div>
                        ) : (
                          notifications.map((note, i) => (
                            <div key={i} className="p-4 border-b border-[#2A2D32] hover:bg-white/5 transition-colors">
                              <div className="flex gap-3">
                                <div className="w-6 h-6 rounded bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                </div>
                                <p className="text-[11px] text-zinc-300 leading-relaxed">{note}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <div className="h-8 w-[1px] bg-[#2A2D32]" />
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white">SAP Admin</p>
                <p className="text-[10px] text-zinc-500 font-mono">brishti03@sap.com</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-[#2A2D32] flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5 text-zinc-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <Dashboard state={state} />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full p-6"
              >
                <ChatWidget onAction={handleAction} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Status Bar */}
        <footer className="h-8 bg-[#1C1F24] border-t border-[#2A2D32] flex items-center justify-between px-6 text-[10px] font-mono text-zinc-500">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3" />
              <span>Region: AP-EAST-1</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3" />
              <span>BTP Runtime: Node.js 20</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              S/4HANA OData v4 Active
            </span>
            <span>v2.4.0-stable</span>
          </div>
        </footer>
      </main>

      {/* Notification Toast Area */}
      <div className="fixed bottom-12 right-6 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {notifications.slice(0, 3).map((note, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1C1F24] border border-emerald-500/30 p-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-zinc-200 font-medium">{note}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
