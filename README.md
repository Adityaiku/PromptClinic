# 🩺 Prompt Clinic

> **Master prompt engineering through live side-by-side contrast, claim verification, and adversarial defense.**

Prompt Clinic is an interactive educational laboratory built for live classroom and projector demonstrations in prompt engineering. It bridges the gap between theoretical prompting techniques and real-world AI behavior by presenting direct, side-by-side comparative outputs for every concept. Whether diagnosing vague prompts, decomposing claims to detect hallucinations, condensing chats into reusable memory cards, mirroring author style, or shielding systems from indirect prompt injection, Prompt Clinic makes model reasoning fully transparent, auditable, and accessible.

---

## 📸 Screenshots & Live Demo

- **Live Landing Page**: [Coming Soon / Live Link Placeholder](https://promptclinic.demo.app)
- **Live Streamlit Lab**: [Coming Soon / App Link Placeholder](https://app.promptclinic.demo.app)

```
[ SCREENSHOT PLACEHOLDER: Landing Page Hero & Module Chooser ]
![Prompt Clinic Landing Page](https://via.placeholder.com/1200x630.png?text=Prompt+Clinic+Landing+Page)

[ SCREENSHOT PLACEHOLDER: Module 01 Diagnose Side-by-Side Comparison ]
![Prompt Clinic Diagnose Module](https://via.placeholder.com/1200x630.png?text=Prompt+Clinic+Diagnose+Module)
```

---

## 🔬 The 5 Core Modules

Prompt Clinic is organized into five standalone, focused modules accessible directly or via deep links (`?module=<slug>`):

### 1. 🩺 01 Diagnose: *"Check up your prompt"*
* **Technique**: Prompt Decomposition (Role, Context, Format, Constraints)
* **What Goes Wrong**: Underspecified prompts force LLMs to guess intent, producing generic, low-value outputs.
* **The Fix**: Analyzes input prompts, calculates a **Prompt Strength** score (e.g. `3/10 ➔ 9/10`), highlights categorized weakness chips (missing role, context, format, constraints, ambiguity), and displays an expertly engineered prompt alongside comparative BEFORE (red) and AFTER (green) outputs.

### 2. 🔍 02 Verify: *"Can you trust this answer?"*
* **Technique**: Chain-of-Verification & Claim Decomposition
* **What Goes Wrong**: Models generate plausible-sounding falsehoods with unwavering confidence, presenting hallucinations as verified facts.
* **The Fix**: Splits responses into discrete factual claims, measures confidence ratings (**High**, **Medium**, **Low**), notes potential failure modes, provides a safer hedged version, and emphasizes trusted-source verification.

### 3. 🧠 03 Remember: *"Save your chat's memory"*
* **Technique**: Structured Summarization & Context Cards
* **What Goes Wrong**: Long multi-turn conversations exceed context windows and drown critical instructions in conversational noise.
* **The Fix**: Extracts a structured, copyable JSON Context Card (Goal, Decisions, Constraints, Preferences, Key Facts, Open Questions), showcases word-count reduction statistics, and contrasts follow-up questions with vs. without the context card.

### 4. 🎭 04 Voice: *"Write like you"*
* **Technique**: Few-Shot Style Transfer & Linguistic Induction
* **What Goes Wrong**: LLMs default to homogeneous corporate jargon, flattening unique voice and personal rhythm.
* **The Fix**: Induces an author's linguistic fingerprint from 3 writing samples (tone, average sentence length, vocabulary, quirks, do/don't rules), outputs a reusable prompt template, and compares generic rewrites against in-voice drafts.

### 5. 🛡️ 05 Defend: *"Stop prompt hijacking"*
* **Technique**: Delimited Defense & Structural Segregation
* **What Goes Wrong**: Untrusted input documents contain embedded prompt injections that hijack the LLM's operational instructions.
* **The Fix**: Contrasts naive summarization (which succumbs to injection attacks) with delimited, instruction-isolated defenses that treat document content strictly as data, highlighting security alerts with bold **PASS / FAIL** indicators.

---

## 🛠️ Tech Stack

### **Streamlit Interactive Lab**
- **Runtime**: Python 3.11+
- **Framework**: Streamlit 1.35+
- **Styling**: Custom CSS design system (Inter typography, 24px border-radius cards, projector-ready 18px+ text, `#FAFAFA` canvas)
- **AI Engine**: Google GenAI SDK (`google-genai`), Gemini 2.5 Flash with structured JSON schema support

### **Marketing Landing Page**
- **Framework**: React 18 with Vite 6
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Interaction**: Animated expanding circular reveal, floating bobbing cards, infinite marquee reviews, concentric chatbot orbit

---

## 🎯 Pedagogical Philosophy

1. **Prompts are First-Class Citizens**: All system instructions and prompt templates are defined as named constants in `prompts.py` — never buried inside nested functions.
2. **Total Transparency**: Every module features a `"🔬 Show Prompts Used"` expander detailing the exact system instructions and parameters sent to the model.
3. **Fail-Safe Classroom Reliability**: Every module includes an **Offline Demo Mode** toggle that replays curated, pre-cached examples with zero network requests or API costs.
4. **Deep-Link Ready**: Instructors can share or bookmark any module directly using `?module=<slug>` URL parameters.

---

## 🚀 Local Setup & Installation

### Prerequisites
- Python 3.11 or higher
- Node.js 18 or higher (with npm)
- A Google Gemini API Key ([Get one for free at Google AI Studio](https://aistudio.google.com/))

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/prompt-clinic.git
cd prompt-clinic
```

---

### Step 2: Configure Environment Variables

1. **Root (Streamlit App)**:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your configuration:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   SITE_URL=http://localhost:3000
   ```
   *(Note: You can run the app without an API key by enabling **Offline Demo Mode** in the app's Settings!)*

2. **Landing Page**:
   ```bash
   cp landing/.env.example landing/.env
   ```
   Verify `landing/.env`:
   ```env
   VITE_DEMO_URL=http://localhost:8501
   ```

---

### Step 3: Run the Streamlit Interactive App

```bash
# Create and activate virtual environment
python -m venv venv

# Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Streamlit
streamlit run app.py
```
The Streamlit app will open at: **`http://localhost:8501`**

---

### Step 4: Run the React Landing Page

In a separate terminal window:
```bash
cd landing
npm install
npm run dev
```
The landing page will open at: **`http://localhost:3000`**

---

## 📁 Repository Structure

```
PromptClinic/
├── .env.example               # Root environment template
├── .gitignore                 # Git ignore rules (secrets, venv, node_modules)
├── README.md                  # Project documentation
├── requirements.txt           # Python dependencies
├── app.py                     # Streamlit shared shell & router
├── llm.py                     # Resilient Gemini API client with backoff
├── prompts.py                 # Central repository of prompt templates
├── styles.py                  # Custom CSS design system
├── demo_data/                 # Pre-cached JSON datasets for Offline Demo Mode
│   ├── diagnose_demo.json
│   ├── verify_demo.json
│   ├── remember_demo.json
│   ├── voice_demo.json
│   └── defend_demo.json
├── tabs/                      # Individual module implementations
│   ├── __init__.py
│   ├── diagnose.py            # Module 01: Prompt Doctor
│   ├── verify.py              # Module 02: Claim Verification
│   ├── remember.py            # Module 03: Context Cards
│   ├── voice.py               # Module 04: Style Mirror
│   └── defend.py              # Module 05: Prompt Shield
└── landing/                   # React + Vite Marketing Site
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── .env.example
    ├── index.html
    └── src/
        ├── App.jsx            # Main view & circular transition
        └── components/
            ├── Hero.jsx
            ├── ModuleChooser.jsx # Full-screen check-up selection overlay
            ├── Features.jsx
            ├── IntegrationsA.jsx
            ├── IntegrationsB.jsx
            ├── Testimonials.jsx
            ├── Pricing.jsx
            ├── FAQ.jsx
            └── Footer.jsx
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🤝 Acknowledgments

- Built for hands-on, live lecture demonstrations in prompt engineering.
- Powered by Google DeepMind's Gemini models via the `google-genai` SDK.
