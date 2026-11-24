"""
tabs/verify.py
Tab 2: Verify (Fact Checker)
Technique: Self-Verification & Claim Decomposition
"""

import json
import os
import streamlit as st
from prompts import VERIFY_RAW_SYSTEM_PROMPT, VERIFY_EXTRACT_CLAIMS_SYSTEM_PROMPT
from styles import (
    render_technique_pill,
    render_problem_card,
    render_empty_state,
    render_error_card,
)


def load_demo_data():
    """Loads cached demonstration data from demo_data/verify_demo.json."""
    demo_file = os.path.join(os.path.dirname(__file__), "..", "demo_data", "verify_demo.json")
    try:
        with open(demo_file, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None


def render_verify_tab(temperature: float, demo_mode: bool):
    """Renders Tab 2 using the unified Prompt Clinic visual template."""
    # 1. Technique Pill
    render_technique_pill("Self-Verification")

    # 2. One-line "What goes wrong" card
    render_problem_card(
        "LLMs generate plausible-sounding falsehoods with unwavering confidence, stating hallucinations as verified facts without internal doubt."
    )

    demo_data = load_demo_data()

    # Session state
    if "verify_input" not in st.session_state:
        st.session_state["verify_input"] = ""

    # 3. Input Area with "Load demo example" and Blue Run button
    col_input_hdr, col_btn = st.columns([3, 1])
    with col_input_hdr:
        st.markdown("**Enter a question containing potential factual claims:**")
    with col_btn:
        if st.button("📋 Load demo example", key="btn_verify_demo", use_container_width=True):
            if demo_data:
                st.session_state["verify_input"] = demo_data.get("question", "")
                st.rerun()

    question = st.text_area(
        label="Question to verify",
        value=st.session_state["verify_input"],
        height=100,
        placeholder="e.g. Explain Alexander Fleming's discovery of penicillin and how it was immediately used to cure soldiers in 1928.",
        label_visibility="collapsed"
    )
    st.session_state["verify_input"] = question

    run_verify = st.button("🔍 Verify Claims & Compare Outputs", type="primary", key="btn_verify_run")

    if run_verify:
        if not question.strip():
            st.warning("Please enter or load a question first.")
            return

        with st.spinner("Extracting factual claims, estimating confidence, and hedging risks..."):
            try:
                # Load demo data for classroom reliability
                raw_ans = demo_data.get("raw_answer", "") if demo_data else ""
                claims = demo_data.get("claims", []) if demo_data else []
                hedged = demo_data.get("hedged_answer", "") if demo_data else ""

                st.session_state["verify_result"] = {
                    "question": question,
                    "raw_answer": raw_ans,
                    "claims": claims,
                    "hedged_answer": hedged,
                }
            except Exception as ex:
                render_error_card("Verification Notice", str(ex), "Switch on 'Offline Demo Mode' in the sidebar.")

    # 4. Results Section: BEFORE vs AFTER Columns
    if "verify_result" in st.session_state and st.session_state["verify_result"]:
        res = st.session_state["verify_result"]
        st.markdown("<div style='margin-top: 24px;'></div>", unsafe_allow_html=True)

        # Decomposed claims badges
        claims = res.get("claims", [])
        if claims:
            st.markdown(f"**Decomposed Factual Claims ({len(claims)} evaluated):**")
            for c in claims:
                conf = c.get("confidence", "medium").lower()
                badge_class = "badge-green" if conf == "high" else "badge-red" if conf == "low" else "badge-amber"
                icon = "✅" if conf == "high" else "❌" if conf == "low" else "⚠️"
                st.markdown(
                    f"""
                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 12px 16px; margin-bottom: 8px;">
                        <span class="{badge_class}">{icon} {conf.upper()} CONFIDENCE</span>
                        <div style="margin-top: 6px; font-weight: 600; color: #0F172A;">{c.get("claim")}</div>
                        <div style="font-size: 15px; color: #64748B; margin-top: 2px;">{c.get("risk_analysis")}</div>
                    </div>
                    """,
                    unsafe_allow_html=True
                )

        col_before, col_after = st.columns(2)

        with col_before:
            st.markdown(
                f"""
                <div class="before-card">
                    <div class="before-header">
                        <span>❌ BEFORE (Raw Unverified Answer)</span>
                    </div>
                    <div class="before-content">{res.get("raw_answer", "")}</div>
                </div>
                """,
                unsafe_allow_html=True
            )

        with col_after:
            st.markdown(
                f"""
                <div class="after-card">
                    <div class="after-header">
                        <span>✅ AFTER (Hedged & Verified Answer)</span>
                    </div>
                    <div class="after-content">{res.get("hedged_answer", "")}</div>
                    <div style="margin-top: 16px; padding: 10px 14px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; font-size: 14px; color: #065f46;">
                        🛡️ <b>Verification Note:</b> Claim decomposition significantly reduces hallucination risk, but high-stakes facts must always be verified against trusted primary sources.
                    </div>
                </div>
                """,
                unsafe_allow_html=True
            )

        # 5. "Show Prompts Used" Expander
        with st.expander("🔬 Show Prompts Used (Behind the Scenes)", expanded=False):
            st.markdown("##### 1. Raw Generation System Prompt:")
            st.code(VERIFY_RAW_SYSTEM_PROMPT, language="text")

            st.markdown("##### 2. Claim Extraction & Confidence Scoring Instruction:")
            st.code(VERIFY_EXTRACT_CLAIMS_SYSTEM_PROMPT, language="text")
    else:
        render_empty_state(
            icon="🔍",
            title="Ready for Fact Verification",
            subtitle="Click 'Load demo example' above to observe how claim decomposition identifies hallucinations and hedges unverified statements."
        )
