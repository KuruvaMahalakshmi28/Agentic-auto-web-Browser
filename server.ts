import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to get Gemini client or throw
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Fallback high-fidelity structured generation when API Key is missing or default
function generateFallbackSimulation(query: string) {
  const sanitizedQuery = query.trim() || "software engineering internships";
  
  // Custom parsing to make fallback look smart and dynamic
  const hasHyderabad = sanitizedQuery.toLowerCase().includes("hyderabad");
  const hasInternship = sanitizedQuery.toLowerCase().includes("internship");
  const location = hasHyderabad ? "Hyderabad, India" : "Global/Remote";
  const roleType = hasInternship ? "Software Engineering Intern" : "Software Engineer / Web Developer";

  return {
    summary: `Simulated Multi-Agent execution for: "${sanitizedQuery}". Evaluated search graph across high-relevance professional career sources in ${location}.`,
    plannerNode: {
      objectives: [
        `Identify companies offering ${roleType} positions in ${location}.`,
        `Scrape job requisitions, application details, and key requirements.`,
        `Cross-reference application links and dead deadlines.`
      ],
      targetSources: [
        "https://linkedin.com/jobs",
        "https://indeed.com/jobs",
        "https://glassdoor.com/jobs"
      ],
      vulnerabilityAnalysis: "Anti-bot CAPTCHAs likely on LinkedIn and Glassdoor. Employing delayed scroll playbacks, User-Agent randomization, and cloud proxies."
    },
    browserSteps: [
      {
        stepNumber: 1,
        action: "NAVIGATE",
        url: "https://linkedin.com/jobs/search?keywords=Software%20Engineering%20Intern&location=" + encodeURIComponent(location),
        status: "SUCCESS",
        description: `Navigate to LinkedIn job postings for ${roleType} in ${location}.`,
        playwrightCode: `await page.goto("https://linkedin.com/jobs/search?keywords=Software+Engineering+Intern");\nawait page.waitForLoadState("networkidle");`,
        extractedData: `Found initial search container. Extraction summary:\n- Google SWE Intern (Hyderabad) - Applications open.\n- Microsoft SDE Intern (Hyderabad) - Remote-hybrid options.\n- ServiceNow Software QA Intern - 2026 Batch.`
      },
      {
        stepNumber: 2,
        action: "CLICK_ELEMENT",
        url: "https://linkedin.com/jobs",
        status: "CAPTCHA_DETECTED",
        description: "Clicking third job listing detail pane triggers custom challenge overlay.",
        playwrightCode: `await page.click(".job-search-card:nth-child(3)");\nawait page.waitForTimeout(1500);`,
        extractedData: "Blocked by Cloudflare Turnstile challenge. Initializing automated Solver node."
      },
      {
        stepNumber: 3,
        action: "EXTRACT_DATA",
        url: "https://linkedin.com/jobs",
        status: "SUCCESS",
        description: "Solves captcha challenge successfully inside sandbox frame and continues scraping.",
        playwrightCode: `await page.solveRecaptcha();\nconst content = await page.textContent(".jobs-search-results");`,
        extractedData: `Successfully bypassed cookie wall wrapper. Scraped metadata details for 5 additional high-priority careers.`
      },
      {
        stepNumber: 4,
        action: "NAVIGATE",
        url: "https://indeed.com/jobs?q=software+engineering+intern&l=" + encodeURIComponent(location),
        status: "SUCCESS",
        description: "Navigate to Indeed jobs index page to aggregate broader dataset.",
        playwrightCode: `await page.goto("https://indeed.com/jobs?q=software+engineering+intern");\nconst listings = await page.$$eval(".job_seen_beacon", el => el.map(x => x.innerText));`,
        extractedData: `Retrieved listings for:\n- Oracle Member of Technical Staff Intern\n- Qualcomm Software Development Engineering Intern\n- AMD Firmware Engineering Intern (Hyderabad HQ)`
      }
    ],
    criticNode: {
      relevanceScore: 94,
      critiquePoints: [
        "Identified 8 qualified positions with explicit application details.",
        "Good alignment with Hyderabad local coordinates.",
        "Missing recruiter contacts and specific start/end date details for Google and Microsoft listings."
      ],
      needsRefinement: true,
      refinementInstructions: "Re-route to Planner Node. Target company directory contact search or Glassdoor reviews for estimated start dates."
    },
    refinedPlannerNode: {
      newObjectives: [
        "Locate specific employee feedback and start date patterns on Glassdoor.",
        "Search Google search index index directories for recruiter contacts."
      ],
      adjustedSources: [
        "https://glassdoor.com/Reviews",
        "https://google.com/search"
      ]
    },
    refinedBrowserSteps: [
      {
        stepNumber: 5,
        action: "NAVIGATE",
        url: "https://google.com/search?q=microsoft+software+engineering+internship+recruiter+hyderabad+linkedin",
        status: "SUCCESS",
        description: "Executing search directive for specific professional connections.",
        playwrightCode: `await page.goto("https://google.com/search?q=microsoft+internship+recruiter");\nconst resultText = await page.locator("#search").innerText();`,
        extractedData: "Extracted 2 potential talent-acquisition coordinates and LinkedIn profile pathways."
      },
      {
        stepNumber: 6,
        action: "EXTRACT_DATA",
        url: "https://glassdoor.com/Reviews",
        status: "SUCCESS",
        description: "Scraping employee reviews regarding Internship interview timelines in Southern India clusters.",
        playwrightCode: `await page.goto("https://glassdoor.com/Reviews");\nconst salaryData = await page.$$eval(".salary-row", rows => rows.slice(0,2).map(r => r.innerText));`,
        extractedData: "Average SWE Intern salary reported: ₹45,000 - ₹80,000/month. Standard application cycles start October-December."
      }
    ],
    finalSynthesis: {
      totalResultsScraped: 10,
      dataPointsExtracted: [
        { 
          title: "Microsoft SWE Internship", 
          source: "LinkedIn", 
          value: "Hybrid/Hyderabad, 3 months, High priority", 
          applyUrl: "https://careers.microsoft.com/us/en/search-results?keywords=Software%20Engineering%20Intern" 
        },
        { 
          title: "Google Engineering Intern", 
          source: "Direct Career Portal", 
          value: "Office/Hyderabad, Tier 1 prestige", 
          applyUrl: "https://www.google.com/about/careers/applications/jobs/results/?q=Software%20Engineering%20Intern" 
        },
        { 
          title: "Qualcomm SWE Intern", 
          source: "Indeed", 
          value: "Hardware/Software integrated teams", 
          applyUrl: "https://qualcomm.wd5.myworkdayjobs.com/External" 
        },
        { 
          title: "Oracle MTS Intern", 
          source: "Indeed", 
          value: "Cloud native database operations", 
          applyUrl: "https://oracle.ae.jobs/" 
        },
        { 
          title: "AMD Firmware Engineering", 
          source: "Direct", 
          value: "GPU/CPU design cycles", 
          applyUrl: "https://careers.amd.com/careers" 
        }
      ],
      richMarkdownReport: `# Research Dossier: ${sanitizedQuery}\n\n**Framework Engine Status**: ✅ SUCCESS\n**Location Focus**: ${location}\n**Total Structured Records**: 10 Positions Aggregated\n\n### Primary Opportunities Discovered\n\nHere are the top-tier internship openings parsed from LinkedIn and Indeed:\n\n| Opportunity Title | Source Platform | Key Attributes / Details |\n| :--- | :--- | :--- |\n| **Google SWE Intern** | LinkedIn / Direct | Office at Hyderabad. Focuses on full-stack production systems. Strict algorithmic coding rounds. |\n| **Microsoft Engineering Intern** | LinkedIn | Cloud Engineering with Azure groups. Great culture reports and high Return-Offer rate (90%+). |\n| **Qualcomm SWE Intern** | Indeed | Embedded platforms, device drivers, and core digital verification loops. Excellent office facility. |\n| **Oracle MTS Intern** | Indeed | High cloud architecture components. Base salary metrics approx. ₹60,000/mo. |\n| **AMD Firmware Intern** | Direct Portal | System-level C/C++ micro-architectures. Located in Hyderabad HITEC City. |\n\n### Multi-Agent Strategy Logs\n- **Planner Agent**: Analyzed query parameters, configured anti-detection configurations.\n- **Browser Executor (Playwright API)**: Completed 6 state transitions, successfully bypassed 1 automated scraping anti-bot challenge page via custom cookie-session injector.\n- **Evaluator Critic**: Approved final synthesis on Iteration 2 after validating regional coordinates.\n\n### Strategic Action Items\n1. **Tailor Resume**: Emphasize System Design and Data Structures (ideal for Google/Microsoft tracks).\n2. **Target Reaching**: Utilize the recruiter channels found on LinkedIn to bypass initial ATS queues.\n3. **Application Window**: Aim to submit within 48 hours as standard technical pools expire rapidly.`
    }
  };
}

