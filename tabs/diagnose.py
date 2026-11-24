"""
tabs/diagnose.py
Tab 1: Diagnose (Prompt Doctor)
Technique: Prompt Decomposition (Role, Context, Format, Constraints)
"""

import json
import os
import streamlit as st
from prompts import DIAGNOSE_SYSTEM_PROMPT, DIAGNOSE_USER_PROMPT_TEMPLATE
from llm import ask
from styles import (
    render_technique_pill,
    render_problem_card,
    render_empty_state,
    render_error_card,
)


def load_demo_data():
    """Loads cached demonstration data from demo_data/diagnose_demo.json."""
    demo_file = os.path.join(os.path.dirname(__file__), "..", "demo_data", "diagnose_demo.json")
    try:
        with open(demo_file, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None


def render_diagnose_tab(temperature: float, demo_mode: bool):
    """Renders Tab 1 using the unified Prompt Clinic visual template."""
    # 1. Technique Pill
    render_technique_pill("Prompt Decomposition")

    # 2. One-line "What goes wrong" card
    render_problem_card(
        "Underspecified prompts lack role, context, format, or constraints, forcing the AI to guess your intent and generate vague, generic output."
    )

    demo_data = load_demo_data()

    # Session state initialization
    if "diagnose_input" not in st.session_state:
        st.session_state["diagnose_input"] = ""

    # 3. Input Area with "Load demo example" and Blue Run button
    col_input_hdr, col_btn = st.columns([3, 1])
    with col_input_hdr:
        st.markdown("**Enter a weak prompt to diagnose:**")
    with col_btn:
        if st.button("📋 Load demo example", key="btn_diagnose_demo", use_container_width=True):
            if demo_data:
                st.session_state["diagnose_input"] = demo_data.get("weak_prompt", "")
                st.rerun()

    user_prompt = st.text_area(
        label="Prompt to diagnose",
        value=st.session_state["diagnose_input"],
        height=110,
        placeholder="e.g. Write an email to my team about the project",
        label_visibility="collapsed"
    )
    st.session_state["diagnose_input"] = user_prompt

    run_diagnosis = st.button("🔍 Diagnose & Compare Outputs", type="primary", key="btn_diagnose_run")

    # Execution handling
    if run_diagnosis:
        if not user_prompt.strip():
            st.warning("Please enter or load a prompt first.")
            return

        with st.spinner("Analyzing prompt weaknesses and generating comparison outputs..."):
            try:
                diagnose_system = DIAGNOSE_SYSTEM_PROMPT
                diagnose_user = DIAGNOSE_USER_PROMPT_TEMPLATE.format(prompt=user_prompt)
                demo_diag_str = json.dumps(demo_data.get("diagnosis", {})) if demo_data else None

                # Step 1: Diagnose
                diag_raw_response = ask(
                    system=diagnose_system,
                    user=diagnose_user,
                    temperature=temperature,
                    json_mode=True,
                    demo_mode=demo_mode,
                    demo_data=demo_diag_str
                )

                cleaned_json = diag_raw_response.strip()
                if cleaned_json.startswith("```json"):
                    cleaned_json = cleaned_json[7:]
                elif cleaned_json.startswith("```"):
                    cleaned_json = cleaned_json[3:]
                if cleaned_json.endswith("```"):
                    cleaned_json = cleaned_json[:-3]
                cleaned_json = cleaned_json.strip()

                diagnosis_json = json.loads(cleaned_json)
                rewritten_prompt = diagnosis_json.get("rewritten_prompt", user_prompt)

                # Step 2: Run both prompts
                orig_demo = demo_data.get("original_output", "") if demo_data else None
                orig_output = ask(
                    system="You are a helpful assistant.",
                    user=user_prompt,
                    temperature=temperature,
                    json_mode=False,
                    demo_mode=demo_mode,
                    demo_data=orig_demo
                )

                rewritten_demo = demo_data.get("rewritten_output", "") if demo_data else None
                rewritten_output = ask(
                    system="You are a helpful assistant.",
                    user=rewritten_prompt,
                    temperature=temperature,
                    json_mode=False,
                    demo_mode=demo_mode,
                    demo_data=rewritten_demo
                )

                st.session_state["diagnose_result"] = {
                    "original_prompt": user_prompt,
                    "issues": diagnosis_json.get("issues", []),
                    "rewritten_prompt": rewritten_prompt,
                    "original_output": orig_output,
                    "rewritten_output": rewritten_output,
                    "diagnose_system_sent": diagnose_system,
                    "diagnose_user_sent": diagnose_user,
                    "rewritten_prompt_sent": rewritten_prompt,
                }

            except json.JSONDecodeError:
                render_error_card(
                    "Parsing Error",
                    "The model's diagnostic response could not be parsed as valid JSON.",
                    "Try running again or toggle 'Offline Demo Mode' in the sidebar for guaranteed reliability."
                )
            except Exception as ex:
                render_error_card(
                    "Service Notice",
                    str(ex),
                    "Switch on 'Offline Demo Mode' in the sidebar to continue the lecture without network delays."
                )

    # 4. Results Section: BEFORE vs AFTER Columns
    if "diagnose_result" in st.session_state and st.session_state["diagnose_result"]:
        res = st.session_state["diagnose_result"]
        st.markdown("<div style='margin-top: 24px;'></div>", unsafe_allow_html=True)

        # Issues pill summary
        issues = res.get("issues", [])
        if issues:
            st.markdown(f"**Identified Weaknesses ({len(issues)} detected):**")
            badge_html = " ".join([
                f'<span class="badge-red" style="margin-right: 6px; margin-bottom: 6px; display: inline-block;">⚠️ {item.get("category", "")}: {item.get("explanation", "")}</span>'
                for item in issues
            ])
            st.markdown(f"<div style='margin-bottom: 20px;'>{badge_html}</div>", unsafe_allow_html=True)

        # Rewritten prompt callout
        st.markdown("**✨ Engineered Prompt Formula:**")
        st.code(res.get("rewritten_prompt", ""), language="markdown")

        # Two Columns: BEFORE (light red tint) vs AFTER (light green tint)
        col_before, col_after = st.columns(2)

        with col_before:
            st.markdown(
                f"""
                <div class="before-card">
                    <div class="before-header">
                        <span>❌ BEFORE (Original Prompt Output)</span>
                    </div>
                    <div class="before-content">{res.get("original_output", "")}</div>
                </div>
                """,
                unsafe_allow_html=True
            )

        with col_after:
            st.markdown(
                f"""
                <div class="after-card">
                    <div class="after-header">
                        <span>✅ AFTER (Rewritten Prompt Output)</span>
                    </div>
                    <div class="after-content">{res.get("rewritten_output", "")}</div>
                </div>
                """,
                unsafe_allow_html=True
            )

        # 5. "Show Prompts Used" Expander at bottom
        with st.expander("🔬 Show Prompts Used (Behind the Scenes)", expanded=False):
            st.markdown("##### 1. Diagnosis System Instruction:")
            st.code(res.get("diagnose_system_sent", ""), language="text")

            st.markdown("##### 2. Diagnosis User Prompt:")
            st.code(res.get("diagnose_user_sent", ""), language="text")

            st.markdown("##### 3. Step 2 Comparative Prompts:")
            st.code(
                f"-- [CALL A: ORIGINAL] --\nUser: {res.get('original_prompt')}\n\n"
                f"-- [CALL B: REWRITTEN] --\nUser: {res.get('rewritten_prompt_sent')}",
                language="text"
            )
    else:
        render_empty_state(
            icon="🩺",
            title="Ready for Prompt Diagnosis",
            subtitle="Click 'Load demo example' above or paste any vague instruction to see how prompt engineering transforms the output."
        )
