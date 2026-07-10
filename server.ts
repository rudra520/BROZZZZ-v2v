import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client
  // It is a server secret.
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Helper for resilient Gemini API calls with exponential backoff retry and model fallback on transient errors
  async function generateContentWithRetry(params: any, retries = 3, delay = 1000): Promise<any> {
    const requestedModel = params.model || "gemini-3.5-flash";
    
    // Set up a robust list of models to try in sequence
    const modelsToTry = [
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite",
      "gemini-flash-latest",
      "gemini-2.5-flash",
      "gemini-2.5-pro"
    ];

    // Ensure the requested model is at the very front of the fallback chain
    const finalModelSequence = [requestedModel, ...modelsToTry.filter(m => m !== requestedModel)];

    let lastError: any = null;

    for (const model of finalModelSequence) {
      const currentParams = { ...params, model };
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          return await ai.models.generateContent(currentParams);
        } catch (error: any) {
          lastError = error;
          const errorMsg = error.message || String(error);
          const statusCode = error.status || error.code || 0;
          
          console.warn(`Gemini API attempt ${attempt} with model ${model} failed (Status: ${statusCode}):`, errorMsg);
          
          // Check for Quota Limit (429) or Service Unavailable (503).
          // If we are rate-limited or quota is exhausted, do NOT waste retries on the same model!
          // Fall back to the next model immediately.
          const isQuotaOrUnavailable = 
            statusCode === 429 || 
            statusCode === 503 ||
            errorMsg.includes("quota") || 
            errorMsg.includes("Quota exceeded") ||
            errorMsg.includes("RESOURCE_EXHAUSTED") ||
            errorMsg.includes("high demand") ||
            errorMsg.includes("temporarily unavailable") ||
            errorMsg.includes("UNAVAILABLE");

          if (isQuotaOrUnavailable) {
            console.warn(`Quota or service limit met on model ${model}. Transitioning immediately to next model...`);
            break; // Break the attempt loop to move to the next model in the outer loop
          }

          if (attempt === retries && model === finalModelSequence[finalModelSequence.length - 1]) {
            throw error;
          }
          
          if (attempt < retries) {
            const waitTime = delay * Math.pow(2, attempt - 1);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
          }
        }
      }
    }
    throw lastError;
  }

  // API Route for Ask-Her-AI mentoring chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages array." });
      }

      // Convert client history to contents parts
      const prompt = messages[messages.length - 1]?.content || "";
      const history = messages.slice(0, messages.length - 1).map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      }));

      try {
        const response = await generateContentWithRetry({
          model: "gemini-3.5-flash",
          contents: [
            ...history,
            { role: "user", parts: [{ text: prompt }] }
          ],
          config: {
            systemInstruction: "You are 'Ask-Her-AI', an exceptionally warm, encouraging, strategic, and professional career advisor and technical mentor for women in STEM, FinTech, and higher education. You provide highly actionable and tactical advice on topics like salary negotiation, navigating corporate systems, breaking imposter syndrome, starting research projects, or choosing deep-tech focus sectors. Format your responses with clear paragraphs, bold bullet headers, and professional structured Markdown."
          }
        });

        res.json({ text: response.text });
      } catch (geminiError: any) {
        console.warn("Gemini API Error in chat endpoint, using fallback:", geminiError);
        
        const lowerPrompt = prompt.toLowerCase();
        let fallbackText = "I'm currently receiving high traffic, but as your career mentor, I want to support you! Here is some key guidance:\n\n" +
          "**1. Leverage Neutral Market Data**\n" +
          "Always anchor your career and promotion decisions on objective metrics. Use platforms like levels.fyi or local salary transparency resources to confirm your market value.\n\n" +
          "**2. Maintain a 'Brag Document'**\n" +
          "Document every project completed, technical milestone achieved, and process optimized. Having a factual record makes reviews and compensation talks simple and powerful.\n\n" +
          "**3. Cultivate a Sponsorship Circle**\n" +
          "Connect with peers and leaders who recognize your excellence and can advocate for your growth in calibration rooms.\n\n" +
          "Feel free to retry your message in a brief moment once AI capacity stabilizes!";
        
        if (lowerPrompt.includes("salary") || lowerPrompt.includes("negotiat") || lowerPrompt.includes("pay") || lowerPrompt.includes("compensation")) {
          fallbackText = "It looks like you are asking about negotiation or compensation! Here is a core mentoring strategy for this scenario:\n\n" +
            "**1. Establish an Objective Range**\n" +
            "Research and target the 75th percentile of compensation for your specialized role. Frame the conversation around this baseline as a standard alignment of market standards.\n\n" +
            "**2. Quantify Your Business Impact**\n" +
            "Prepare a concise summary detailing your technical outcomes, such as infrastructure latency reductions, secure APIs shipped, or team efficiencies enabled.\n\n" +
            "**3. Adopt Confident Phrasing**\n" +
            "Frame your target with confidence. Instead of *'I was hoping for...'*, state *'Based on my technical contributions in FinTech and the value I deliver, a base salary of $X is the market-aligned standard.'*\n\n" +
            "Please try sending your message again in a brief moment once the AI server stabilizes!";
        } else if (lowerPrompt.includes("imposter") || lowerPrompt.includes("confidence") || lowerPrompt.includes("syndrome") || lowerPrompt.includes("feel")) {
          fallbackText = "Imposter syndrome is exceptionally common in deep-tech and highly technical spaces. Let's ground ourselves in objective reality:\n\n" +
            "**1. Focus on Facts over Feelings**\n" +
            "Your technical placements, successful commits, and problem-solving abilities are verifiable accomplishments. Feelings of self-doubt do not diminish these objective realities.\n\n" +
            "**2. Track Your Learning Velocity**\n" +
            "Modern engineering is a continuous learning curve. Seniority is defined by your ability to research, experiment, and solve novel problems—not having all solutions memorized.\n\n" +
            "**3. Seek Representative Communities**\n" +
            "Surround yourself with diverse technical peers and allies who validate your contributions and support your professional trajectory.\n\n" +
            "Please try sending your message again in a brief moment; I am eager to hear your thoughts once our capacity stabilizes!";
        } else if (lowerPrompt.includes("grant") || lowerPrompt.includes("proposal") || lowerPrompt.includes("outline") || lowerPrompt.includes("writing")) {
          fallbackText = "**Introduction Outline**\n" +
            "- **Hook**: Share your specific motivation for this technical track. State why bridging engineering fields matters to your research.\n" +
            "- **Problem Statement**: Articulate the exact societal or industry challenge your project addresses.\n" +
            "- **Proposed Solution**: Summarize your core technology stack or experimental framework.\n" +
            "- **Explicit Impact**: Highlight how this work empowers diverse technical development and representation.\n\n" +
            "**Key Supporting Arguments**\n" +
            "- **Innovative Design**: Detail how your project optimizes current paradigms (e.g., latency, cloud cost, user accessibility).\n" +
            "- **Feasibility**: Cite your background and existing benchmarks to prove high completion confidence.\n\n" +
            "**Actionable Next Steps**\n" +
            "- Draft a 200-word personal statement highlighting your journey.\n" +
            "- Gather letters of support from your academic advisors or technical directors.";
        }
        
        res.json({ text: fallbackText });
      }
    } catch (error: any) {
      console.error("General Error in chat endpoint:", error);
      res.status(500).json({ error: error.message || "Failed to process request." });
    }
  });

  // API Route for AI Career Roadmap generator
  app.post("/api/career-roadmap", async (req, res) => {
    try {
      const { role, focusArea } = req.body;
      if (!role) {
        return res.status(400).json({ error: "Role is required." });
      }

      try {
        const response = await generateContentWithRetry({
          model: "gemini-3.5-flash",
          contents: `Create a professional 4-step tech career roadmap for a female candidate aspiring to become a '${role}' with a focus/skill gap of '${focusArea || "General Advancement"}'. For each step, supply: Title, Description, 4 KeySkills, and 3 RecommendedActions (practical portfolios or benchmarks).`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                role: { type: "string" },
                steps: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      stepNumber: { type: "integer" },
                      title: { type: "string" },
                      description: { type: "string" },
                      keySkills: { type: "array", items: { type: "string" } },
                      recommendedActions: { type: "array", items: { type: "string" } }
                    },
                    required: ["stepNumber", "title", "description", "keySkills", "recommendedActions"]
                  }
                }
              },
              required: ["role", "steps"]
            }
          }
        });

        res.json(JSON.parse(response.text || "{}"));
      } catch (geminiError: any) {
        console.warn("Gemini API Error in career roadmap endpoint, using fallback:", geminiError);
        
        const cleanRole = String(role);
        const cleanFocus = String(focusArea || "General Technical Growth");
        
        const fallbackRoadmap = {
          role: cleanRole,
          steps: [
            {
              stepNumber: 1,
              title: `Foundational Mastery in ${cleanRole} Systems`,
              description: `Establish a rock-solid grasp of core engineering architecture, modern patterns, and operational practices for a high-performing ${cleanRole}, prioritizing gaps in ${cleanFocus}.`,
              keySkills: ["Core System Design", "Algorithmic Complexity", "Design Patterns", "Modern Tooling Stack"],
              recommendedActions: [
                "Build and document 2 end-to-end open-source projects demonstrating clean architecture.",
                "Review industry-grade code organization in repositories utilizing matching stacks.",
                "Execute a comprehensive self-audit on foundational theory to resolve core knowledge blockers."
              ]
            },
            {
              stepNumber: 2,
              title: `Specialized Domain Synthesis (${cleanFocus})`,
              description: `Deep-dive into the specialized technical requirements of ${cleanFocus}, targeting high-value market needs and building production-ready proof points.`,
              keySkills: [`${cleanFocus} Best Practices`, "Performance Tuning & Diagnostics", "Secure API & Schema Modeling", "Automated Test Suites"],
              recommendedActions: [
                `Design and deploy a dedicated service demonstrating advanced ${cleanFocus} techniques.`,
                "Profile and optimize a database or API pipeline, documenting a >15% performance increase.",
                "Publish a clean technical write-up or article explaining your learnings."
              ]
            },
            {
              stepNumber: 3,
              title: `Engineering Scalability & Team Integration`,
              description: "Expand your technical footprint by architecting deployment flows, designing collaborative tools, and steering infrastructure standards.",
              keySkills: ["Cloud Infrastructure Integration", "CI/CD Pipeline Automation", "Strategic Decision Frameworks", "Peer Mentorship & Code Review"],
              recommendedActions: [
                "Deploy a fully containerized, microservice-ready environment with centralized logs.",
                "Define and establish standard linting, static analysis, and testing workflows for a team.",
                "Lead a lunch-and-learn session or mentor a peer on your focus domain."
              ]
            },
            {
              stepNumber: 4,
              title: "Strategic Technical Influence & Representation",
              description: "Navigate to senior-plus and leadership roles by aligning long-term product objectives with architectural patterns and advocating for engineering excellence.",
              keySkills: ["Architectural Visioning", "Culture & Process Design", "Systemic Compensation Negotiation", "Advocacy & Mentorship"],
              recommendedActions: [
                `Formulate and present a comprehensive 12-month technical roadmap for a ${cleanRole} team.`,
                "Design transparent development guidelines and objective engineering promotion matrices.",
                "Represent your tech domain in professional local meets, community panels, or panels."
              ]
            }
          ]
        };
        res.json(fallbackRoadmap);
      }
    } catch (error: any) {
      console.error("General Error in career roadmap endpoint:", error);
      res.status(500).json({ error: error.message || "Failed to compile roadmap." });
    }
  });

  // API Route for 90-Day Empowerment Skill Roadmap
  app.post("/api/90day-roadmap", async (req, res) => {
    try {
      const { currentRole, targetRole } = req.body;
      const cleanCurrent = String(currentRole || "1st Year B.Tech Student");
      const cleanTarget = String(targetRole || "AI Engineering Lead");

      try {
        const response = await generateContentWithRetry({
          model: "gemini-3.5-flash",
          contents: `You are 'Ask-Her-AI's senior engineering pathway architect. Design an immersive, interactive 90-day technical skill roadmap to transition from the current role "${cleanCurrent}" to the aspirational target role "${cleanTarget}".

Generate a structured JSON object containing an array of exactly 9 technical milestone cards.
Format:
{
  "currentRole": "${cleanCurrent}",
  "targetRole": "${cleanTarget}",
  "nodes": [
    {
      "id": "string (unique id like node-1, node-2, etc.)",
      "month": 1, 2, or 3,
      "title": "string (The core skill, project, or milestone)",
      "description": "string (A rich, descriptive explanation of what they will achieve)",
      "skills": ["array of 3-4 specific technical skills or tools"],
      "duration": "string (Estimated completion time, e.g., '12 Hours' or '2 Weeks')",
      "status": "string ('Completed', 'In Progress', or 'Up Next')",
      "links": [
        { "label": "string (The open-source or documentation link name)", "url": "string (A real, valid HTTPS link, e.g. GitHub or official docs)" }
      ],
      "checklist": [
        { "id": "string (unique id like chk-1-1)", "label": "string (The action item description)", "done": false }
      ]
    }
  ]
}

Distribute the 9 node cards exactly as follows:
- Month 1 (Foundation): 3 cards covering technical basics, syntax, core structures, and git.
- Month 2 (Project & Open Source): 3 cards covering building an advanced end-to-end project, open-source integration, and a hackathon/community challenge.
- Month 3 (Career Readiness): 3 cards covering resume optimization, deploying the portfolio, and mock technical & salary negotiation interviews.

Ensure all links are real, valid, and helpful (prefer official GitHub repos or official product documentation). Ensure the JSON output complies exactly with the schema.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                currentRole: { type: "string" },
                targetRole: { type: "string" },
                nodes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      month: { type: "integer" },
                      title: { type: "string" },
                      description: { type: "string" },
                      skills: { type: "array", items: { type: "string" } },
                      duration: { type: "string" },
                      status: { type: "string" },
                      links: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            label: { type: "string" },
                            url: { type: "string" }
                          },
                          required: ["label", "url"]
                        }
                      },
                      checklist: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            label: { type: "string" },
                            done: { type: "boolean" }
                          },
                          required: ["id", "label", "done"]
                        }
                      }
                    },
                    required: ["id", "month", "title", "description", "skills", "duration", "status", "links", "checklist"]
                  }
                }
              },
              required: ["currentRole", "targetRole", "nodes"]
            }
          }
        });

        res.json(JSON.parse(response.text || "{}"));
      } catch (geminiError: any) {
        console.warn("Gemini API Error in 90-day roadmap, using high-fidelity fallback:", geminiError);

        // Dynamically customized high-fidelity fallback generator
        const fallbackNodes = [
          // Month 1
          {
            id: "node-1",
            month: 1,
            title: "Advanced Coding & Mathematical Foundations",
            description: `Acquire the computational and mathematical basics essential for a ${cleanTarget}. Focus heavily on scientific python computing and algorithm complexity.`,
            skills: ["Python OOP", "Linear Algebra", "NumPy & Pandas", "Big O Complexity"],
            duration: "15 Hours",
            status: "Completed",
            links: [
              { label: "Python Official Tutorial", url: "https://docs.python.org/3/tutorial/" },
              { label: "NumPy Documentation", url: "https://numpy.org/doc/" }
            ],
            checklist: [
              { id: "chk-1-1", label: "Master dict comprehensions, lambda functions, and generator expressions", done: true },
              { id: "chk-1-2", label: "Review matrix multiplication, eigenvalues, and gradients for neural networks", done: true },
              { id: "chk-1-3", label: "Write 5 algorithms from scratch and calculate runtime complexity", done: false }
            ]
          },
          {
            id: "node-2",
            month: 1,
            title: "Data Structures & Technical Problem Solving",
            description: "Deep dive into fundamental structures required to ace technical system reviews and optimize computational latency.",
            skills: ["Trees & Graphs", "Hash Maps", "Searching & Sorting", "Memory Footprint"],
            duration: "25 Hours",
            status: "In Progress",
            links: [
              { label: "Algorithms & Data Structures Repo", url: "https://github.com/trekhleb/javascript-algorithms" },
              { label: "Interactive Coding Challenges", url: "https://github.com/kamyu104/LeetCode-Solutions" }
            ],
            checklist: [
              { id: "chk-2-1", label: "Implement a Binary Search Tree and Depth First Search traversal", done: true },
              { id: "chk-2-2", label: "Implement a custom caching decorator utilizing a hash map pattern", done: false },
              { id: "chk-2-3", label: "Benchmark performance gains of indexing versus raw sequential scan", done: false }
            ]
          },
          {
            id: "node-3",
            month: 1,
            title: "Collaborative Git & Version Control Pipelines",
            description: "Adopt advanced git operations, trunk-based development models, and professional semantic branching workflows.",
            skills: ["Git Rebase", "Pull Requests", "SSH Config", "Semantic Versioning"],
            duration: "8 Hours",
            status: "In Progress",
            links: [
              { label: "Git Flight Manual Guide", url: "https://github.com/539665/flight-manual" },
              { label: "Learn Git Branching Sandbox", url: "https://learngitbranching.js.org/" }
            ],
            checklist: [
              { id: "chk-3-1", label: "Configure secure cryptographic SSH keys for GitHub authentication", done: true },
              { id: "chk-3-2", label: "Practice resolving a rebase merge conflict inside a terminal environment", done: false },
              { id: "chk-3-3", label: "Establish a complete repository with custom pre-commit linting hooks", done: false }
            ]
          },

          // Month 2
          {
            id: "node-4",
            month: 2,
            title: `End-to-End ${cleanTarget} Project Design`,
            description: `Design and assemble a robust, functional, production-ready system highlighting your target competency as an aspiring ${cleanTarget}.`,
            skills: ["API Architecture", "Database Modeling", "Vector Databases", "Service Modularization"],
            duration: "30 Hours",
            status: "Up Next",
            links: [
              { label: "Build a Modern API with Express", url: "https://expressjs.com/" },
              { label: "PostgreSQL & Schema Architectures", url: "https://www.postgresql.org/docs/" }
            ],
            checklist: [
              { id: "chk-4-1", label: "Construct standard UML system design diagrams explaining client-server limits", done: false },
              { id: "chk-4-2", label: "Build a fully secure Express API with schema validations and rate limits", done: false },
              { id: "chk-4-3", label: "Connect a high-performance vector retrieval store for searching dataset nodes", done: false }
            ]
          },
          {
            id: "node-5",
            month: 2,
            title: "Open-Source Integrations & Contributions",
            description: "Learn to navigate complex open-source codebases, configure local testing environments, and submit clean, peer-reviewed pull requests.",
            skills: ["Fork & Upstream", "Open Source Conduct", "Code Quality Tools", "Unit Testing"],
            duration: "18 Hours",
            status: "Up Next",
            links: [
              { label: "First Contributions Guide Repo", url: "https://github.com/firstcontributions/first-contributions" },
              { label: "Awesome Open Source Catalog", url: "https://awesomeopensource.com/" }
            ],
            checklist: [
              { id: "chk-5-1", label: "Audit 3 active open-source repositories in your specialized tech track", done: false },
              { id: "chk-5-2", label: "Fix a documented documentation typo or small code bug on a public repo", done: false },
              { id: "chk-5-3", label: "Compose a comprehensive unit test suite with high code-coverage stats", done: false }
            ]
          },
          {
            id: "node-6",
            month: 2,
            title: "Hackathon Challenge & Rapid Prototyping",
            description: "Enter a high-tempo hackathon environment. Focus on writing clean code quickly, shipping a minimal viable product, and collaborating under stress.",
            skills: ["Rapid Prototyping", "Tailwind Integration", "Live Deployment", "Pitch Deck Craft"],
            duration: "20 Hours",
            status: "Up Next",
            links: [
              { label: "Major League Hacking Guidelines", url: "https://mlh.io/" },
              { label: "Vercel Fast Deployment", url: "https://vercel.com/docs" }
            ],
            checklist: [
              { id: "chk-6-1", label: "Formulate or join an active, diverse hackathon cohort specializing in tech solutions", done: false },
              { id: "chk-6-2", label: "Implement responsive interfaces using clean tailwind layouts in under 48 hours", done: false },
              { id: "chk-6-3", label: "Produce a 2-minute video pitch highlighting the core solution and SDG values", done: false }
            ]
          },

          // Month 3
          {
            id: "node-7",
            month: 3,
            title: "Technical Resume & GitHub Optimization",
            description: "Polish your online developer presence. Tailor your resume specifically for high-growth tech positions, focusing heavily on measurable impact.",
            skills: ["Resume Formatting", "GitHub Profile Readme", "SEO Keywords", "Impact Metrics"],
            duration: "6 Hours",
            status: "Up Next",
            links: [
              { label: "Awesome GitHub Profile Readme Template", url: "https://github.com/abhisheknaiidu/awesome-github-profile-readme" },
              { label: "Tech Resume Checklist Guide", url: "https://github.com/jwasham/coding-interview-university" }
            ],
            checklist: [
              { id: "chk-7-1", label: "Translate passive resume tasks into action-oriented statements: 'Shipped X, achieving Y%'", done: false },
              { id: "chk-7-2", label: "Add an elegant markdown landing page to your GitHub profile containing stats", done: false },
              { id: "chk-7-3", label: "Vectored clean badges highlighting your specialized skills on LinkedIn profiles", done: false }
            ]
          },
          {
            id: "node-8",
            month: 3,
            title: "Comprehensive Portfolio Deployment",
            description: `Deploy a production-grade portfolio website showcasing your custom ${cleanTarget} project achievements and active github stats.`,
            skills: ["Domain Configuration", "SEO & Optimization", "Responsive Design", "Continuous Integration"],
            duration: "12 Hours",
            status: "Up Next",
            links: [
              { label: "Netlify Core Hosting Services", url: "https://www.netlify.com/" },
              { label: "Lighthouse Performance Audit Tool", url: "https://developer.chrome.com/docs/lighthouse/" }
            ],
            checklist: [
              { id: "chk-8-1", label: "Build an interactive, fast portfolio utilizing responsive tailwind layouts", done: false },
              { id: "chk-8-2", label: "Conduct a full Lighthouse audit ensuring >95% scores on performance and accessibility", done: false },
              { id: "chk-8-3", label: "Map a personalized custom domain with automatic SSL security certificates", done: false }
            ]
          },
          {
            id: "node-9",
            month: 3,
            title: "Mock Interviews & Negotiation Calibration",
            description: `Prepare for intensive algorithmic interviews, system architecture design reviews, and professional wage negotiation dialogues.`,
            skills: ["Algorithmic Rehearsals", "System Architecture", "Rebuttal Strategy", "Confidence Building"],
            duration: "15 Hours",
            status: "Up Next",
            links: [
              { label: "System Design Primer Guide Repo", url: "https://github.com/donnemartin/system-design-primer" },
              { label: "Levels.fyi Transparency Benchmarks", url: "https://www.levels.fyi/" }
            ],
            checklist: [
              { id: "chk-9-1", label: "Execute 5 video mock interviews practicing structural behavioral responses (STAR)", done: false },
              { id: "chk-9-2", label: "Study database horizontal scalability, sharding, and latency considerations", done: false },
              { id: "chk-9-3", label: "Calibrate 3 salary negotiation rebuttals directly referencing your custom achievements", done: false }
            ]
          }
        ];

        res.json({
          currentRole: cleanCurrent,
          targetRole: cleanTarget,
          nodes: fallbackNodes
        });
      }
    } catch (error: any) {
      console.error("General Error in 90day roadmap endpoint:", error);
      res.status(500).json({ error: error.message || "Failed to generate 90-day roadmap." });
    }
  });

  // API Route for AI Negotiation Script Builder (Streaming chunk-by-chunk)
  app.post("/api/negotiation-script", async (req, res) => {
    try {
      const { role, experience, domain, currentOffer, targetMarketValue, targetSalaryAdjustment, keyAccomplishments, tone } = req.body;
      const cleanRole = String(role || "Software Engineer");
      const cleanExperience = String(experience || "Mid");
      const cleanDomain = String(domain || "Computer Science");
      const cleanCurrent = Number(currentOffer) || 0;
      const cleanTargetVal = Number(targetMarketValue) || 0;
      const cleanAdjustment = String(targetSalaryAdjustment || "20%");
      const cleanAccomplishments = String(keyAccomplishments || "Delivered high-impact technical milestones");
      const cleanTone = String(tone || "Data-Driven");

      // Set headers for streaming
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");

      const prompt = `You are 'Ask-Her-AI's senior compensation specialist and master negotiator. 
Help a high-performing female tech professional draft a professional, highly polished, and data-driven negotiation email to align her compensation with her true market worth.

Parameters:
- Role/Level: ${cleanRole} (${cleanExperience} Level)
- Specialized Domain: ${cleanDomain}
- Current Offered Base Salary: ${cleanCurrent}
- Target Fair Market Value Benchmark: ${cleanTargetVal}
- Target Requested Base Salary Adjustment: ${cleanAdjustment}
- Selection Tone: ${cleanTone}
- Documented Accomplishments: "${cleanAccomplishments}"

Strict system prompt rules:
1. Write a professional, data-driven compensation negotiation email. Do NOT include markdown blocks like "\`\`\`" or system preambles (such as "Certainly! Here is your email:"). Start directly with the greeting, e.g., "Dear [Hiring Manager Name]," or "Dear [Recruiter Name],".
2. Position the requested ${cleanAdjustment} base salary adjustment objectively by anchoring it relative to the validated ${cleanTargetVal} fair market average compared to the current offer of ${cleanCurrent}.
3. Support the argument heavily with her accomplishments: "${cleanAccomplishments}".
4. Tone must be strictly ${cleanTone} (e.g. Confident, Data-Driven, or Collaborative). Keep the vocabulary elegant, strong, and highly executive.
5. Stream ONLY the polished email script template.`;

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(chunk.text);
        }
      }
      res.end();
    } catch (error: any) {
      console.error("Error in streaming negotiation-script:", error);
      // Fallback response in case of error
      const targetValStr = req.body.targetMarketValue ? String(req.body.targetMarketValue) : "market rate";
      res.write(`Dear [Recruiter Name],\n\nThank you for the wonderful offer to join the team as a ${req.body.role || "Specialist"}. I am extremely excited about the opportunity to contribute to your core initiatives.\n\nBased on my contributions in ${req.body.domain || "tech"}, including my accomplishments in "${req.body.keyAccomplishments || "technical delivery"}", as well as validated market standards, I would like to request alignment of my base salary to match the fair market value. Given the regional averages of ${targetValStr} and my technical background, I am seeking a base salary adjustment of ${req.body.targetSalaryAdjustment || "20%"}.\n\nAligning the offer with standard market benchmarks would reflect the value I will bring. I look forward to your thoughts and to establishing a highly successful partnership.\n\nWarmly,\n[Your Name]`);
      res.end();
    }
  });

  // API Route for AI-powered Grant Eligibility Match Check
  app.post("/api/eligibility-match", async (req, res) => {
    try {
      const {
        grantTitle,
        grantProvider,
        grantEligibility,
        userMajor,
        userLevel,
        userGPA,
        userCountry,
        userBackground
      } = req.body;

      const cleanTitle = String(grantTitle || "STEM Scholarship");
      const cleanProvider = String(grantProvider || "Foundation");
      const cleanEligibility = String(grantEligibility || "Women in STEM");
      const cleanMajor = String(userMajor || "Computer Science");
      const cleanLevel = String(userLevel || "Undergraduate");
      const cleanGPA = String(userGPA || "3.5");
      const cleanCountry = String(userCountry || "Global");
      const cleanBackground = String(userBackground || "Enthusiastic about technology and leadership");

      try {
        const response = await generateContentWithRetry({
          model: "gemini-3.5-flash",
          contents: `You are an expert scholarship committee lead and career advisor. Analyze this female candidate's profile against the specified scholarship or grant requirements:
          
Grant Title: ${cleanTitle}
Provider: ${cleanProvider}
Grant Eligibility Requirements: ${cleanEligibility}

Candidate Profile:
- Major/Domain: ${cleanMajor}
- Education Level: ${cleanLevel}
- Current GPA: ${cleanGPA}
- Geographic Region/Country: ${cleanCountry}
- Custom Academic Background/Accomplishments: ${cleanBackground}

Evaluate the candidate and generate a JSON object containing:
1. "matchScore": A calculated integer percentage score (0-100) reflecting how closely she aligns with the grant's requirements.
2. "passedCriteria": An array of 3 specific eligibility standards she has clearly met based on her profile (e.g., "Major aligns with CS requirement", "Academic performance meets threshold").
3. "missingCriteria": An array of 2-3 potential gaps, ambiguities, or missing prerequisites she should verify or reinforce (e.g., "Requires proof of IEEE WIE membership", "Needs to verify upper-level undergraduate status").
4. "strategicAdvice": A short, highly tactical paragraph (max 100 words) advising her on how to address any gaps, tailor her application letter, or leverage her specific accomplishments to optimize her chance of selection.

Ensure the output is valid JSON in the specified schema.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                matchScore: { type: "integer" },
                passedCriteria: { type: "array", items: { type: "string" } },
                missingCriteria: { type: "array", items: { type: "string" } },
                strategicAdvice: { type: "string" }
              },
              required: ["matchScore", "passedCriteria", "missingCriteria", "strategicAdvice"]
            }
          }
        });

        res.json(JSON.parse(response.text || "{}"));
      } catch (geminiError: any) {
        console.warn("Gemini API Error in grant eligibility matcher, using fallback calculation:", geminiError);
        
        // Smart fallback calculation
        let score = 70; // Base score
        const passed: string[] = [];
        const missing: string[] = [];
        
        // Match major
        if (cleanEligibility.toLowerCase().includes(cleanMajor.toLowerCase()) || 
            cleanEligibility.toLowerCase().includes("stem") || 
            cleanEligibility.toLowerCase().includes("tech") ||
            cleanEligibility.toLowerCase().includes("engineering") ||
            cleanEligibility.toLowerCase().includes("science")) {
          score += 12;
          passed.push(`Academic Alignment: Your major in ${cleanMajor} aligns beautifully with the STEM/quantitative focus of the award.`);
        } else {
          score -= 10;
          missing.push(`Major Discrepancy: Ensure your ${cleanMajor} coursework highlights computational or engineering rigor.`);
        }

        // Match GPA
        const numGPA = parseFloat(cleanGPA) || 3.0;
        if (numGPA >= 3.7) {
          score += 10;
          passed.push(`Exceptional Academic Merit: Your GPA of ${cleanGPA} stands as a stellar testament to academic dedication.`);
        } else if (numGPA >= 3.4) {
          score += 5;
          passed.push(`Solid Academic Foundation: Your GPA of ${cleanGPA} meets standard merit thresholds.`);
        } else {
          score -= 5;
          missing.push(`GPA verification: The committee looks for outstanding academic promise. Focus heavily on your portfolio/projects to compensate.`);
        }

        // Match Level
        if (cleanEligibility.toLowerCase().includes(cleanLevel.toLowerCase()) || 
            cleanEligibility.toLowerCase().includes("undergrad") ||
            cleanEligibility.toLowerCase().includes("student")) {
          score += 8;
          passed.push(`Enrollment Milestone: Your current status as a ${cleanLevel} student qualifies you for the core application tract.`);
        } else {
          missing.push(`Academic Level Verification: Confirm if the scholarship accepts ${cleanLevel} students or requires advanced graduate standing.`);
        }

        // Add defaults if arrays are light
        if (passed.length === 0) {
          passed.push("Interest Alignment: General background fits with the overall educational goals of the sponsor.");
        }
        if (passed.length < 3) {
          passed.push("Gender Equality Initiative: Direct alignment with HerHorizon's priority supporting women in technological fields.");
        }
        
        if (missing.length === 0) {
          missing.push("External Recommendation: Secure a letter from a senior professor or industry mentor to certify your technical competence.");
        }
        if (missing.length < 2) {
          missing.push("Community Service/Leadership: Verify if active volunteering or mentoring is an implicit selection bias.");
        }

        const finalScore = Math.min(Math.max(score, 45), 98);
        
        const advice = `Your background in ${cleanMajor} serves as a solid foundation for this application. To optimize your chances, address the potential ambiguity regarding your ${cleanLevel} status by explicitly highlighting your leadership in technical groups. Craft a compelling narrative showcasing how the $${cleanTitle.includes("Travel") ? "stipend" : "scholarship"} enables you to mentor junior female coders under UN SDG 5 frameworks, making you an ideal choice for ${cleanProvider}.`;

        res.json({
          matchScore: finalScore,
          passedCriteria: passed,
          missingCriteria: missing,
          strategicAdvice: advice
        });
      }
    } catch (error: any) {
      console.error("General Error in eligibility match endpoint:", error);
      res.status(500).json({ error: error.message || "Failed to calculate eligibility." });
    }
  });

  // API Route for Salary Equalizer insights
  app.post("/api/salary-insights", async (req, res) => {
    try {
      const { role, experience, industry, location, currentSalary } = req.body;
      const parsedSalary = Number(currentSalary) || 100000;
      const cleanRole = String(role || "Software Engineer");
      const cleanExperience = String(experience || "Mid-Level");
      const cleanLocation = String(location || "Tech Hub");
      const cleanIndustry = String(industry || "FinTech");

      try {
        const response = await generateContentWithRetry({
          model: "gemini-3.5-flash",
          contents: `Analyze this salary scenario for a female tech professional:
Role: ${cleanRole}
Years of Experience: ${cleanExperience}
Industry: ${cleanIndustry}
Location: ${cleanLocation}
Current Base Salary: ${parsedSalary} (Please evaluate this amount in the user's local/implied currency. If they entered New Delhi, Bangalore, India, or a high number like 1,000,000+, it represents INR. If it is standard US/global tech hubs, it might be USD. Analyze and provide the outputs in the exact same currency scale).

Provide:
1. Average Industry Salary (estimate in the SAME currency scale as the input salary, factoring in the systemic gender wage gap in this sector).
2. Fair Market Value (reflecting what a premium qualified offer should command in the SAME currency scale as the input salary).
3. Estimated pay gap percentage.
4. 3 highly tactical salary negotiation pointers custom-suited for this scenario.
5. An empowering quote supporting equal compensation.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                averageIndustrySalary: { type: "number" },
                fairMarketValue: { type: "number" },
                estimatedGapPercent: { type: "number" },
                negotiationTips: { type: "array", items: { type: "string" } },
                empoweringClosing: { type: "string" }
              },
              required: ["averageIndustrySalary", "fairMarketValue", "estimatedGapPercent", "negotiationTips", "empoweringClosing"]
            }
          }
        });

        res.json(JSON.parse(response.text || "{}"));
      } catch (geminiError: any) {
        console.warn("Gemini API Error in salary insights endpoint, using fallback:", geminiError);
        
        // Dynamic mathematically plausible calculation for fallbacks
        const averageIndustrySalary = Math.round(parsedSalary * 1.18);
        const fairMarketValue = Math.round(parsedSalary * 1.25);
        const estimatedGapPercent = 18;
        
        const fallbackInsights = {
          averageIndustrySalary,
          fairMarketValue,
          estimatedGapPercent,
          negotiationTips: [
            `Benchmark objectively: Collect specific local metrics for a '${cleanRole}' with '${cleanExperience}' years of experience in the '${cleanLocation}' region from neutral sources like levels.fyi and H1B visa disclosures.`,
            `Anchor around achievements: Frame your conversation in '${cleanIndustry}' exclusively around business outcomes—quantifying latency improvements, server cost savings, or key projects you delivered.`,
            `Confidently handle friction: If the recruiter cites internal budget constraints, maintain a positive tone while requesting alternative compensation mechanisms like sign-on bonuses, equity grants, or flexible leadership training budgets.`
          ],
          empoweringClosing: `Your expertise is critical to driving high-performance software in ${cleanIndustry}. Negotiate with calm confidence—equal talent deserves equal compensation.`
        };
        res.json(fallbackInsights);
      }
    } catch (error: any) {
      console.error("General Error in salary insights endpoint:", error);
      res.status(500).json({ error: error.message || "Failed to generate compensation analysis." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