// Full-stack dynamic agentic loop endpoint
app.post("/api/agentic-loop", async (req, res) => {
  const { query, options } = req.body;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'query' parameter" });
  }

  const ai = getGeminiClient();
  if (!ai) {
    // API key is not configured or placeholder - stream/render high quality mock
    console.info("Gemini API key not configured or default. Running fallback generator.");
    return res.json({
      success: true,
      apiOnline: false,
      data: generateFallbackSimulation(query)
    });
  }

  try {
    const prompt = `You are the backend brain of the "AgentWeb Framework", an advanced multi-agent web research simulation workspace.
The user has requested research on: "${query}".

Analyze this query and construct a detailed, custom, and highly authentic Multi-Agent simulation execution trace.
Generate a response in JSON format. Provide specific details, companies, URLs, and technologies that fit the exact intent of the query.

Use the following JSON schema:
{
  "summary": "String briefly summarizing the overall path",
  "plannerNode": {
    "objectives": ["String - planned objectives matching query"],
    "targetSources": ["URLs or sources to target"],
    "vulnerabilityAnalysis": "Potential challenges like anti-bot blocker or sign-in wall"
  },
  "browserSteps": [
    {
      "stepNumber": 1,
      "action": "NAVIGATE | FILL_FORM | CLICK_ELEMENT | EXTRACT_DATA | RENDER_SCREENSHOT",
      "url": "Simulated realistic URL target",
      "status": "SUCCESS | CAPTCHA_DETECTED | SOLVED | FAILURE",
      "description": "Short explanation of search queries or selectors executed",
      "playwrightCode": "Clean mock Playwright JS code statement representing this action",
      "extractedData": "Brief mock raw content string found during this step"
    }
  ],
  "criticNode": {
    "relevanceScore": 85, // 0 - 100
    "critiquePoints": ["Critique points on relevance, completeness, etc."],
    "needsRefinement": true, // whether a second iteration was forced
    "refinementInstructions": "What to do next"
  },
  "refinedPlannerNode": { // ONLY include if criticNode.needsRefinement is true
    "newObjectives": ["String - next-stage objectives"],
    "adjustedSources": ["adjusted sources"]
  },
  "refinedBrowserSteps": [ // ONLY include if criticNode.needsRefinement is true
    {
      "stepNumber": 5,
      "action": "NAVIGATE | FILL_FORM | CLICK_ELEMENT | EXTRACT_DATA | RENDER_SCREENSHOT",
      "url": "Simulated revised URL target",
      "status": "SUCCESS",
      "description": "Short explanation of refined task",
      "playwrightCode": "Clean mock Playwright code",
      "extractedData": "Scraped data or reviews matched to refined task"
    }
  ],
  "finalSynthesis": {
    "totalResultsScraped": 12,
    "dataPointsExtracted": [
      { 
        "title": "Job Title or Fact description", 
        "source": "LinkedIn or website", 
        "value": "Key highlight value",
        "applyUrl": "Direct realistic application link URL (e.g. Google Careers, Microsoft Careers, LinkedIn Easy Apply, etc. based on the target company)"
      }
    ],
    "richMarkdownReport": "A stunning, beautifully stylized markdown report, with headers, summaries, tabular charts comparing findings, bullet points, and strategic action plans. Ensure it includes the real direct apply URLs in the table rows or bullet descriptions so users can directly apply. Format cleanly."
  }
}

Customize the response specifically to "${query}". Make sure all Playwright code looks real and matches modern JS/TS patterns. Use realistic URLs.
Be extremely creative, intelligent, and highly relevant.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
      }
    });

    const parsedData = JSON.parse(response.text?.trim() || "{}");
    return res.json({
      success: true,
      apiOnline: true,
      data: parsedData
    });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    // Graceful recovery via fallback generator
    return res.json({
      success: true,
      apiOnline: false,
      error: error.message,
      data: generateFallbackSimulation(query)
    });
  }
});

// Configure Vite or production serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Mount Vite dev server middleware
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
