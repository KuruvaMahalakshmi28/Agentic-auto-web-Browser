export interface AgentOptions {
  maxDepth: number;
  selfCorrection: "Off" | "Medium" | "High";
  browserMode: "headless" | "headed";
  searchProviders: string[];
}

export interface BrowserStep {
  stepNumber: number;
  action: "NAVIGATE" | "FILL_FORM" | "CLICK_ELEMENT" | "EXTRACT_DATA" | "RENDER_SCREENSHOT";
  url: string;
  status: "SUCCESS" | "CAPTCHA_DETECTED" | "SOLVED" | "FAILURE";
  description: string;
  playwrightCode: string;
  extractedData: string;
}

export interface PlannerNodeData {
  objectives: string[];
  targetSources: string[];
  vulnerabilityAnalysis: string;
}

export interface CriticNodeData {
  relevanceScore: number;
  critiquePoints: string[];
  needsRefinement: boolean;
  refinementInstructions: string;
}

export interface FinalSynthesis {
  totalResultsScraped: number;
  dataPointsExtracted: { title: string; source: string; value: string; applyUrl?: string }[];
  richMarkdownReport: string;
}

export interface AgenticLoopResponse {
  summary: string;
  plannerNode: PlannerNodeData;
  browserSteps: BrowserStep[];
  criticNode: CriticNodeData;
  refinedPlannerNode?: {
    newObjectives: string[];
    adjustedSources: string[];
  };
  refinedBrowserSteps?: BrowserStep[];
  finalSynthesis: FinalSynthesis;
}

// Frontend step representation for simulation timing
export interface TerminalLog {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "code" | "system";
  node: "Planner" | "Browser" | "Critic" | "System" | "Synthesizer";
}
