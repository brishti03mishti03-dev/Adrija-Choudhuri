import React from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, FileCheck, 
  AlertTriangle, Clock, ShieldCheck, Activity,
  BrainCircuit, Zap, Target, Layers, Cpu
} from 'lucide-react';
import { motion } from 'motion/react';
import { FinanceState } from '../types';
import { cn } from '../lib/utils';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

interface DashboardProps {
  state: FinanceState;
}

export const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const chartData = [
    { name: 'Mon', revenue: 4500, expenses: 3200 },
    { name: 'Tue', revenue: 5200, expenses: 3800 },
    { name: 'Wed', revenue: 4800, expenses: 4100 },
    { name: 'Thu', revenue: 6100, expenses: 3900 },
    { name: 'Fri', revenue: 5900, expenses: 4200 },
    { name: 'Sat', revenue: 3200, expenses: 2100 },
    { name: 'Sun', revenue: 2800, expenses: 1800 },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 p-6 space-y-6"
    >
      {/* CFO Strategic Cockpit */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Working Capital', value: `$${(state.kpis.workingCapital / 1000000).toFixed(1)}M`, icon: Layers, color: 'text-emerald-400', trend: 'Optimal' },
          { label: 'EBITDA Margin', value: `${state.kpis.ebitda}%`, icon: Target, color: 'text-indigo-400', trend: '+2.4%' },
          { label: 'DSO (Days)', value: state.kpis.dso, icon: Clock, color: 'text-amber-400', trend: '-3 Days' },
          { label: 'DPO (Days)', value: state.kpis.dpo, icon: Zap, color: 'text-blue-400', trend: 'Stable' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            className="bg-[#1C1F24] border border-[#2A2D32] p-5 rounded-xl hover:border-emerald-500/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <stat.icon className="w-12 h-12" />
            </div>
            <div className="flex items-start justify-between relative z-10">
              <div className={`p-2 rounded-lg bg-zinc-800/50 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                {stat.trend}
              </div>
            </div>
            <div className="mt-4 relative z-10">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Forecast (Predictive) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-[#1C1F24] border border-[#2A2D32] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-emerald-400" />
                90-Day Liquidity Forecast
              </h3>
              <p className="text-[10px] text-zinc-500 mt-1">Powered by HANA ML & TensorFlow</p>
            </div>
            <div className="flex gap-4 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-zinc-400">Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500/30 border border-emerald-500" />
                <span className="text-zinc-400">Forecast</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={state.cashFlowForecast}>
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2D32" vertical={false} />
                <XAxis dataKey="period" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C1F24', border: '1px solid #2A2D32', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} fill="transparent" />
                <Area type="monotone" dataKey="forecast" stroke="#10b981" strokeDasharray="5 5" fill="url(#colorForecast)" />
                <Area type="monotone" dataKey="upperBound" stroke="transparent" fill="#10b981" fillOpacity={0.05} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Multi-Agent Status */}
        <motion.div variants={itemVariants} className="bg-[#1C1F24] border border-[#2A2D32] p-6 rounded-xl">
          <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            Autonomous Agents
          </h3>
          <div className="space-y-4">
            {state.agents.map((agent) => (
              <div key={agent.id} className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      agent.status === 'processing' ? "bg-emerald-500 animate-pulse" : 
                      agent.status === 'alert' ? "bg-red-500" : "bg-zinc-600"
                    )} />
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">{agent.name}</span>
                  </div>
                  <span className="text-[9px] text-zinc-500 font-mono">{agent.role}</span>
                </div>
                <p className="text-[10px] text-zinc-400 italic">"{agent.lastAction}"</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-[#2A2D32]">
            <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-2">
              <span>Automation Success Rate</span>
              <span className="text-emerald-400">98.2%</span>
            </div>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="w-[98%] h-full bg-emerald-500" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Risk Detection & Anomaly Log */}
      <motion.div variants={itemVariants} className="bg-[#1C1F24] border border-[#2A2D32] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#2A2D32] flex items-center justify-between bg-red-500/5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-semibold text-white">Intelligent Risk Detection</h3>
          </div>
          <span className="text-[10px] text-red-400 font-mono animate-pulse">2 Critical Anomalies</span>
        </div>
        <div className="divide-y divide-[#2A2D32]">
          {state.transactions.filter(t => t.status === 'flagged' || t.riskScore && t.riskScore > 70).map((tx) => (
            <div key={tx.id} className="px-6 py-4 flex items-center justify-between hover:bg-red-500/5 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{tx.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-zinc-500 font-mono">{tx.id}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Risk Score: {tx.riskScore}%</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">${tx.amount.toLocaleString()}</p>
                <button className="text-[10px] text-emerald-400 font-bold hover:underline mt-1">Investigate</button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
