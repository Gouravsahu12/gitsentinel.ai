"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, ShieldX, GitBranch, History } from "lucide-react";
import { cn } from "@/lib/utils";

interface RepoRiskMeterProps {
  score: number;
  level: string;
  branch: string;
  commitDepth: number;
}

export default function RepoRiskMeter({ score, level, branch, commitDepth }: RepoRiskMeterProps) {
  const isHigh = level === 'High Risk';
  const isModerate = level === 'Moderate Risk';
  
  const riskColor = isHigh ? 'text-destructive' : isModerate ? 'text-amber-500' : 'text-secondary';
  const Icon = isHigh ? ShieldX : isModerate ? ShieldAlert : ShieldCheck;

  // Gauge calculation
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col lg:flex-row items-center gap-16 py-4">
      {/* Gauge Module */}
      <div className="relative h-80 w-80 flex items-center justify-center shrink-0">
        {/* Background Glows */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className={cn("absolute inset-0 rounded-full blur-[80px]", isHigh ? "bg-destructive/30" : isModerate ? "bg-amber-500/30" : "bg-secondary/30")}
        />

        {/* Circular Gauge */}
        <div className="relative h-64 w-64">
           <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 200 200">
             <circle
               cx="100"
               cy="100"
               r={radius}
               stroke="currentColor"
               strokeWidth="10"
               fill="transparent"
               className="text-white/[0.03]"
             />
             <motion.circle
               cx="100"
               cy="100"
               r={radius}
               stroke="currentColor"
               strokeWidth="10"
               fill="transparent"
               strokeDasharray={circumference}
               initial={{ strokeDashoffset: circumference }}
               animate={{ strokeDashoffset: offset }}
               transition={{ duration: 2, ease: "circOut" }}
               className={riskColor}
               strokeLinecap="round"
             />
           </svg>
           
           {/* Score Readout */}
           <div className="absolute inset-0 flex flex-col items-center justify-center">
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-8xl font-bold font-headline tracking-tighter text-white tabular-nums leading-none"
             >
               {score}
             </motion.div>
             <div className="text-[9px] font-headline uppercase tracking-[0.3em] text-muted-foreground/60 mt-2 text-center">Overall Risk Score</div>
           </div>
        </div>
      </div>

      {/* Intelligence Readout */}
      <div className="flex-1 space-y-10 text-center lg:text-left">
        <div className="space-y-6">
          <div className="flex items-center justify-center lg:justify-start gap-4">
            <div className={cn("p-3 rounded-xl bg-white/5 border border-white/10", riskColor)}>
              <Icon className="h-8 w-8" />
            </div>
            <h2 className={cn("text-5xl md:text-6xl font-bold font-headline tracking-tighter uppercase", riskColor)}>
              {isHigh ? 'HIGH' : isModerate ? 'MODERATE' : 'SAFE'} <span className="text-white">RISK DETECTED</span>
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-[10px] font-headline tracking-widest uppercase text-white/70">
              <GitBranch className="h-3 w-3 text-primary" /> Branch: {branch.toUpperCase()}
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-[10px] font-headline tracking-widest uppercase text-white/70">
              <History className="h-3 w-3 text-secondary" /> Scope: {commitDepth} Commits
            </div>
          </div>
          
          <p className="text-muted-foreground/80 text-lg max-w-2xl leading-relaxed font-body">
            We analyzed {commitDepth} recent commits and found some unusual activity that may be risky.
          </p>
        </div>

        {/* Critical Signal Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'New Commit', status: 'safe', dotColor: 'bg-cyan-400' },
            { label: 'Suspicious commit detected', status: 'danger', dotColor: 'bg-red-500' },
            { label: 'New Contributor activity', status: 'warning', dotColor: 'bg-amber-500' }
          ].map((signal, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all"
            >
              <span className="text-[10px] font-headline tracking-widest text-muted-foreground/60 group-hover:text-white transition-colors uppercase">{signal.label}</span>
              <div className={cn(
                "h-2 w-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]", 
                signal.dotColor,
                signal.status === 'danger' && "animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)]"
              )} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
