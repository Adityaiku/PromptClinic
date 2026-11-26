import React, { useState } from 'react';
import { Brain, AlertTriangle, Copy, Check, ChevronDown, ChevronUp, Sparkles, RefreshCw } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { DEMO_DATA } from '../../data/demoData';

export default function RememberView() {
  const { temperature, demoMode } = useSettings();
  const demo = DEMO_DATA.remember;

  const [transcript, setTranscript] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [copiedCard, setCopiedCard] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);

  const handleLoadDemo = () => {
    setTranscript(demo.chat_transcript);
    setQuery(demo.follow_up_question);
    setError(null);
  };

  const handleRunRemember = async () => {
    if (!transcript.trim()) {
      setError('Please provide a chat transcript to compress.');
      return;
    }
    setError(null);
    setLoading(true);

    if (demoMode) {
      await new Promise((r) => setTimeout(r, 600));
      setResults({
        context_card: demo.context_card,
        before_output: demo.before_output,
        after_output: demo.after_output,
      });
      setLoading(false);
      return;
    }

    try {
      const cardRes = await fetch('/api/remember/extract-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, temperature }),
      });
      const cardData = await cardRes.json();
      if (!cardRes.ok) throw new Error(cardData.error || 'Failed to extract context card');

      const testQuery = query.trim() || 'Summarize the core decisions made.';

      const [beforeRes, afterRes] = await Promise.all([
        fetch('/api/remember/answer-query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: testQuery, contextCard: null, temperature }),
        }),
        fetch('/api/remember/answer-query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: testQuery, contextCard: cardData.context_card, temperature }),
        }),
      ]);

      const beforeData = await beforeRes.json();
      const afterData = await afterRes.json();

      setResults({
        context_card: cardData.context_card,
        before_output: beforeData.output,
        after_output: afterData.output,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during context distillation.');
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
              Structured Summarization
            </span>
            <span className="text-slate-400 text-xs font-mono">Module 03</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Remember: Save your chat’s memory</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Turns long chats into clean, structured context cards you can paste into fresh conversations to preserve decisions.
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
          Long conversations suffer from context rot: models forget early decisions, drop critical constraints, and bloat token consumption.
        </div>
      </div>

      {/* 3. INPUT STEP */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <label className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">1</span>
            Enter chat transcript to compress into a Context Card
          </label>
          <textarea
            rows={5}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste a long multi-turn chat transcript here..."
            className="w-full rounded-xl border border-slate-200 p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-mono text-xs"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Follow-up question to test recall:
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. What tech stack and color palette did we choose, and what is our hard deadline?"
            className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <button
          onClick={handleRunRemember}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Distilling Context Card...</span>
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              <span>Extract Context Card & Compare</span>
            </>
          )}
        </button>
      </div>

      {/* 4. RESULTS SECTION */}
      {results && (
        <div className="space-y-6">
          {/* CONTEXT CARD BOX */}
          <div className="bg-white border border-indigo-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">2</span>
                <h3 className="text-sm font-bold text-slate-900">Distilled Context Card (Structured JSON)</h3>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(results.context_card, null, 2));
                  setCopiedCard(true);
                  setTimeout(() => setCopiedCard(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
              >
                {copiedCard ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCard ? 'Copied' : 'Copy Card'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
              <pre>{JSON.stringify(results.context_card, null, 2)}</pre>
            </div>
          </div>

          {/* SIDE-BY-SIDE BEFORE / AFTER */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-rose-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Before: Fresh Chat without Context</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
                  {results.before_output}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-rose-600 font-medium">
                ⚠️ Model has amnesia and hallucinates recommendations.
              </div>
            </div>

            <div className="bg-white border border-emerald-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">After: Grounded via Context Card</span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/30 border border-emerald-200 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
                  {results.after_output}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-100 text-[11px] text-emerald-700 font-medium">
                ✅ Exact parameters, dates, and tech choices perfectly recalled.
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
              <div className="font-bold text-slate-900 mb-1 font-sans">Context Card Extraction Prompt:</div>
              <pre className="p-3 rounded-lg bg-white border border-slate-200 whitespace-pre-wrap">
                {`You are a Context Summarization Engine.
Analyze a multi-turn chat transcript and extract a structured 'Context Card' capturing critical decisions, explicit constraints, preferences, goals, and open questions.`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
