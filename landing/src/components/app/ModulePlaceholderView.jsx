import React from 'react';
import { MODULE_REGISTRY } from './ModuleLayout';

export default function ModulePlaceholderView({ slug }) {
  const mod = MODULE_REGISTRY[slug] || {};
  const IconComp = mod.icon;

  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-sm my-6">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-4">
        {IconComp && <IconComp className="w-8 h-8" />}
      </div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
        {mod.num} {mod.name}: "{mod.tagline}"
      </h2>
      <p className="text-slate-500 max-w-lg mx-auto text-base mb-6 leading-relaxed">
        {mod.desc}
      </p>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold">
        <span>⏳</span>
        <span>Awaiting build order (Phase 2+)</span>
      </div>
    </div>
  );
}
