import React, { useState } from "react";
import { BrowserStep } from "../types";
import { Play, Copy, Check, Terminal, Globe, Code, FileText, Smartphone, Laptop, Sparkles, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";

interface PlaywrightTerminalProps {
  currentStep: BrowserStep | null;
  allSteps: BrowserStep[];
  activeStepIndex: number;
}

export default function PlaywrightTerminal({
  currentStep,
  allSteps,
  activeStepIndex,
}: PlaywrightTerminalProps) {
  const [activeTab, setActiveTab] = useState<"viewport" | "code" | "data">("viewport");
  const [copied, setCopied] = useState(false);
  const [sliderVal, setSliderVal] = useState(12);
  const [captchaSolved, setCaptchaSolved] = useState(false);
  const [isSolving, setIsSolving] = useState(false);

  React.useEffect(() => {
    if (allSteps.length === 0 || activeStepIndex === -1) {
      setCaptchaSolved(false);
      setSliderVal(12);
      setIsSolving(false);
    }
  }, [allSteps, activeStepIndex]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeAutoBypass = () => {
    setIsSolving(true);
    setTimeout(() => {
      setSliderVal(88);
      setIsSolving(false);
      setCaptchaSolved(true);
    }, 1800);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSliderVal(val);
    if (val >= 85 && val <= 92) {
      setCaptchaSolved(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950/90 rounded-xl border border-cyan-900/40 glow-cyan overflow-hidden" id="playwright-terminal">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-cyan-950/60 bg-zinc-900/40">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-semibold tracking-wide text-zinc-300">
            Autonomous Browser Execution Node (Playwright Engine)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
      </div>

      {/* Control Tabs */}
      <div className="flex items-center justify-between bg-zinc-900/20 border-b border-cyan-950/40 px-2">
        <div className="flex gap-1 py-1.5">
          <button
            onClick={() => setActiveTab("viewport")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-xs transition-all ${
              activeTab === "viewport"
                ? "bg-cyan-950/80 text-cyan-400 border border-cyan-500/30"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Interactive Viewport</span>
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-xs transition-all ${
              activeTab === "code"
                ? "bg-cyan-950/80 text-cyan-400 border border-cyan-500/30"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Playwright Script</span>
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-xs transition-all relative ${
              activeTab === "data"
                ? "bg-cyan-950/80 text-cyan-400 border border-cyan-500/30"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Scraped Metadata</span>
            {currentStep?.extractedData && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
            )}
          </button>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] font-mono pr-2">
          {currentStep && (
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Status:</span>
              <span className={`font-semibold uppercase tracking-wider ${
                currentStep.status === "SUCCESS" ? "text-green-400" :
                currentStep.status === "CAPTCHA_DETECTED" ? "text-rose-400 pulsing-glow" :
                currentStep.status === "SOLVED" ? "text-cyan-400" : "text-amber-400"
              }`}>
                {currentStep.status}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Panel Content Area */}
      <div className="flex-1 min-h-[340px] flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-cyan-950/40">
        
        {/* Left Side: Simulation Step list */}
        <div className="w-full md:w-1/3 bg-zinc-950/40 p-4 overflow-y-auto max-h-[350px] md:max-h-none flex flex-col gap-2 custom-scrollbar">
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider pb-1.5 border-b border-cyan-950/30 mb-2">
            Execution Steps List ({allSteps.length})
          </div>
          {allSteps.length === 0 ? (
            <div className="text-zinc-600 font-mono text-xs text-center py-10">
              No steps loaded. Enter directive to start scraping.
            </div>
          ) : (
            allSteps.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              const isPast = idx < activeStepIndex;
              return (
                <div
                  key={step.stepNumber}
                  className={`p-2.5 rounded-lg border transition-all ${
                    isActive
                      ? "bg-cyan-950/40 border-cyan-500/60 glow-cyan"
                      : isPast
                      ? "bg-zinc-900/40 border-zinc-900/60 text-zinc-400"
                      : "bg-zinc-950/20 border-zinc-950/30 text-zinc-600 select-none"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-cyan-500">
                      Step {step.stepNumber}: {step.action}
                    </span>
                    <span className={`text-[9px] font-mono px-1 rounded-sm ${
                      step.status === "SUCCESS" ? "bg-green-950 text-green-400 border border-green-800/30" :
                      step.status === "CAPTCHA_DETECTED" ? "bg-rose-950 text-rose-400 border border-rose-800/30 font-bold pulsing-glow" :
                      "bg-zinc-900 text-zinc-400 border border-zinc-800"
                    }`}>
                      {step.status}
                    </span>
                  </div>
                  <p className="text-xs line-clamp-2 select-text">{step.description}</p>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Tab panel view */}
        <div className="flex-1 p-4 bg-zinc-950/60 flex flex-col h-full min-h-[250px]">
          {currentStep ? (
            <>
              {/* Simulated Browser Bar */}
              <div className="flex items-center gap-2 bg-zinc-900 border border-cyan-950/30 rounded-lg py-1.5 px-3 mb-3 shrink-0">
                <Laptop className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <div className="flex-1 bg-zinc-950 rounded border border-zinc-800/60 px-2 py-0.5 text-[11px] font-mono text-cyan-300 truncate tracking-wide select-all">
                  {currentStep.url}
                </div>
                {currentStep.status === "CAPTCHA_DETECTED" && (
                  <span className="flex items-center gap-1 text-[10px] text-rose-400 tracking-tight font-semibold pulsing-glow bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-500/20">
                    <Sparkles className="w-2.5 h-2.5 text-rose-400" />
                    WAF BLOCKED
                  </span>
                )}
              </div>

              {/* Tab Outputs */}
              <div className="flex-1 bg-zinc-950/90 rounded-lg p-3 border border-cyan-950/30 overflow-y-auto max-h-[300px] md:max-h-none flex flex-col custom-scrollbar">
                
                {activeTab === "viewport" && (
                  <div className="flex-1 flex flex-col text-xs text-zinc-300">
                    {/* Simulated Webpage Interface */}
                    <div className="border border-zinc-800/40 rounded bg-zinc-900/60 p-3 h-full flex flex-col">
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/30 mb-2">
                        <div className="font-mono text-[10px] text-zinc-500">ROOT DOM DOCUMENT VIEWER</div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulsing-glow" />
                          <span className="text-[9px] font-mono text-cyan-400">PLAYWRIGHT ENGINE VIRTUAL FRAME</span>
                        </div>
                      </div>

                      {currentStep.status === "CAPTCHA_DETECTED" ? (
                        <div className="flex-1 flex flex-col justify-center py-4 text-center">
                          {!captchaSolved ? (
                            <div className="space-y-4">
                              <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-rose-950/60 border border-rose-500/40 flex items-center justify-center mb-2 text-rose-400 pulsing-glow">
                                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                                </div>
                                <div className="font-mono text-xs font-bold text-rose-400 uppercase tracking-wide">
                                  CAPTCHA Wall Triggered
                                </div>
                                <p className="text-zinc-400 max-w-xs text-[10px] my-1 leading-relaxed">
                                  Target host is protecting listing layouts. Drag slider to fit the key inside safe target sector (85% - 92%) to bypass.
                                </p>
                              </div>

                              {/* Interactive Slide Puzzle Game */}
                              <div className="bg-zinc-950/90 border border-zinc-800/80 rounded-lg p-4 max-w-sm mx-auto relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500/30 via-cyan-400/30 to-green-500/30" />
                                
                                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-2">
                                  <span>POSITION: {sliderVal}%</span>
                                  <span className="text-cyan-400">TARGET: 88% (+/- 3%)</span>
                                </div>

                                {/* Slider Track */}
                                <div className="relative h-12 bg-zinc-900 border border-zinc-800 rounded-md mb-3 flex items-center px-1">
                                  {/* Target sector highlight */}
                                  <div 
                                    className="absolute top-0 bottom-0 bg-emerald-500/20 border-l border-r border-emerald-400/40"
                                    style={{ left: "85%", right: "8%" }}
                                  />
                                  <div className="absolute left-[88%] top-0 bottom-0 flex items-center pointer-events-none">
                                    <div className="h-full w-0.5 bg-emerald-400 opacity-60" />
                                  </div>

                                  {/* Draggable slider handle */}
                                  <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={sliderVal}
                                    onChange={handleSliderChange}
                                    disabled={isSolving}
                                    className="w-full h-8 opacity-90 cursor-pointer accent-cyan-400 focus:outline-none"
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={executeAutoBypass}
                                    disabled={isSolving}
                                    className="flex-1 py-1.5 px-3 rounded bg-cyan-950/40 border border-cyan-800/40 text-cyan-400 hover:bg-cyan-950 hover:border-cyan-500 text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5"
                                  >
                                    {isSolving ? (
                                      <>
                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                        <span>Solving token...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Sparkles className="w-3 h-3" />
                                        <span>Auto-Solve Bypass</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-6 animate-fade-in">
                              <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center mb-3 text-emerald-400 animate-bounce">
                                <CheckCircle className="w-6 h-6 text-emerald-400" />
                              </div>
                              <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest">
                                BYPASS INJECTED SUCCESSFULLY
                              </div>
                              <p className="text-zinc-400 max-w-xs text-[11px] mt-1.5 leading-relaxed">
                                Client TLS fingerprint optimized. Verification cookies mutated successfully. Resuming active data acquisition feeds...
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex-1 font-sans">
                          <h4 className="font-semibold text-zinc-200 flex items-center gap-1 mb-2">
                            <span className="w-1 h-3 bg-cyan-500 rounded-full" />
                            Rendered Scraping Findings
                          </h4>
                          <div className="space-y-2">
                            {currentStep.extractedData ? (
                              <div className="bg-zinc-950/80 p-3 rounded font-mono text-[11px] border border-cyan-950/20 text-zinc-400 whitespace-pre-line leading-relaxed">
                                {currentStep.extractedData}
                              </div>
                            ) : (
                              <div className="text-zinc-500 italic py-4 text-center">
                                Initializing search context... Fetching dynamic parameters.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "code" && (
                  <div className="flex-1 flex flex-col relative">
                    <button
                      onClick={() => handleCopyCode(currentStep.playwrightCode)}
                      className="absolute top-1 right-1 p-1 bg-zinc-900 border border-cyan-900/30 rounded text-zinc-300 hover:text-cyan-400 hover:bg-cyan-950 transition-all"
                      title="Copy code"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <pre className="font-mono text-[10px] text-cyan-400 leading-relaxed bg-zinc-950 p-3 rounded overflow-x-auto select-all h-full">
                      <code>{currentStep.playwrightCode}</code>
                    </pre>
                  </div>
                )}

                {activeTab === "data" && (
                  <div className="flex-1 flex flex-col">
                    <div className="text-xs text-zinc-400 mb-2 font-mono uppercase tracking-wider text-cyan-500">
                      Scrape Data Buffers (JSON Payload Snapshot)
                    </div>
                    <pre className="font-mono text-[10px] text-zinc-400 bg-zinc-950 p-3 rounded h-full overflow-x-auto whitespace-pre-wrap select-all border border-cyan-900/10">
                      {JSON.stringify({
                        step: currentStep.stepNumber,
                        url: currentStep.url,
                        extracted_record_text: currentStep.extractedData,
                        scraping_timestamp: new Date().toISOString(),
                      }, null, 2)}
                    </pre>
                  </div>
                )}

              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-500 font-mono">
              <Globe className="w-10 h-10 text-cyan-950 mb-3" />
              <div className="text-xs font-semibold text-zinc-400 mb-1">Interactive Sandbox Idle</div>
              <p className="text-[11px] max-w-sm text-zinc-600">
                Playwright viewport triggers dynamically once you input software research objectives and activate the agent pipeline.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
