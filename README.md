# 🌅 HerHorizen — AI FinTech & STEM Career Navigator

An AI-powered empowerment platform designed for women in STEM and higher education. ElevateHer bridges systemic gender disparity gaps by combining personalized AI career pathing, financial salary negotiation intelligence, curated micro-grant discovery, and 24/7 mentorship assistance into a seamless, accessible web platform.

---

## 📸 Preview & Screenshots

<div align="center">
   
   <br/>
   
### Home
![Homepage Preview](https://github.com/rudra520/BROZZZZ-v2v/blob/32c8a9853c2a2b129520d9528709423fb0446306/Preview%20Img/1_Homepage.png)

### 1. FinTech Wage Equalizer & Negotiation Simulator (Hero Feature)
*Interactive salary benchmarking, wage gap telemetry, and AI negotiation script generation.*
![FinTech Wage Equalizer Preview](https://github.com/rudra520/BROZZZZ-v2v/blob/32c8a9853c2a2b129520d9528709423fb0446306/Preview%20Img/3_FinTech_Equilizer.png)

<br/>

### 2. EduGrant & STEM Micro-Scholarship Finder
*Smart filterable hub for women-focused research fellowships, conference travel grants, and study micro-grants.*
![EduGrant Finder Preview](https://github.com/rudra520/BROZZZZ-v2v/blob/32c8a9853c2a2b129520d9528709423fb0446306/Preview%20Img/4_EduGrant_Hub.png)

<br/>

### 3. AI STEM Mentor & 90-Day Skill Roadmap Engine
*Custom step-by-step career progression roadmaps for technical and engineering roles.*
![AI STEM Roadmap Preview](https://github.com/rudra520/BROZZZZ-v2v/blob/32c8a9853c2a2b129520d9528709423fb0446306/Preview%20Img/5_AI_Career_Path.png)

<br/>

### 4. Ask-Her-AI 24/7 Conversational Companion
*Embedded AI assistant for technical interview prep, resume polishing, and workplace guidance.*
![Ask-Her-AI Preview](https://github.com/rudra520/BROZZZZ-v2v/blob/32c8a9853c2a2b129520d9528709423fb0446306/Preview%20Img/6_Ask_Her_AI.png)

</div>

---

## ✨ Features

- **Module 1: Interactive AI STEM Career Pathway Engine:** Generates customized 90-day technical skill roadmaps with curated open-source resources and certifications based on current domain and target career tier.
- **Module 2: FinTech Wage Equalizer & Negotiation Simulator:** Real-time salary benchmark comparisons, wage gap estimation, and dynamic AI-powered negotiation email/talking-point script generation.
- **Module 3: EduGrant & STEM Micro-Scholarship Finder:** Searchable directory connecting female students to global grants, IEEE WIE travel awards, research fellowships, and hackathon sponsorships.
- **Module 4: Ask-Her-AI 24/7 Career Mentor:** Conversational companion fine-tuned for engineering resume feedback, interview prep, and professional networking advice.

---

## 🛠️ Tech Stack & Tools

- **Frontend:** Next.js 14, React, Tailwind CSS.
- **UI & Data Visualization:** Lucide Icons, Framer Motion, Recharts.
- **Backend API:** Node.js, Next.js Serverless API Routes[cite: 3, 5]
- **AI Infrastructure:** Google Gemini API (for prompt orchestration, script generation, and career roadmap creation).
- **Deployment:** Vercel.

---

## 📚 Documentation & Architecture

ElevateHer operates on a modular frontend-backend architecture. The Next.js frontend delivers a glassmorphic, responsive user interface styled with Tailwind CSS and enhanced with interactive Recharts visual telemetry. 

AI requests (such as roadmap generation, salary script synthesis, and chat interactions) are processed through secure serverless API endpoints using Google Gemini models with crafted system prompts to ensure actionable, empathetic, and data-backed guidance.


```

┌─────────────────────────────────────────────────────────────┐
│                   Next.js 14 Glassmorphic UI                │
│ (Wage Equalizer | EduGrant Finder | AI Roadmap | Ask-Her-AI) │
└──────────────────────────────┬──────────────────────────────┘
│ Serverless API Calls
▼
┌─────────────────────────────────────────────────────────────┐
│                  Next.js API & Node.js Core                 │
└──────────────────────────────┬──────────────────────────────┘
│ Prompt Orchestration
▼
┌─────────────────────────────────────────────────────────────┐
│                      Google Gemini API                      │
└─────────────────────────────────────────────────────────────┘

```

---

## 🚀 Local Setup & Installation

```bash
# 1. Clone the repository
git clone [https://github.com/your-username/team_name-v2v.git](https://github.com/your-username/team_name-v2v.git)

# 2. Navigate to project directory
cd team_name-v2v

# 3. Install dependencies
npm install

# 4. Set up environment variables (.env.local)
GEMINI_API_KEY=your_gemini_api_key_here

# 5. Run local development server
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application locally.

# Updated Version_1.2

### 1) **FinTech Negotiation Script Generator** : Write the API endpoint that takes the user's domain, current offer, and target market value from your frontend sliders, passes them to Gemini using a strict system prompt, and streams back a professional, data-driven negotiation email.  

### 2) **AI STEM Roadmap Engine** : Orchestrate a prompt that forces Gemini to return a clean, structured JSON array representing the 90-day learning path. Parse this directly into your frontend stepper timeline component.  

### 3) **Ask-Her-AI Chatbot** : Establish a stateful chat endpoint using serverless routes to handle real-time career advice and interview preparation.
