import React, { useState } from 'react';
import { Sparkles, AlertTriangle, Copy, Check, ChevronDown, ChevronUp, RefreshCw, Palette } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { DEMO_DATA } from '../../data/demoData';

export default function VoiceView() {
  const { temperature, demoMode } = useSettings();
  const demo = DEMO_DATA.voice;

  const [samples, setSamples] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [copiedAfter, setCopiedAfter] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);

  const handleLoadDemo = () => {
    setSamples(demo.samples.join('\n\n'));
    setDraft(demo.draft);
    setError(null);
  };

  const handleRunVoice = async () => {
    if (!samples.trim() || !draft.trim()) {
      setError('Please provide writing samples and a draft memo.');
      return;
    }
    setError(null);
    setLoading(true);

    if (demoMode) {
      await new Promise((r) => setTimeout(r, 600));
      setResults({
        style_guide: demo.style_guide,
        before_output: demo.before_output,
        after_output: demo.after_output,
      });
      setLoading(false);
      return;
    }

    try {
      const styleRes = await fetch('/api/voice/extract-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ samples, temperature }),
      });
      const styleData = await styleRes.json();
      if (!styleRes.ok) throw new Error(styleData.error || 'Failed to extract style guide');

      const [beforeRes, afterRes] = await Promise.all([
        fetch('/api/voice/rewrite-draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ draft, styleGuide: null, temperature }),
        }),
        fetch('/api/voice/rewrite-draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ draft, styleGuide: styleData.style_guide, temperature }),
        }),
      ]);

      const beforeData = await beforeRes.json();
      const afterData = await afterRes.json();

      setResults({
        style_guide: styleData.style_guide,
        before_output: beforeData.output,
        after_output: afterData.output,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during style transfer.');
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
              Few-Shot Style Induction
            </span>
            <span className="text-slate-400 text-xs font-mono">Module 04</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Voice: Write like you</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Analyzes your writing samples to uncover sentence cadence, tone, and vocabulary, then rewrites corporate drafts in your voice.
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
          LLMs default to a homogeneous, repetitive corporate tone, stripping away personal voice, rhythm, and domain-specific nuances.
        </div>
      </div>

      {/* 3. INPUT STEP */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <label className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">1</span>
            Enter 3 writing samples to induce your stylistic signature
          </label>
          <textarea
            rows={4}
            value={samples}
            onChange={(e) => setSamples(e.target.value)}
            placeholder="Paste 3 short writing samples from the author..."
            className="w-full rounded-xl border border-slate-200 p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-sans text-xs"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Draft memo to rewrite:
          </label>
          <textarea
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Paste a draft message to apply the extracted style..."
            className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <button
          onClick={handleRunVoice}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Inducing Style & Rewriting...</span>
            </>
          ) : (
            <>
              <Palette className="w-4 h-4" />
              <span>Extract Style Guide & Rewrite</span>
            </>
          )}
        </button>
      </div>

      {/* 4. RESULTS SECTION */}
      {results && (
        <div className="space-y-6">
          {/* EXTRACTED STYLE GUIDE CARD */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center">2</span>
              <h3 className="text-sm font-bold text-slate-900">Extracted Style Signature</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-1">Sentence Cadence</div>
                <div className="text-xs font-semibold text-slate-800">{results.style_guide.sentence_length}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-1">Tone Signature</div>
                <div className="text-xs font-semibold text-slate-800">{results.style_guide.tone}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-1">Vocabulary Choice</div>
                <div className="text-xs font-semibold text-slate-800">{results.style_guide.vocabulary}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  DO (Stylistic Rules)
                </div>
                <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
                  {(results.style_guide.do_list || []).map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                  DON'T (Forbidden Habits)
                </div>
                <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
                  {(results.style_guide.dont_list || []).map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* SIDE-BY-SIDE BEFORE / AFTER */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-rose-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Before: Default Corporate Tone</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
                  {results.before_output}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-rose-600 font-medium">
                ⚠️ Polite padding, buzzwords, and sterile passive voice.
              </div>
            </div>

            <div className="bg-white border border-emerald-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">After: Styled in Author's Voice</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(results.after_output);
                      setCopiedAfter(true);
                      setTimeout(() => setCopiedAfter(false), 2000);
                    }}
                    className="text-slate-400 hover:text-slate-600 p-1"
                    title="Copy text"
                  >
                    {copiedAfter ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/30 border border-emerald-200 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
                  {results.after_output}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-100 text-[11px] text-emerald-700 font-medium">
                ✅ Direct, cadence matched, buzzwords purged.
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
              <div className="font-bold text-slate-900 mb-1 font-sans">Style Induction System Prompt:</div>
              <pre className="p-3 rounded-lg bg-white border border-slate-200 whitespace-pre-wrap">
                {`You are a Linguistic Stylist.
Analyze the provided writing samples and extract an actionable style guide detailing:
- sentence length
- tone
- vocabulary habits
- 3 explicit 'do' rules
- 3 explicit 'don't' rules`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

