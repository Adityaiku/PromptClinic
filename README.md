# 🩺 Prompt Clinic

An interactive, educational **Streamlit application** built for live lecture demonstrations in a college **Prompt Engineering** course.

Prompt Clinic demonstrates how systematic prompt engineering techniques transform vague, failure-prone LLM interactions into reliable, production-ready outputs.

---

## 🌟 Key Features

1. **Prompts are First-Class Citizens**:
   Every prompt template is defined as an explicit, named constant in `prompts.py`. Nothing is hidden inside functions.
2. **Transparent Prompt Inspection**:
   Every tab includes a **"Show prompts used"** expander displaying the exact system instructions, user prompts, and parameters sent to the model.
3. **Fail-Safe Offline Demo Mode**:
   A global sidebar toggle allows live instructors to run seamless demonstrations with pre-cached high-quality outputs even if classroom Wi-Fi fails or API quotas are exhausted.
4. **Resilient LLM Engine**:
   `llm.py` integrates the official Google GenAI SDK (`google-genai`) with automatic exponential backoff retries and clear student-friendly error messages.

---

## 🏗️ Project Structure

```
c:\PromptClinic\
├── .env.example             # Template for API credentials and model configuration
├── .env                     # Local configuration (never committed to Git)
├── .gitignore               # Ignores virtual environment and secret keys
├── requirements.txt         # streamlit, google-genai, python-dotenv
├── README.md                # Project documentation and lecture guide
├── app.py                   # Main Streamlit application (tabs and sidebar)
├── llm.py                   # Resilient ask() function with retry and demo logic
├── prompts.py               # Named prompt templates for all tabs
├── demo_data/
│   └── diagnose_demo.json   # Cached weak prompt, diagnosis JSON, and comparison outputs
└── tabs/
    ├── __init__.py          # Tab package exports
    ├── diagnose.py          # Tab 1: Prompt Doctor (Full Implementation)
    ├── verify.py            # Tab 2: Fact Checker (Phase 2 Stub)
    ├── remember.py          # Tab 3: Context Cards (Phase 3 Stub)
    ├── voice.py             # Tab 4: Style Mirror (Phase 4 Stub)
    └── defend.py            # Tab 5: Prompt Shield (Phase 5 Stub)
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Python 3.11+
- Google Gemini API Key ([Get one for free at Google AI Studio](https://aistudio.google.com/))

### 2. Setup Virtual Environment
The virtual environment is already initialized in `venv/`. To activate:

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**macOS / Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure API Keys
Edit the `.env` file in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

*(Note: If you do not have an API key right now, simply toggle **"Offline Demo Mode"** in the app's sidebar to test the full flow.)*

### 5. Launch the Streamlit App
```bash
.\venv\Scripts\streamlit run app.py
```

The app will open automatically in your browser at `http://localhost:8501`.

---

## 🩺 Tab 1: Diagnose (Prompt Doctor)

### Concept Taught
Most poor LLM responses stem from **underspecified prompts**. Prompt Doctor teaches students the 6 essential components of a robust prompt:
- **Role**: Setting an expert persona.
- **Context**: Grounding with background circumstances and project facts.
- **Format**: Specifying exact output structure (bullet points, executive summary, sections).
- **Constraints**: Setting strict length, tone, and operational boundaries.
- **Examples**: Few-shot references.
- **Clarity / Ambiguity reduction**: Removing vague terms.

### Demonstration Flow
1. Click **"Load demo example"** (loads `"Write an email to my team about the project"`).
2. Click **"Diagnose & Compare Outputs"**:
   - **Step 1**: The LLM analyzes the prompt and returns structured JSON identifying the exact missing components and produces an improved rewrite.
   - **Step 2**: Both the original weak prompt and the rewritten prompt are executed through the LLM.
   - **Step 3**: The side-by-side comparison displays why the engineered prompt produces far superior results.
3. Open **"Show Prompts Used"** to reveal the system instructions and formatting templates to the class.

---

## 🗺️ Roadmap: Upcoming Tabs

- **Tab 2 — Verify (Fact Checker)**: Fact decomposition, confidence scoring, and hedging against hallucinations.
- **Tab 3 — Remember (Context Cards)**: Summarizing long conversation history into structured JSON memory cards.
- **Tab 4 — Voice (Style Mirror)**: Extracting a formal style guide from few-shot writing samples.
- **Tab 5 — Defend (Prompt Shield)**: Defending against indirect prompt injections using structural delimiters and instruction hierarchies.
