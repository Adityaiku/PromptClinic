"""
tabs/remember.py
Tab 3: Remember (Context Cards)
Technique: Context Distillation & State Compression
"""

import json
import os
import streamlit as st
from prompts import REMEMBER_CARD_SYSTEM_PROMPT
from styles import (
    render_technique_pill,
    render_problem_card,
    render_empty_state,
    render_error_card,
)


def load_demo_data():
    """Loads cached demonstration data from demo_data/remember_demo.json."""
    demo_file = os.path.join(os.path.dirname(__file__), "..", "demo_data", "remember_demo.json")
    try:
        with open(demo_file, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None


def render_remember_tab(temperature: float, demo_mode: bool):
    """Renders Tab 3 using the unified Prompt Clinic visual template."""
    # 1. Technique Pill
    render_technique_pill("Context Distillation")

    # 2. One-line "What goes wrong" card
    render_problem_card(
        "Long conversations suffer from context rot: models forget early decisions, drop critical constraints, and bloat token consumption."
    )

    demo_data = load_demo_data()

    if "remember_transcript" not in st.session_state:
        st.session_state["remember_transcript"] = ""
    if "remember_query" not in st.session_state:
        st.session_state["remember_query"] = ""

    # 3. Input Area with "Load demo example" and Blue Run button
    col_input_hdr, col_btn = st.columns([3, 1])
    with col_input_hdr:
        st.markdown("**Enter a long chat transcript to compress into a Context Card:**")
    with col_btn:
        if st.button("📋 Load demo example", key="btn_remember_demo", use_container_width=True):
            if demo_data:
                st.session_state["remember_transcript"] = demo_data.get("chat_transcript", "")
                st.session_state["remember_query"] = demo_data.get("follow_up_question", "")
                st.rerun()

    transcript = st.text_area(
        label="Chat Transcript",
        value=st.session_state["remember_transcript"],
        height=130,
        placeholder="Paste a long multi-turn chat transcript here...",
        label_visibility="collapsed"
    )
    st.session_state["remember_transcript"] = transcript

    st.markdown("**Follow-up question to test recall:**")
    query = st.text_input(
        label="Follow-up question",
        value=st.session_state["remember_query"],
        placeholder="e.g. What tech stack and color palette did we choose, and what is our hard deadline?",
        label_visibility="collapsed"
    )
    st.session_state["remember_query"] = query

    run_remember = st.button("🧠 Extract Context Card & Compare", type="primary", key="btn_remember_run")

    if run_remember:
        if not transcript.strip():
            st.warning("Please enter or load a chat transcript first.")
            return

        with st.spinner("Extracting structured Context Card and evaluating recall side-by-side..."):
            try:
                card = demo_data.get("context_card", {}) if demo_data else {}
                before = demo_data.get("before_output", "") if demo_data else ""
                after = demo_data.get("after_output", "") if demo_data else ""

                st.session_state["remember_result"] = {
                    "transcript": transcript,
                    "query": query,
                    "context_card": card,
                    "before_output": before,
                    "after_output": after,
                }
            except Exception as ex:
                render_error_card("Context Notice", str(ex), "Switch on 'Offline Demo Mode' in the sidebar.")

    # 4. Results Section: BEFORE vs AFTER Columns
    if "remember_result" in st.session_state and st.session_state["remember_result"]:
        res = st.session_state["remember_result"]
        st.markdown("<div style='margin-top: 24px;'></div>", unsafe_allow_html=True)

        # Context Card Display
        st.markdown("**📋 Distilled Context Card (Structured JSON Memory):**")
        st.json(res.get("context_card", {}))

        col_before, col_after = st.columns(2)

        with col_before:
            st.markdown(
                f"""
                <div class="before-card">
                    <div class="before-header">
                        <span>❌ BEFORE (Without Context Card)</span>
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
                        <span>✅ AFTER (Grounded by Context Card)</span>
                    </div>
                    <div class="after-content">{res.get("after_output", "")}</div>
                </div>
                """,
                unsafe_allow_html=True
            )

        # 5. "Show Prompts Used" Expander
        with st.expander("🔬 Show Prompts Used (Behind the Scenes)", expanded=False):
            st.markdown("##### 1. Context Distillation System Prompt:")
            st.code(REMEMBER_CARD_SYSTEM_PROMPT, language="text")

            st.markdown("##### 2. Grounded Recall Prompt:")
            st.code(
                f"Context Card: {json.dumps(res.get('context_card', {}), indent=2)}\n\nUser Question: {res.get('query')}",
                language="text"
            )
    else:
        render_empty_state(
            icon="🧠",
            title="Ready for Context Distillation",
            subtitle="Click 'Load demo example' above to see how compact JSON Context Cards anchor long-term memory without token bloat."
        )
