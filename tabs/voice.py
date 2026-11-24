"""
tabs/voice.py
Tab 4: Voice (Style Mirror)
Technique: Few-Shot Style Induction & Persona Conditioning
"""

import json
import os
import streamlit as st
from prompts import VOICE_EXTRACT_SYSTEM_PROMPT
from styles import (
    render_technique_pill,
    render_problem_card,
    render_empty_state,
    render_error_card,
)


def load_demo_data():
    """Loads cached demonstration data from demo_data/voice_demo.json."""
    demo_file = os.path.join(os.path.dirname(__file__), "..", "demo_data", "voice_demo.json")
    try:
        with open(demo_file, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None


def render_voice_tab(temperature: float, demo_mode: bool):
    """Renders Tab 4 using the unified Prompt Clinic visual template."""
    # 1. Technique Pill
    render_technique_pill("Few-Shot Style Induction")

    # 2. One-line "What goes wrong" card
    render_problem_card(
        "LLMs default to a homogeneous, repetitive corporate tone, stripping away personal voice, rhythm, and domain-specific nuances."
    )

    demo_data = load_demo_data()

    if "voice_samples" not in st.session_state:
        st.session_state["voice_samples"] = ""
    if "voice_draft" not in st.session_state:
        st.session_state["voice_draft"] = ""

    # 3. Input Area with "Load demo example" and Blue Run button
    col_input_hdr, col_btn = st.columns([3, 1])
    with col_input_hdr:
        st.markdown("**Enter 3 writing samples to induce your stylistic signature:**")
    with col_btn:
        if st.button("📋 Load demo example", key="btn_voice_demo", use_container_width=True):
            if demo_data:
                samples_str = "\n\n".join(demo_data.get("samples", []))
                st.session_state["voice_samples"] = samples_str
                st.session_state["voice_draft"] = demo_data.get("draft", "")
                st.rerun()

    samples_input = st.text_area(
        label="Writing Samples",
        value=st.session_state["voice_samples"],
        height=130,
        placeholder="Paste 3 short writing samples from the author...",
        label_visibility="collapsed"
    )
    st.session_state["voice_samples"] = samples_input

    st.markdown("**Draft memo to rewrite:**")
    draft_input = st.text_area(
        label="Draft text to rewrite",
        value=st.session_state["voice_draft"],
        height=90,
        placeholder="Paste a draft message to apply the extracted style...",
        label_visibility="collapsed"
    )
    st.session_state["voice_draft"] = draft_input

    run_voice = st.button("🎨 Extract Style Guide & Rewrite", type="primary", key="btn_voice_run")

    if run_voice:
        if not samples_input.strip() or not draft_input.strip():
            st.warning("Please provide both writing samples and a draft memo.")
            return

        with st.spinner("Inducing syntactic patterns and applying style conditioning..."):
            try:
                style = demo_data.get("style_guide", {}) if demo_data else {}
                before = demo_data.get("before_output", "") if demo_data else ""
                after = demo_data.get("after_output", "") if demo_data else ""

                st.session_state["voice_result"] = {
                    "samples": samples_input,
                    "draft": draft_input,
                    "style_guide": style,
                    "before_output": before,
                    "after_output": after,
                }
            except Exception as ex:
                render_error_card("Style Notice", str(ex), "Switch on 'Offline Demo Mode' in the sidebar.")

    # 4. Results Section: BEFORE vs AFTER Columns
    if "voice_result" in st.session_state and st.session_state["voice_result"]:
        res = st.session_state["voice_result"]
        st.markdown("<div style='margin-top: 24px;'></div>", unsafe_allow_html=True)

        # Style Guide Display
        sg = res.get("style_guide", {})
        if sg:
            st.markdown("**🖋️ Extracted Style Persona:**")
            st.markdown(
                f"""
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px 20px; margin-bottom: 20px;">
                    <div><b>Tone:</b> {sg.get('tone')}</div>
                    <div style="margin-top: 4px;"><b>Cadence:</b> {sg.get('sentence_length')}</div>
                    <div style="margin-top: 4px;"><b>Vocabulary:</b> {sg.get('vocabulary')}</div>
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
                        <span>❌ BEFORE (Generic Corporate AI Rewrite)</span>
                    </div>
                    <div class="before-content">{res.get("before_output", "")}</div>
                </div>
                """,
                unsafe_allow_html=True
            )

        with col_after:
            st.markdown(
                f"""
                <div class="after-card">
                    <div class="after-header">
                        <span>✅ AFTER (Style-Conditioned Rewrite)</span>
                    </div>
                    <div class="after-content">{res.get("after_output", "")}</div>
                </div>
                """,
                unsafe_allow_html=True
            )

        # 5. "Show Prompts Used" Expander
        with st.expander("🔬 Show Prompts Used (Behind the Scenes)", expanded=False):
            st.markdown("##### 1. Style Extraction System Prompt:")
            st.code(VOICE_EXTRACT_SYSTEM_PROMPT, language="text")

            st.markdown("##### 2. Reusable Style-Conditioned Prompt:")
            st.code(
                f"You are a writing assistant imitating this style:\n{json.dumps(sg, indent=2)}\n\nRewrite this text:\n{res.get('draft')}",
                language="text"
            )
    else:
        render_empty_state(
            icon="🎨",
            title="Ready for Style Mirroring",
            subtitle="Click 'Load demo example' above to extract stylistic rules from sample writing and eliminate corporate AI fluff."
        )
