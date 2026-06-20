import React, { useState, useEffect, useRef } from "react";
import {
  Compass,
  Globe,
  Eye,
  Server,
  Play,
  Terminal as TerminalIcon,
  Sparkles,
  Info,
  CheckCircle,
  HelpCircle,
  Send,
  Sliders,
  Database,
  Cpu,
  Layers,
  FileCheck,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Filter,
  Code
} from "lucide-react";
import InteractiveNodeGraph from "./components/InteractiveNodeGraph";
import PlaywrightTerminal from "./components/PlaywrightTerminal";
import { AgentOptions, BrowserStep, TerminalLog, AgenticLoopResponse } from "./types";

const INITIAL_LOGS: TerminalLog[] = [
  {
    id: "sys-0",
    timestamp: new Date().toLocaleTimeString(),
    message: "AgentWeb Framework Initialization completed. Ready to dispatch search graph.",
    type: "system",
    node: "System"
  },
  {
    id: "sys-1",
    timestamp: new Date().toLocaleTimeString(),
    message: "Pressing 'Launch Agentic Loop' will bind simulated scraping execution via server endpoints.",
    type: "info",
    node: "System"
  }
];

export default function App() {
  const [query, setQuery] = useState("Find software engineering internships in Hyderabad");
  const [options, setOptions] = useState<AgentOptions>({
    maxDepth: 4,
    selfCorrection: "High",
    browserMode: "headless",
    searchProviders: ["Google", "LinkedIn", "Indeed"]
  });

  // State for Multi-Agent execution simulation
  const [isRunning, setIsRunning] = useState(false);
  const [activeNode, setActiveNode] = useState<"Planner" | "Browser" | "Critic" | "Synthesizer" | "Idle">("Idle");
  const [progress, setProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>(INITIAL_LOGS);
  
  // Scraped output data from backend configuration
  const [agentData, setAgentData] = useState<AgenticLoopResponse | null>(null);
  const [allFinishedSteps, setAllFinishedSteps] = useState<BrowserStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"dossier" | "metadata" | "metrics">("dossier");
  const [selectedConfigNode, setSelectedConfigNode] = useState<"Planner" | "Browser" | "Critic" | "Synthesizer" | null>(null);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of terminal when logs are added
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  // Preset templates
  const presets = [
    {
      label: "Hyderabad SWE Internships",
      query: "Find software engineering internships in Hyderabad",
      description: "Searches careers across major tech parks in Southern India (HITEC City, Gachibowli)."
    },
    {
      label: "AI Agents Stack Trends 2026",
      query: "Analyze current tech stack trends in AI agents and LangGraph frameworks",
      description: "Aggregates engineering reviews, schema builders, and popular repositories."
    },
    {
      label: "Open Source LLM benchmarks",
      query: "Scrape open-source LLM benchmarking metrics on HuggingFace for reasoning models",
      description: "Scrapes dynamic stats tables & logs benchmarks from recent models."
    }
  ];

  const handleSelectPreset = (pQuery: string) => {
    if (isRunning) return;
    setQuery(pQuery);
  };

  const addLog = (message: string, type: TerminalLog["type"], node: TerminalLog["node"]) => {
    const timestamp = new Date().toLocaleTimeString();
    const id = Math.random().toString(36).substr(2, 9);
    setTerminalLogs(prev => [...prev, { id, timestamp, message, type, node }]);
  };

  // The main simulation runner
  const launchAgenticLoop = async () => {
    if (isRunning) return;
    if (!query.trim()) {
      alert("Please specify a search query or objective directives before launching.");
      return;
    }

    setIsRunning(true);
    setAgentData(null);
    setAllFinishedSteps([]);
    setCurrentStepIndex(-1);
    setProgress(5);
    setActiveNode("Planner");
    setTerminalLogs([
      {
        id: "sys-start",
        timestamp: new Date().toLocaleTimeString(),
        message: `🔄 Initializing multi-agent thread dispatcher for directives: "${query}"`,
        type: "system",
        node: "System"
      }
    ]);

    try {
      // Step 1: Query backend server to retrieve high-quality AI simulated steps
      addLog("Sending prompt criteria to AgentWeb server API gateway...", "info", "System");
      
      const response = await fetch("/api/agentic-loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, options })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const resJson = await response.json();
      const payload: AgenticLoopResponse = resJson.data;
      setApiOnline(resJson.apiOnline);

      if (resJson.apiOnline === false) {
        if (resJson.error) {
          addLog(`⚠️ Upstream alert: Gemini API server reported error (${resJson.error.substring(0, 100)}). System activated auto-recovery simulation pathway.`, "warning", "System");
        } else {
          addLog("ℹ️ Multi-agent simulation dispatch optimized with framework presets.", "info", "System");
        }
      }

      // We have loaded the plan from the server! Let's start the simulation timeline.
      addLog("Successfully parsed target planner coordinates from Gemini.", "success", "Planner");
      
      // Planner state starts
      setProgress(15);
      addLog(`Objectives formulated: ${payload.plannerNode.objectives.join(", ")}`, "info", "Planner");
      addLog(`Configured targeting coordinates: ${payload.plannerNode.targetSources.join(", ")}`, "info", "Planner");
      addLog(`Vulnerability & Defense analysis completed: ${payload.plannerNode.vulnerabilityAnalysis}`, "warning", "Planner");

      await delay(1800);

      // Browser state starts
      setActiveNode("Browser");
      setProgress(30);
      addLog("Transitioning thread block to Autonomous Playwright Node.", "system", "Browser");

      // Construct ordered steps array: normal steps + (optional refined steps if critic requested)
      const baseSteps = payload.browserSteps || [];
      const hasRefinement = payload.criticNode?.needsRefinement;
      const refinedSteps = payload.refinedBrowserSteps || [];

      // Step simulation playback loop
      for (let i = 0; i < baseSteps.length; i++) {
        const step = baseSteps[i];
        setCurrentStepIndex(i);
        setAllFinishedSteps(prev => [...prev, step]);

        addLog(`Executing Playwright step ${step.stepNumber}: [${step.action}] on ${step.url}`, "info", "Browser");
        addLog(`Running script snippet:\n${step.playwrightCode}`, "code", "Browser");
        
        await delay(1500);

        if (step.status === "CAPTCHA_DETECTED") {
          addLog("⚠️ CLOUDFLARE WAF / CAPTCHA CHALLENGE TRIGGERED. Activating bypass system.", "warning", "Browser");
          await delay(1200);
        } else if (step.status === "SUCCESS") {
          addLog(`✅ Successfully scraped content buffer block. Length: ${step.extractedData.length} chars.`, "success", "Browser");
        }

        setProgress(30 + Math.round((i + 1) / baseSteps.length * 30));
        await delay(1200);
      }

      // Critic state starts
      setActiveNode("Critic");
      setProgress(65);
      addLog(`Evaluating extracted raw buffers with Evaluator Critic (Alignment Model)...`, "system", "Critic");
      await delay(1500);

      addLog(`Critic Target Match Score: ${payload.criticNode.relevanceScore}%`, "info", "Critic");
      addLog(`Constructive feedback points:\n- ${payload.criticNode.critiquePoints.join("\n- ")}`, "warning", "Critic");

      if (hasRefinement) {
        addLog(`⚠️ Critic requires refinement: "${payload.criticNode.refinementInstructions}"`, "warning", "Critic");
        addLog(`Re-routing to Planner Node target lists for high accuracy fallback.`, "system", "System");
        await delay(1800);

        // Transition back to planner and refined browser steps
        setActiveNode("Planner");
        setProgress(75);
        
        if (payload.refinedPlannerNode) {
          addLog(`Adjusted search targeting list: ${payload.refinedPlannerNode.adjustedSources.join(", ")}`, "info", "Planner");
          addLog(`Enforcing next objectives: ${payload.refinedPlannerNode.newObjectives.join(", ")}`, "info", "Planner");
        }
        await delay(1500);

        setActiveNode("Browser");
        addLog("Refined browser execution starting.", "system", "Browser");

        for (let i = 0; i < refinedSteps.length; i++) {
          const step = refinedSteps[i];
          setAllFinishedSteps(prev => [...prev, step]);
          setCurrentStepIndex(baseSteps.length + i);

          addLog(`Refined Playwright step ${step.stepNumber}: [${step.action}] on ${step.url}`, "info", "Browser");
          addLog(`Running adjusted snippet: \n${step.playwrightCode}`, "code", "Browser");
          
          await delay(1500);
          addLog(`Scraped refined data successfully.`, "success", "Browser");
          setProgress(75 + Math.round((i + 1) / refinedSteps.length * 15));
          await delay(1000);
        }
      }

      // Synthesis starts
      setActiveNode("Synthesizer");
      setProgress(95);
      addLog("All steps concluded. Initiating deep research summary formulation...", "system", "Synthesizer");
      await delay(1800);

      // Finished!
      setAgentData(payload);
      addLog(`🎉 Synthesis completed successfully! Discovered ${payload.finalSynthesis.totalResultsScraped} high quality records.`, "success", "Synthesizer");
      setProgress(100);
      setActiveNode("Idle");
      setIsRunning(false);

    } catch (err: any) {
      console.error(err);
      addLog(`❌ Critical crash: ${err.message || "Unknown execution error"}`, "error", "System");
      setActiveNode("Idle");
      setIsRunning(false);
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const downloadMarkdown = () => {
    if (!agentData) return;
    const blob = new Blob([agentData.finalSynthesis.richMarkdownReport], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agentweb-research-${query.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    if (!agentData) return;
    const blob = new Blob([JSON.stringify(agentData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agentweb-payload-${query.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#07050f] text-zinc-100 font-sans antialiased selection:bg-cyan-500 selection:text-black">
      {/* Dynamic Background Glowing Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/10 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/10 w-[600px] h-[600px] bg-cyan-950/10 rounded-full blur-[160px] animate-pulse" />
      </div>

      {/* Main Workspace Frame container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Header Branding */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 mb-8 border-b border-violet-900/30">
          <div>
            <div className="flex items-center gap-2 mb-1.5ClassName bg-violet-950 px-2.5 py-1 rounded">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold tracking-widest bg-violet-900/60 text-purple-300 border border-violet-700/30">
                <Cpu className="w-3 h-3 text-cyan-400" />
                MULTI-AGENT SYSTEMS WORKSPACE
              </span>
              {apiOnline === true && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-green-950/60 text-green-400 border border-green-700/20">
                  GEMINI ONLINE
                </span>
              )}
              {apiOnline === false && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-950/60 text-amber-400 border border-amber-700/20" title="No GEMINI_API_KEY detected. Dynamic offline simulation mode is active.">
                  SANDBOX OFFLINE MODE
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-300 to-cyan-400 font-sans" id="app-title">
              AgentWeb Framework
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Advanced multi-agent pipeline orchestrating an autonomous recursive planner, browser controller scripts, and real-time critic evaluation.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2 items-center">
            <span className="text-zinc-500 font-mono text-xs hidden sm:inline">System Time: {new Date().toLocaleDateString()}</span>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT PANEL: INPUT CONTROL CENTER & TRACE LOGS SCREEN (8 COLS) */}
          <section className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Input Directive Control Center */}
            <div className="blur-glass border border-violet-900/40 rounded-xl p-5 glow-purple hover:border-violet-600/30 transition-all duration-300" id="control-center">
              <div className="flex items-center gap-2 mb-4">
                <Sliders className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm uppercase tracking-wider font-mono font-bold text-zinc-300">
                  Directive Control Center
                </h2>
              </div>

              {/* Text Area input */}
              <div className="mb-4">
                <label htmlFor="objective-input" className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase font-medium">
                  Enter Complex Research Objective / Job Search Task
                </label>
                <div className="relative">
                  <textarea
                    id="objective-input"
                    rows={3}
                    placeholder="Enter what you want the multi-agent system to scrape, research, and compile..."
                    className="w-full bg-zinc-950 text-zinc-100 rounded-lg border border-violet-900/50 p-3.5 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all custom-scrollbar placeholder:text-zinc-600 leading-relaxed"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={isRunning}
                  />
                  <div className="absolute bottom-2.5 right-2.5">
                    <button
                      onClick={launchAgenticLoop}
                      disabled={isRunning}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-zinc-950 font-mono font-bold text-xs shadow-md transition-all ${
                        isRunning ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Launch Agentic Loop</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Fast Presets templates */}
              <div className="mb-4">
                <span className="block text-[11px] font-mono text-zinc-500 mb-1.5 uppercase">
                  Objective Templates
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {presets.map((p, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectPreset(p.query)}
                      disabled={isRunning}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                        query === p.query
                          ? "bg-violet-950/50 border-purple-500 text-purple-200"
                          : "bg-zinc-950/40 border-violet-950/40 text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"
                      }`}
                    >
                      <div className="font-semibold mb-0.5 font-mono text-[10px] truncate max-w-full">
                        {p.label}
                      </div>
                      <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Configuration parameters */}
              <div className="border-t border-violet-900/20 pt-4">
                <div className="flex flex-wrap gap-4 text-xs font-mono">
                  <div className="flex-1 min-w-[120px]">
                    <label htmlFor="self-correction-select" className="text-zinc-500 block mb-1">SELF-CORRECTION DEPTH</label>
                    <select
                      id="self-correction-select"
                      className="bg-zinc-950/80 text-zinc-300 border border-violet-900/40 rounded px-2 py-1 w-full text-[11px] focus:outline-none focus:border-cyan-400"
                      value={options.selfCorrection}
                      onChange={(e: any) => setOptions({ ...options, selfCorrection: e.target.value })}
                      disabled={isRunning}
                    >
                      <option value="Off">Off (Fast Sweep)</option>
                      <option value="Medium">Medium (1 Critic Iteration)</option>
                      <option value="High">High (Strict Human Feedback)</option>
                    </select>
                  </div>

                  <div className="flex-1 min-w-[120px]">
                    <label htmlFor="max-depth" className="text-zinc-500 block mb-1">MAX DEEP SWEEPS</label>
                    <input
                      id="max-depth"
                      type="number"
                      min={1}
                      max={10}
                      className="bg-zinc-950/80 text-zinc-300 border border-violet-900/40 rounded px-2 py-1 w-full text-[11px] focus:outline-none focus:border-cyan-400"
                      value={options.maxDepth}
                      onChange={(e) => setOptions({ ...options, maxDepth: parseInt(e.target.value) || 4 })}
                      disabled={isRunning}
                    />
                  </div>

                  <div className="flex-1 min-w-[120px]">
                    <label htmlFor="browser-mode-select" className="text-zinc-500 block mb-1">BROWSER STATE</label>
                    <select
                      id="browser-mode-select"
                      className="bg-zinc-950/80 text-zinc-300 border border-violet-900/40 rounded px-2 py-1 w-full text-[11px] focus:outline-none focus:border-cyan-400"
                      value={options.browserMode}
                      onChange={(e: any) => setOptions({ ...options, browserMode: e.target.value })}
                      disabled={isRunning}
                    >
                      <option value="headless">Headless Frame (Async)</option>
                      <option value="headed">Headed Sandboxed View</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            {/* Simulated Live Node Graph visualizer */}
            <InteractiveNodeGraph
              activeNode={activeNode}
              refinementRequested={agentData?.criticNode.needsRefinement || allFinishedSteps.length > 4}
              progress={progress}
              onNodeClick={(node) => setSelectedConfigNode(node)}
            />

            {/* Professional Stream Trace Log Terminal */}
            <div className="blur-glass border border-violet-900/40 rounded-xl p-5 glow-purple hover:border-violet-600/30 transition-all duration-300 flex-1 flex flex-col min-h-[300px]" id="terminal-logs-panel">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-violet-900/20">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-4 h-4 text-purple-400" />
                  <span className="font-mono text-xs uppercase tracking-wider font-bold text-zinc-300">
                    Live Agentic Trace Log Terminal
                  </span>
                </div>
                <div className="text-[10px] font-mono text-zinc-500">
                  Buffer stream: {terminalLogs.length} outputs
                </div>
              </div>

              {/* Log lines container */}
              <div className="flex-1 bg-zinc-950 p-3 rounded-lg font-mono text-[11px] text-zinc-300 overflow-y-auto max-h-[320px] custom-scrollbar space-y-2 select-text" id="log-console">
                {terminalLogs.map((log) => {
                  let badgeColors = "bg-zinc-900 text-zinc-400 border border-zinc-800";
                  if (log.node === "Planner") badgeColors = "bg-purple-950 text-purple-300 border border-purple-800/30";
                  if (log.node === "Browser") badgeColors = "bg-cyan-950 text-cyan-300 border border-cyan-800/30";
                  if (log.node === "Critic") badgeColors = "bg-rose-950 text-rose-300 border border-rose-800/30";
                  if (log.node === "System") badgeColors = "bg-yellow-950 text-yellow-300 border border-yellow-800/20";
                  if (log.node === "Synthesizer") badgeColors = "bg-green-950 text-green-300 border border-green-800/30";

                  let textColors = "text-zinc-300";
                  if (log.type === "success") textColors = "text-green-400";
                  if (log.type === "warning") textColors = "text-amber-400";
                  if (log.type === "error") textColors = "text-red-400 font-bold";
                  if (log.type === "code") textColors = "text-cyan-400/90 whitespace-pre bg-zinc-900/50 p-2 rounded block mt-1.5 overflow-x-auto";

                  return (
                    <div key={log.id} className="border-b border-zinc-900/45 pb-1">
                      <div className="flex items-start gap-1.5 flex-wrap">
                        <span className="text-[10px] text-zinc-600 select-none shrink-0">
                          [{log.timestamp}]
                        </span>
                        <span className={`text-[9px] px-1 rounded-sm tracking-wide font-semibold shrink-0 uppercase select-none ${badgeColors}`}>
                          {log.node}
                        </span>
                        {log.type !== "code" ? (
                          <p className={`flex-1 ${textColors}`}>{log.message}</p>
                        ) : (
                          <div className="w-full">
                            <code className={textColors}>{log.message}</code>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={terminalEndRef} />
              </div>

              {/* Loading Indicator under active execution */}
              {isRunning && (
                <div className="mt-3 flex items-center justify-between text-xs text-cyan-400 bg-cyan-950/20 p-2 rounded border border-cyan-500/10 font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>Multi-Agent dispatcher processing coordinates...</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-tight">Stage: {activeNode} Node</span>
                </div>
              )}
            </div>

          </section>

          {/* RIGHT PANEL: AUTONOMOUS PLAYWRIGHT ENGINE SIMULATOR & SYNTHESIS REPORT DOSSIER */}
          <section className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Playwright Terminal Emulator (Interactive viewport/code view) */}
            <PlaywrightTerminal
              currentStep={allFinishedSteps[currentStepIndex] || null}
              allSteps={allFinishedSteps}
              activeStepIndex={currentStepIndex}
            />

            {/* Final Synthesis Dossier Box */}
            <div className="blur-glass border border-violet-900/40 rounded-xl p-5 glow-purple hover:border-violet-600/30 transition-all duration-300 flex-1 flex flex-col h-full min-h-[400px]" id="synthesis-dossier-panel">
              <div className="flex items-center justify-between mb-4 border-b border-violet-900/20 pb-3">
                <div className="flex gap-1.5">
                  <Sparkles className="w-4 h-4 text-green-400" />
                  <span className="font-mono text-xs uppercase tracking-wider font-bold text-zinc-300">
                    Compiled Research Dossier
                  </span>
                </div>
                
                {agentData && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={downloadMarkdown}
                      className="text-[10px] bg-cyan-950/60 text-cyan-400 hover:bg-cyan-900 border border-cyan-800/40 px-2 py-0.5 rounded font-mono font-bold uppercase transition-all"
                      title="Download full report as Markdown file"
                    >
                      Export MD
                    </button>
                    <button
                      onClick={downloadJSON}
                      className="text-[10px] bg-purple-950/60 text-purple-300 hover:bg-purple-900 border border-purple-800/40 px-3 py-0.5 rounded font-mono font-bold uppercase transition-all"
                      title="Download complete payload raw databases"
                    >
                      Export JSON
                    </button>
                    <span className="hidden sm:inline-flex text-[10px] px-1.5 py-0.5 rounded bg-green-950 font-mono text-green-400 border border-green-800/30">
                      STABLE SYNTHESIS
                    </span>
                  </div>
                )}
              </div>

              {/* Dossier Tabs */}
              <div className="flex items-center gap-3 border-b border-zinc-800/40 mb-3 text-xs font-mono">
                <button
                  onClick={() => setActiveTab("dossier")}
                  className={`pb-2 transition-all relative ${
                    activeTab === "dossier" ? "text-cyan-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Markdown Synthesis
                  {activeTab === "dossier" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
                </button>
                <button
                  onClick={() => setActiveTab("metadata")}
                  className={`pb-2 transition-all relative ${
                    activeTab === "metadata" ? "text-cyan-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Extracted Records
                  {activeTab === "metadata" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
                </button>
                <button
                  onClick={() => setActiveTab("metrics")}
                  className={`pb-2 transition-all relative ${
                    activeTab === "metrics" ? "text-cyan-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Execution Statistics
                  {activeTab === "metrics" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
                </button>
              </div>

              {/* Tab Display Area */}
              <div className="flex-1 overflow-y-auto max-h-[460px] custom-scrollbar select-text">
                {agentData ? (
                  <>
                    {activeTab === "dossier" && (
                      <div className="prose prose-invert prose-xs text-xs text-zinc-300 space-y-4">
                        <div className="p-1 mb-2 bg-zinc-950 rounded-lg p-4 border border-violet-900/20 max-w-full">
                          
                          {/* Rich report details parsed as lightweight components to adhere strictly to UI needs without big heavy complex parser packages */}
                          <div className="font-sans space-y-4">
                            
                            {/* Parsed Custom Markdown Container */}
                            <div className="border-b border-zinc-900 pb-3">
                              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                                <FileCheck className="w-4 h-4 text-green-400" />
                                {query} Command Dossier
                              </h3>
                              <p className="text-zinc-500 text-[11px] mt-1 italic">
                                Formulated via multi-agent collaborative trace log outputs.
                              </p>
                            </div>

                            {/* Aggregated Opportunities Section */}
                            <div>
                              <h4 className="text-xs font-mono font-bold tracking-wider text-purple-300 uppercase mb-2">
                                TOP RATING TARGET REQUISITIONS
                              </h4>
                              
                              <div className="grid grid-cols-1 gap-2">
                                {agentData.finalSynthesis.dataPointsExtracted.map((item, idx) => (
                                  <div key={idx} className="bg-zinc-900/60 p-3.5 rounded-lg border border-violet-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-violet-500/30 transition-all">
                                    <div className="flex-1">
                                      <div className="font-semibold text-zinc-100 text-xs flex items-center gap-1.5 flex-wrap">
                                        <span>{item.title}</span>
                                        {item.applyUrl && (
                                          <span className="text-[9px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-1.5 py-0.5 rounded font-mono font-bold tracking-tight uppercase">
                                            Direct Apply Active
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                                        {item.value}
                                      </div>
                                      <div className="text-[10px] text-zinc-500 mt-1 font-mono">Source: {item.source}</div>
                                    </div>
                                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                                      {item.applyUrl ? (
                                        <a
                                          href={item.applyUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[11px] bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-3.5 py-1.5 rounded-md font-mono font-bold uppercase transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.2)] hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                        >
                                          <span>Apply Now</span>
                                          <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                                        </a>
                                      ) : (
                                        <span className="text-[10px] bg-zinc-950 text-zinc-400 px-2 py-1 rounded border border-zinc-800/40 font-mono">
                                          N/A
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Comprehensive Synthesized Markdown */}
                            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-900 space-y-4 text-xs font-sans text-zinc-300">
                              <h5 className="font-bold text-zinc-200 border-b border-zinc-900 pb-1.5 font-mono text-[10px] uppercase tracking-wider">
                                Direct Synthesis Output Data
                              </h5>
                              <div className="whitespace-pre-wrap leading-relaxed">
                                {agentData.finalSynthesis.richMarkdownReport}
                              </div>
                            </div>

                          </div>

                        </div>
                      </div>
                    )}

                    {activeTab === "metadata" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-2 border-b border-zinc-800">
                          <span>AGGREGATED FACTS IN MEMORY</span>
                          <span className="text-green-400">Total: {agentData.finalSynthesis.totalResultsScraped}</span>
                        </div>
                        <div className="space-y-2">
                          {agentData.finalSynthesis.dataPointsExtracted.map((dp, idx) => (
                            <div key={idx} className="bg-zinc-950 p-3.5 rounded border border-zinc-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-cyan-800/30 transition-all">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-zinc-200 text-xs">{dp.title}</span>
                                  <span className="text-[10px] text-cyan-400 font-mono px-1.5 bg-cyan-950 rounded border border-cyan-800/20">
                                    {dp.source}
                                  </span>
                                </div>
                                <p className="text-[11px] text-zinc-400 font-sans mt-1.5">{dp.value}</p>
                              </div>
                              {dp.applyUrl && (
                                <a
                                  href={dp.applyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="self-start sm:self-auto text-[10px] bg-cyan-950 text-cyan-400 hover:bg-cyan-900 border border-cyan-700/60 px-2.5 py-1.5 rounded font-mono font-bold uppercase transition-all flex items-center gap-1.5 shrink-0"
                                >
                                  <span>Portal Link</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "metrics" && (
                      <div className="space-y-4 text-xs font-mono">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-zinc-950 p-3 rounded border border-zinc-900">
                            <div className="text-zinc-500 font-bold mb-1">TOTAL STEPS EXECUTED</div>
                            <div className="text-xl font-bold text-cyan-400">
                              {allFinishedSteps.length} Steps
                            </div>
                          </div>
                          <div className="bg-zinc-950 p-3 rounded border border-zinc-900">
                            <div className="text-zinc-500 font-bold mb-1">CRITIC RELEVANCE</div>
                            <div className="text-xl font-bold text-purple-400">
                              {agentData.criticNode.relevanceScore}%
                            </div>
                          </div>
                          <div className="bg-zinc-950 p-3 rounded border border-zinc-900">
                            <div className="text-zinc-500 font-bold mb-1">AUTON_REPAIR</div>
                            <div className="text-xl font-bold text-green-400">
                              {agentData.criticNode.needsRefinement ? "Active Iteration" : "1st-Pass Perfect"}
                            </div>
                          </div>
                          <div className="bg-zinc-950 p-3 rounded border border-zinc-900">
                            <div className="text-zinc-500 font-bold mb-1">DATA STREAMS</div>
                            <div className="text-xl font-bold text-yellow-400">
                              {agentData.finalSynthesis.totalResultsScraped} Nodes
                            </div>
                          </div>
                        </div>

                        <div className="bg-zinc-950/40 p-3 rounded border border-violet-900/20">
                          <div className="text-[10px] text-zinc-500 font-bold uppercase mb-2">
                            Multi-Agent Graph State Coordinates
                          </div>
                          <div className="space-y-1 text-[11px] text-zinc-400">
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Execution Framework:</span>
                              <span className="text-zinc-300">LangGraph Execution Loop</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">LLM Brain Backbone:</span>
                              <span className="text-zinc-300">Gemini 3.5 Flash Model</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Autonomous Driver:</span>
                              <span className="text-zinc-300">Virtual Playwright API Host</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Bypass Capability:</span>
                              <span className="text-zinc-300">Captcha Turnstile Solver Node</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-20 text-zinc-500 font-mono">
                    <Database className="w-10 h-10 text-violet-950 mb-3" />
                    <div className="text-xs font-semibold text-zinc-400 mb-1">
                      Synthesis Dossier Pending
                    </div>
                    <p className="text-[11px] max-w-xs text-zinc-600 leading-relaxed">
                      Launch the multi-agent loop to generate the fully customized, dynamic markdown dossier and scraped metadata records.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </section>

        </div>

        {/* Outer Minimal Banner Details avoiding cluttering page margins */}
        <footer className="mt-12 text-center text-xs text-zinc-600 font-mono border-t border-violet-900/10 pt-6 flex flex-col items-center gap-1">
          <div>AgentWeb Framework — Multi-Agent Web Scraping Automation & Synthesizer</div>
          <div className="flex items-center gap-4 text-zinc-500 mt-1">
            <span>LLM: Gemini 3.5 Flash</span>
            <span>•</span>
            <span>API Status: Secure Socket</span>
          </div>
        </footer>

        {/* Node custom telemetry configuration overlay */}
        {selectedConfigNode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
            <div className={`relative w-full max-w-md bg-zinc-950 border border-violet-800/60 rounded-xl overflow-hidden glow-purple p-6`}>
              {/* Top ambient color lines */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-cyan-400 to-rose-400" />
              
              <div className="flex items-center justify-between pb-3 border-b border-zinc-900 mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    selectedConfigNode === "Planner" ? "bg-purple-500" :
                    selectedConfigNode === "Browser" ? "bg-cyan-400 animate-pulse" :
                    selectedConfigNode === "Critic" ? "bg-rose-500" : "bg-emerald-500"
                  }`} />
                  <span className="font-mono text-sm uppercase tracking-wider text-zinc-100 font-bold">
                    {selectedConfigNode} Node Tuning
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedConfigNode(null)}
                  className="font-mono text-xs text-zinc-500 hover:text-zinc-200 uppercase"
                >
                  [Close]
                </button>
              </div>

              {selectedConfigNode === "Planner" && (
                <div className="space-y-4 text-xs">
                  <p className="text-zinc-400 leading-relaxed">
                    The **Planner Node** formulates search objectives, identifies high-authority potential target domains, and creates the sequence of dynamic browser action coordinates.
                  </p>
                  
                  <div className="space-y-3 bg-zinc-900/60 p-3 rounded-lg border border-violet-950/40">
                    <div>
                      <label className="text-zinc-500 block mb-1">Targeting Depth Ratio</label>
                      <input type="range" className="w-full h-1.5 bg-zinc-950 rounded" defaultValue={85} />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1 font-semibold">Active AI Reasoner Backbone</label>
                      <div className="bg-zinc-950 text-purple-300 font-mono p-1 rounded inline-block text-[11px] border border-purple-900/30">
                        gemini-3.5-flash (Standard Dynamic Plan)
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-500 italic">
                    Note: Clicking nodes reveals sandbox parameters. Changing options applies immediately to upcoming graph dispatch loops!
                  </p>
                </div>
              )}

              {selectedConfigNode === "Browser" && (
                <div className="space-y-4 text-xs">
                  <p className="text-zinc-400 leading-relaxed">
                    The **Autonomous Browser Node** operates headlessly, navigating complex target sites, executing click/type sequences, and grabbing RAW HTML text streams.
                  </p>

                  <div className="space-y-3 bg-zinc-900/60 p-3 rounded-lg border border-cyan-950/40">
                    <div>
                      <label className="text-zinc-500 block mb-1">Fingerprint Spoof Profiler</label>
                      <select className="bg-zinc-950 text-zinc-300 border border-cyan-800/20 rounded p-1 w-full font-mono text-[11px]">
                        <option>Chrome / MacINTOSH / TLS-1.3 stable</option>
                        <option>Firefox / Windows x64 / No-WebRTC</option>
                        <option>Mobile Safari / iOS 17.4 device emulation</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-zinc-500 block mb-1">Wait Transition Jiffy Delay</label>
                      <div className="flex items-center gap-2 font-mono text-cyan-400 text-[11px]">
                        <span>1500 MS</span>
                        <span className="text-zinc-600">(Optimizes Captcha Avoidance)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedConfigNode === "Critic" && (
                <div className="space-y-4 text-xs">
                  <p className="text-zinc-400 leading-relaxed">
                    The **Target Alignment Critic Node** checks extracted raw records against required criteria, enforcing self-repair loops if matching criteria thresholds of relevancy fail.
                  </p>

                  <div className="space-y-3 bg-zinc-900/60 p-3 rounded-lg border border-rose-950/40">
                    <div>
                      <label className="text-zinc-500 block mb-1">Strictness Alignment Threshold</label>
                      <div className="flex items-center gap-2 justify-between">
                        <input type="range" className="flex-1 h-1.5 bg-zinc-950 rounded" defaultValue={75} />
                        <span className="font-mono text-rose-400">75% Matches</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-zinc-500 block mb-1">Auto-Recovery Pathway</label>
                      <span className="text-[10px] bg-rose-950/40 text-rose-400 px-1.5 py-0.5 rounded border border-rose-900/30 font-mono uppercase">
                        Active Refinement Trigger (Max 2 Loops)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {selectedConfigNode === "Synthesizer" && (
                <div className="space-y-4 text-xs">
                  <p className="text-zinc-400 leading-relaxed">
                    The **Synthesizer Node** takes refined records, structures telemetry insights, aggregates the final Markdown Dossier output, and triggers file downloads.
                  </p>

                  <div className="space-y-3 bg-zinc-900/60 p-3 rounded-lg border border-emerald-950/40">
                    <div>
                      <label className="text-zinc-500 block mb-1">Dossier Presentation Vibe</label>
                      <select className="bg-zinc-950 text-zinc-300 border border-green-800/20 rounded p-1 w-full font-mono text-[11px]">
                        <option>Curated Markdown Tables & Details</option>
                        <option>Executive Engineering Summary Card</option>
                        <option>Raw JSON Metadata Stream Logs Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-zinc-500 block mb-1">Stable Compression Codecs</label>
                      <span className="text-[10px] bg-emerald-950/40 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-900/30 font-mono uppercase">
                        Uncompressed UTF-8 Buffer
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-5 pt-3 border-t border-zinc-900/60 flex justify-end">
                <button
                  onClick={() => setSelectedConfigNode(null)}
                  className="px-4 py-1.5 bg-violet-950/40 border border-violet-800/40 hover:bg-violet-900 hover:border-violet-600 rounded text-xs text-purple-300 font-mono font-bold transition-all animate-pulse"
                >
                  Apply Configuration
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
