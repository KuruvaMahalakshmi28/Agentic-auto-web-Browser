import React from "react";
import { Compass, Globe, Eye, Server, RefreshCw, Sparkles, CheckCircle } from "lucide-react";

interface InteractiveNodeGraphProps {
  activeNode: "Planner" | "Browser" | "Critic" | "Synthesizer" | "Idle";
  refinementRequested: boolean;
  progress: number;
  onNodeClick?: (node: "Planner" | "Browser" | "Critic" | "Synthesizer") => void;
}

export default function InteractiveNodeGraph({
  activeNode,
  refinementRequested,
  progress,
  onNodeClick,
}: InteractiveNodeGraphProps) {
  return (
    <div className="relative blur-glass border border-violet-900/40 rounded-xl p-5 glow-purple hover:border-violet-600/40 transition-all duration-500 overflow-hidden" id="node-graph-panel">
      {/* Absolute ambient lights */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4 border-b border-violet-900/30 pb-3">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400 pulsing-glow" />
          <span className="font-mono text-xs uppercase tracking-wider text-gray-400">
            LangGraph Execution Frame
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500">
          <div className={`w-2 h-2 rounded-full ${activeNode !== "Idle" ? "bg-cyan-400 animate-ping" : "bg-zinc-600"}`} />
          {activeNode === "Idle" ? "SIMULATION STANDBY" : "ACTIVE ROUTING ENGINE"}
        </div>
      </div>

      {/* Node graph section */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 py-6 px-2 min-h-[220px]">
        {/* Connection vectors for background - visible on medium screens */}
        <svg className="absolute inset-0 w-full h-full hidden md:block pointer-events-none z-0">
          <defs>
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          {/* Connection Lines with flowing stroke */}
          <path
            d="M 120 110 L 260 110"
            stroke="url(#purpleGrad)"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          {activeNode === "Browser" && (
            <path
              d="M 120 110 L 260 110"
              stroke="#06b6d4"
              strokeWidth="2.5"
              className="animate-[dash_2s_linear_infinite]"
              style={{ strokeDasharray: "10,15", strokeDashoffset: -20 }}
            />
          )}

          <path
            d="M 340 110 L 480 110"
            stroke="url(#purpleGrad)"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          {activeNode === "Critic" && (
            <path
              d="M 340 110 L 480 110"
              stroke="#a855f7"
              strokeWidth="2.5"
              className="animate-[dash_2s_linear_infinite]"
              style={{ strokeDasharray: "10,15", strokeDashoffset: -20 }}
            />
          )}

          <path
            d="M 560 110 L 680 110"
            stroke="url(#purpleGrad)"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          {activeNode === "Synthesizer" && (
            <path
              d="M 560 110 L 680 110"
              stroke="#22c55e"
              strokeWidth="2.5"
              className="animate-[dash_2s_linear_infinite]"
              style={{ strokeDasharray: "10,15", strokeDashoffset: -20 }}
            />
          )}

          {/* Refinement feedback loop path back to Planner */}
          {refinementRequested && (
            <path
              d="M 520 150 C 520 220, 200 220, 80 150"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="1.5"
              strokeDasharray="5,5"
              className="animate-[pulse_1.5s_infinite]"
            />
          )}
        </svg>

        {/* Node 1: Planner */}
        <div
          id="node-planner"
          onClick={() => onNodeClick && onNodeClick("Planner")}
          className={`relative flex flex-col items-center p-3 rounded-xl border z-10 w-36 cursor-pointer hover:border-purple-400 transition-all duration-300 ${
            activeNode === "Planner"
              ? "bg-violet-950/80 border-purple-500 glow-border-purple scale-105"
              : "bg-zinc-950/60 border-violet-950/60 text-zinc-400"
          }`}
        >
          <div className={`p-2.5 rounded-lg mb-2 ${activeNode === "Planner" ? "bg-purple-500 text-white" : "bg-zinc-900/60 text-zinc-500"}`}>
            <Compass className="w-5 h-5 font-bold" />
          </div>
          <span className="font-mono text-xs font-semibold text-center mt-1">Planner Node</span>
          <span className="text-[10px] text-zinc-500 text-center mt-1 select-none">Configures Scrape-Graph</span>
          {activeNode === "Planner" && (
            <span className="absolute -top-2 px-1.5 py-0.5 bg-purple-500 text-[8px] font-bold text-white rounded font-mono uppercase animate-bounce">
              Active
            </span>
          )}
        </div>

        {/* Node 2: Autonomous Browser Operator */}
        <div
          id="node-browser"
          onClick={() => onNodeClick && onNodeClick("Browser")}
          className={`relative flex flex-col items-center p-3 rounded-xl border z-10 w-36 cursor-pointer hover:border-cyan-400 transition-all duration-300 ${
            activeNode === "Browser"
              ? "bg-cyan-950/85 border-cyan-400 glow-border-cyan scale-105"
              : "bg-zinc-950/60 border-violet-950/60 text-zinc-400"
          }`}
        >
          <div className={`p-2.5 rounded-lg mb-2 ${activeNode === "Browser" ? "bg-cyan-400 text-zinc-950" : "bg-zinc-900/60 text-zinc-500"}`}>
            <Globe className="w-5 h-5 animate-spin-slow" />
          </div>
          <span className="font-mono text-xs font-semibold text-center mt-1">Browser Node</span>
          <span className="text-[10px] text-zinc-500 text-center mt-1 select-none">Playwright Agent Scrape</span>
          {activeNode === "Browser" && (
            <span className="absolute -top-2 px-1.5 py-0.5 bg-cyan-400 text-[8px] font-bold text-zinc-950 rounded font-mono uppercase animate-bounce">
              Scraping
            </span>
          )}
        </div>

        {/* Node 3: Evaluator Critic */}
        <div
          id="node-critic"
          onClick={() => onNodeClick && onNodeClick("Critic")}
          className={`relative flex flex-col items-center p-3 rounded-xl border z-10 w-36 cursor-pointer hover:border-rose-400 transition-all duration-300 ${
            activeNode === "Critic"
              ? "bg-rose-950/80 border-rose-500 glow-border-purple scale-105"
              : "bg-zinc-950/60 border-violet-950/60 text-zinc-400"
          }`}
        >
          <div className={`p-2.5 rounded-lg mb-2 ${activeNode === "Critic" ? "bg-rose-500 text-white animate-pulse" : "bg-zinc-900/60 text-zinc-500"}`}>
            <Eye className="w-5 h-5" />
          </div>
          <span className="font-mono text-xs font-semibold text-center mt-1">Critic Node</span>
          <span className="text-[10px] text-zinc-500 text-center mt-1 select-none">Target Alignment Critic</span>
          {activeNode === "Critic" && (
            <span className="absolute -top-2 px-1.5 py-0.5 bg-rose-500 text-[8px] font-bold text-white rounded font-mono uppercase animate-pulse">
              Verifying
            </span>
          )}
          {refinementRequested && (
            <span className="absolute -bottom-2.5 flex items-center gap-1 px-1.5 py-0.5 bg-rose-600/90 text-[8px] font-mono text-white rounded border border-rose-500">
              <RefreshCw className="w-2h-3 animate-spin text-white" style={{ height: '8px' }} />
              RETRY TRIGGERED
            </span>
          )}
        </div>

        {/* Node 4: Synthesis */}
        <div
          id="node-synthesis"
          onClick={() => onNodeClick && onNodeClick("Synthesizer")}
          className={`relative flex flex-col items-center p-3 rounded-xl border z-10 w-36 cursor-pointer hover:border-green-400 transition-all duration-300 ${
            activeNode === "Synthesizer"
              ? "bg-green-950/80 border-green-500 glow-border-cyan scale-105"
              : "bg-zinc-950/60 border-violet-950/60 text-zinc-400"
          }`}
        >
          <div className={`p-2.5 rounded-lg mb-2 ${activeNode === "Synthesizer" ? "bg-green-500 text-black" : "bg-zinc-900/60 text-zinc-500"}`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-mono text-xs font-semibold text-center mt-1">Synthesizer</span>
          <span className="text-[10px] text-zinc-500 text-center mt-1 select-none">Dossier Builder</span>
          {activeNode === "Synthesizer" && (
            <span className="absolute -top-2 px-1.5 py-0.5 bg-green-500 text-[8px] font-semibold text-black rounded font-mono uppercase">
              Publishing
            </span>
          )}
        </div>
      </div>

      {/* Progress Telemetry */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
          <span>PIPELINE DISPATCH RATIO</span>
          <span className="text-cyan-400">{Math.round(progress)}% SECURE</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/40">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-green-500 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
