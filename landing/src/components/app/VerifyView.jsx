import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle2, XCircle, ArrowRight, Copy, Check, ChevronDown, ChevronUp, Sparkles, RefreshCw } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { DEMO_DATA } from '../../data/demoData';

export default function VerifyView() {
  const { temperature, demoMode } = useSettings();
  const demo = DEMO_DATA.verify;

  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedHedged, setCopiedHedged] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);

  const handleLoadDemo = () => {
    setQuestion(demo.question);
    setError(null);
  };

  const handleRunVerify = async () => {
    if (!question.trim()) {
      setError('Please enter a question to verify.');
      return;
    }
    setError(null);
    setLoading(true);

    if (demoMode) {
      await new Promise((r) => setTimeout(r, 600));
      setResults({
        raw_answer: demo.raw_answer,
        claims: demo.claims,
        hedged_answer: demo.hedged_answer,
      });
      setLoading(false);
      return;
    }

    try {
      const rawRes = await fetch('/api/verify/raw-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, temperature }),
      });
      const rawData = await rawRes.json();
      if (!rawRes.ok) throw new Error(rawData.error || 'Failed to generate initial answer');

      const claimsRes = await fetch('/api/verify/check-claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer: rawData.output, temperature }),
      });
      const claimsData = await claimsRes.json();
      if (!claimsRes.ok) throw new Error(claimsData.error || 'Failed to verify claims');

      setResults({
        raw_answer: rawData.output,
        claims: claimsData.claims || [],
        hedged_answer: claimsData.hedged_answer,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. TECHNIQUE HEADER CARD */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              Chain-of-Verification (CoVe)
            </span>
            <span className="text-slate-400 text-xs font-mono">Module 02</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Verify: Can you trust this answer?</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Splits an AI response into discrete factual claims, flags potential hallucinations, and produces an audited, safe alternative.
          </p>
        </div>
        <button
          onClick={handleLoadDemo}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-all shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Load demo example</span>
        </button>
      </div>

      {/* 2. WHAT GOES WRONG BANNER */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-amber-950">What Goes Wrong: </strong>
          LLMs generate plausible-sounding falsehoods with unwavering confidence, stating hallucinations as verified facts without internal doubt.
        </div>
      </div>

      {/* 3. INPUT STEP */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">1</span>
            Enter a question containing potential factual claims
          </label>
        </div>

        <textarea
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. Explain Alexander Fleming's discovery of penicillin and how it was immediately used to cure soldiers in 1928."
          className="w-full rounded-xl border border-slate-200 p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-sans"
        />

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <button
          onClick={handleRunVerify}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Verifying Claims...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Verify Claims & Compare Outputs</span>
            </>
          )}
        </button>
      </div>

      {/* 4. RESULTS SECTION */}
      {results && (
        <div className="space-y-6">
          {/* CLAIMS DECOMPOSITION CARD */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">2</span>
                Decomposed Factual Claims ({results.claims.length} Evaluated)
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {results.claims.map((c, idx) => {
                const conf = (c.confidence || 'medium').toLowerCase();
                const isHigh = conf === 'high';
                const isLow = conf === 'low';
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                      isHigh
                        ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950'
                        : isLow
                        ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                        : 'bg-amber-50/50 border-amber-200 text-amber-950'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isHigh ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isLow ? (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-xs font-semibold">{c.claim}</div>
                      {c.risk_analysis && (
                        <div className="text-[11px] text-slate-600">{c.risk_analysis}</div>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${
                        isHigh
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isLow
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {c.confidence} Confidence
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIDE-BY-SIDE BEFORE / AFTER */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* BEFORE: RAW UNCHECKED */}
            <div className="bg-white border border-rose-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Before: Raw Unchecked LLM</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(results.raw_answer);
                      setCopiedRaw(true);
                      setTimeout(() => setCopiedRaw(false), 2000);
                    }}
                    className="text-slate-400 hover:text-slate-600 p-1"
                    title="Copy text"
                  >
                    {copiedRaw ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
                  {results.raw_answer}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-rose-600 font-medium">
                ⚠️ Contains unverified hallucinations stated with absolute certainty.
              </div>
            </div>

            {/* AFTER: VERIFIED & HEDGED */}
            <div className="bg-white border border-emerald-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">After: Verified & Hedged Response</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(results.hedged_answer);
                      setCopiedHedged(true);
                      setTimeout(() => setCopiedHedged(false), 2000);
                    }}
                    className="text-slate-400 hover:text-slate-600 p-1"
                    title="Copy text"
                  >
                    {copiedHedged ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/30 border border-emerald-200 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
                  {results.hedged_answer}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-100 text-[11px] text-emerald-700 font-medium">
                ✅ Fact-checked, historical inaccuracies corrected, uncertainty clearly signaled.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. PROMPT AUDIT EXPANDER */}
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
        <button
          onClick={() => setShowPrompts(!showPrompts)}
          className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <span>Show Prompts Used in This Module</span>
          {showPrompts ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>
        {showPrompts && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs font-mono text-slate-700">
            <div>
              <div className="font-bold text-slate-900 mb-1 font-sans">Verification Decomposition System Prompt:</div>
              <pre className="p-3 rounded-lg bg-white border border-slate-200 whitespace-pre-wrap">
                {`You are a Fact-Checking Specialist.
Given a question and its proposed answer, decompose the answer into distinct factual claims.
For each claim, assess its accuracy risk, assign a confidence level ("high", "medium", or "low"), and provide a concise risk analysis.
Then produce an improved, safety-hedged answer that corrects or nuances any dubious or hallucinated claims.`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

