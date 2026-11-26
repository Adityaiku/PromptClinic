import React, { useState } from 'react';
import { Sparkles, Copy, Check, AlertTriangle, ArrowRight, Zap, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { DEMO_DATA } from '../../data/demoData';
import { DIAGNOSE_SYSTEM_PROMPT, DIAGNOSE_USER_PROMPT_TEMPLATE } from '../../data/prompts';

export default function DiagnoseView() {
  const { temperature, demoMode } = useSettings();

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [stepStatus, setStepStatus] = useState('');
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [promptsOpen, setPromptsOpen] = useState(false);

  const [result, setResult] = useState(null);

  // Load demo example
  const handleLoadDemo = () => {
    const demo = DEMO_DATA.diagnose;
    setInputPrompt(demo.weak_prompt);
    setError(null);
  };

  // Run Diagnosis Flow
  const handleRunDiagnosis = async () => {
    const promptToTest = inputPrompt.trim();
    if (!promptToTest) {
      setError('Please enter or load a prompt first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    // OFFLINE DEMO MODE
    if (demoMode) {
      setStepStatus('⚡ Demo Mode: Replaying cached diagnosis...');
      await new Promise((r) => setTimeout(r, 400));
      const demo = DEMO_DATA.diagnose;
      setResult({
        original_prompt: demo.weak_prompt,
        issues: demo.diagnosis.issues,
        prompt_strength: demo.diagnosis.prompt_strength || { before: 3, after: 9 },
        rewritten_prompt: demo.diagnosis.rewritten_prompt,
        original_output: demo.original_output,
        rewritten_output: demo.rewritten_output,
        diagnose_system_sent: DIAGNOSE_SYSTEM_PROMPT,
        diagnose_user_sent: DIAGNOSE_USER_PROMPT_TEMPLATE.replace('{prompt}', promptToTest),
        rewritten_prompt_sent: demo.diagnosis.rewritten_prompt,
      });
      setLoading(false);
      setStepStatus('');
      return;
    }

    // LIVE SERVERLESS API CALLS (Single-call step orchestration)
    try {
      // Step 1: Diagnose prompt & synthesize rewrite
      setStepStatus('🔍 Step 1/2: Analyzing prompt weaknesses & synthesizing rewrite...');
      const diagRes = await fetch('/api/diagnose/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptToTest, temperature }),
      });

      const diagData = await diagRes.json();
      if (!diagRes.ok) {
        throw new Error(diagData.error || 'Failed to diagnose prompt.');
      }

      const rewrittenPrompt = diagData.rewritten_prompt;

      // Step 2: Concurrently generate comparative outputs
      setStepStatus('⚖️ Step 2/2: Generating comparative BEFORE and AFTER outputs...');
      const [origRes, rewrRes] = await Promise.all([
        fetch('/api/diagnose/run-original', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: promptToTest, temperature }),
        }),
        fetch('/api/diagnose/run-rewritten', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rewritten_prompt: rewrittenPrompt, temperature }),
        }),
      ]);

      const origData = await origRes.json();
      const rewrData = await rewrRes.json();

      if (!origRes.ok) throw new Error(origData.error || 'Failed generating original output.');
      if (!rewrRes.ok) throw new Error(rewrData.error || 'Failed generating rewritten output.');

      setResult({
        original_prompt: promptToTest,
        issues: diagData.issues || [],
        prompt_strength: diagData.prompt_strength || { before: 3, after: 9 },
        rewritten_prompt: rewrittenPrompt,
        original_output: origData.output || '',
        rewritten_output: rewrData.output || '',
        diagnose_system_sent: DIAGNOSE_SYSTEM_PROMPT,
        diagnose_user_sent: DIAGNOSE_USER_PROMPT_TEMPLATE.replace('{prompt}', promptToTest),
        rewritten_prompt_sent: rewrittenPrompt,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during diagnosis.');
    } finally {
      setLoading(false);
      setStepStatus('');
    }
  };

  const handleCopyRewritten = () => {
    if (result?.rewritten_prompt) {
      navigator.clipboard.writeText(result.rewritten_prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getChipStyle = (category = '') => {
    const cat = category.toLowerCase();
    if (cat.includes('role')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (cat.includes('context')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (cat.includes('format')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (cat.includes('constraint')) return 'bg-orange-50 text-orange-700 border-orange-200';
    if (cat.includes('ambiguity')) return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* WHAT GOES WRONG CARD */}
      <div className="rounded-2xl border border-rose-200/80 bg-white p-4 sm:p-5 shadow-sm border-l-4 border-l-rose-500">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-600 mb-1">
          <AlertTriangle className="w-4 h-4" />
          <span>What Goes Wrong</span>
        </div>
        <p className="text-base sm:text-lg text-slate-800 leading-relaxed">
          Underspecified prompts lack role, context, format, or constraints, forcing the AI to guess your intent and generate vague, generic output.
        </p>
      </div>

      {/* STEP 1: INPUT CARD */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 font-extrabold text-xs tracking-wider uppercase">
              Step 1
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Input Weak Prompt
            </h2>
            <span className="text-slate-400 text-sm hidden md:inline">— Paste a weak instruction to diagnose and reconstruct</span>
          </div>

          <button
            onClick={handleLoadDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <span>📋 Load demo example</span>
          </button>
        </div>

        <div className="space-y-4">
          <textarea
            rows={3}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="e.g. Write an email to my team about the project"
            className="w-full rounded-2xl border border-slate-200 p-4 text-slate-900 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 font-sans shadow-inner resize-y"
          />

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Execution Notice:</strong> {error}
                <div className="mt-1 text-xs text-rose-700">
                  Tip: Switch on <strong>Offline Demo Mode</strong> in the top-right Settings popover to test immediately without an API key.
                </div>
              </div>
            </div>
          )}

          {stepStatus && (
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-sm font-medium flex items-center gap-2.5 animate-pulse">
              <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
              <span>{stepStatus}</span>
            </div>
          )}

          <button
            onClick={handleRunDiagnosis}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-base sm:text-lg shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Diagnosing Prompt...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-white" />
                <span>Diagnose Prompt & Compare Outputs</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* RESULTS SECTION: STEP 2 & STEP 3 */}
      {result && (
        <>
          {/* STEP 2: DIAGNOSIS & REWRITTEN PROMPT */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
              <span className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 font-extrabold text-xs tracking-wider uppercase">
                Step 2
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Diagnosis & Engineered Prompt
              </h2>
            </div>

            {/* Prompt Strength Meter */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Prompt Strength:
                </span>
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-extrabold text-lg sm:text-xl">
                    ❌ {result.prompt_strength?.before || 3}/10
                  </span>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-lg sm:text-xl">
                    ⚡ {result.prompt_strength?.after || 9}/10
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-emerald-100/80 text-emerald-800 text-xs font-extrabold tracking-wide uppercase">
                  +{(result.prompt_strength?.after || 9) - (result.prompt_strength?.before || 3)} pts boost
                </span>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  • Production-ready
                </span>
              </div>
            </div>

            {/* Categorized Issue Chips */}
            <div className="mb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Identified Weaknesses ({result.issues?.length || 0} detected):
              </div>
              <div className="flex flex-wrap gap-2">
                {result.issues?.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold leading-normal ${getChipStyle(
                      issue.category
                    )}`}
                  >
                    <span>⚠️</span>
                    <strong className="capitalize">{issue.category}:</strong>
                    <span>{issue.explanation}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rewritten Prompt Box */}
            <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50/40 via-white to-blue-50/20 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-700">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Expert Rewritten Prompt (Production-Ready)</span>
                </div>

                <button
                  onClick={handleCopyRewritten}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 text-xs font-semibold transition-all shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm sm:text-base font-mono whitespace-pre-wrap leading-relaxed shadow-xs">
                {result.rewritten_prompt}
              </div>
            </div>
          </div>

          {/* STEP 3: COMPARATIVE OUTPUTS */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
              <span className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 font-extrabold text-xs tracking-wider uppercase">
                Step 3
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Comparative Outputs
              </h2>
              <span className="text-slate-400 text-sm hidden md:inline">
                — Direct BEFORE vs AFTER contrast on the exact same model
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* BEFORE COLUMN */}
              <div className="rounded-2xl border-2 border-rose-200 bg-rose-50/40 p-5 sm:p-6 shadow-xs flex flex-col">
                <div className="flex items-center gap-2 pb-3 border-b border-rose-200 text-rose-800 font-black text-base sm:text-lg mb-4">
                  <span>❌ BEFORE (Original Prompt Output)</span>
                </div>
                <div className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap max-h-[360px] overflow-y-auto pr-2">
                  {result.original_output}
                </div>
              </div>

              {/* AFTER COLUMN */}
              <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 p-5 sm:p-6 shadow-xs flex flex-col">
                <div className="flex items-center gap-2 pb-3 border-b border-emerald-200 text-emerald-800 font-black text-base sm:text-lg mb-4">
                  <span>✅ AFTER (Rewritten Prompt Output)</span>
                </div>
                <div className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap max-h-[360px] overflow-y-auto pr-2">
                  {result.rewritten_output}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* STEP 4: SHOW PROMPTS USED EXPANDER */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button
          onClick={() => setPromptsOpen(!promptsOpen)}
          className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-bold text-slate-800 hover:bg-slate-50 transition-all"
        >
          <div className="flex items-center gap-2">
            <span>🔬</span>
            <span>Show Prompts Used (Behind the Scenes)</span>
          </div>
          {promptsOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>

        {promptsOpen && (
          <div className="p-5 pt-0 border-t border-slate-100 space-y-4 bg-slate-50/50">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                1. Diagnosis System Instruction
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">
                {result?.diagnose_system_sent || DIAGNOSE_SYSTEM_PROMPT}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                2. Diagnosis User Prompt Template
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">
                {result?.diagnose_user_sent || DIAGNOSE_USER_PROMPT_TEMPLATE}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                3. Comparative Execution Calls
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">
                {`-- [CALL A: ORIGINAL] --\nUser: ${result?.original_prompt || '[User Prompt]'}\n\n-- [CALL B: REWRITTEN] --\nUser: ${result?.rewritten_prompt || '[Rewritten Prompt]'}`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
