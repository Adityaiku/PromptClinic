"""
tabs/diagnose.py
Tab 1: Diagnose (Prompt Doctor)
Technique: Prompt Decomposition (Role, Context, Format, Constraints)

Redesigned into focused numbered-step cards fitting 1080p:
1. Input Weak Prompt (with Load demo example and Blue Run button)
2. Diagnosis & Engineered Prompt (Prompt Strength score before/after, categorized issue chips, highlighted rewritten prompt)
3. Comparative Outputs (Side-by-side BEFORE/AFTER columns with capped height for 1080p fit)
4. Show prompts used expander at the bottom
"""

import json
import os
import streamlit as st
from prompts import DIAGNOSE_SYSTEM_PROMPT, DIAGNOSE_USER_PROMPT_TEMPLATE
from llm import ask
from styles import (
    render_problem_card,
    render_empty_state,
    render_error_card,
    render_step_header,
    render_prompt_strength,
    render_issue_chips,
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
    """Renders the Diagnose module page with focused numbered steps."""
    demo_data = load_demo_data()

    # Session state initialization
    if "diagnose_input" not in st.session_state:
        st.session_state["diagnose_input"] = ""

    # 1. Technique Overview / Problem Notice Card
    render_problem_card(
        "Underspecified prompts lack role, context, format, or constraints, forcing the AI to guess your intent and generate vague, generic output."
    )

    # --------------------------------------------------------------------------
    # STEP 1: INPUT WEAK PROMPT
    # --------------------------------------------------------------------------
    st.markdown('<div class="step-card">', unsafe_allow_html=True)
    render_step_header(1, "Input Weak Prompt", "Paste a weak instruction to diagnose and reconstruct")

    # Input action buttons
    col_input_label, col_btn_demo = st.columns([3, 1], vertical_alignment="center")
    with col_input_label:
        st.markdown("**Enter a weak prompt to diagnose:**")
    with col_btn_demo:
        if st.button("📋 Load demo example", key="btn_diagnose_demo", use_container_width=True):
            if demo_data:
                st.session_state["diagnose_input"] = demo_data.get("weak_prompt", "")
                st.rerun()

    user_prompt = st.text_area(
        label="Prompt to diagnose",
        value=st.session_state["diagnose_input"],
        height=100,
        placeholder="e.g. Write an email to my team about the project",
        label_visibility="collapsed",
    )
    st.session_state["diagnose_input"] = user_prompt

    run_diagnosis = st.button(
        "🔍 Diagnose Prompt & Compare Outputs",
        type="primary",
        key="btn_diagnose_run",
        use_container_width=True,
    )
    st.markdown('</div>', unsafe_allow_html=True)

    # --------------------------------------------------------------------------
    # EXECUTION HANDLING (using st.status for progress)
    # --------------------------------------------------------------------------
    if run_diagnosis:
        if not user_prompt.strip():
            st.warning("⚠️ Please enter or load a prompt first.")
            return

        with st.status("🩺 Diagnosing prompt and generating comparative outputs...", expanded=True) as status:
            try:
                diagnose_system = DIAGNOSE_SYSTEM_PROMPT
                diagnose_user = DIAGNOSE_USER_PROMPT_TEMPLATE.format(prompt=user_prompt)
                demo_diag_str = json.dumps(demo_data.get("diagnosis", {})) if demo_data else None

                # Step 1: Diagnose prompt weaknesses
                status.write("🔍 Analyzing prompt engineering weaknesses...")
                diag_raw_response = ask(
                    system=diagnose_system,
                    user=diagnose_user,
                    temperature=temperature,
                    json_mode=True,
                    demo_mode=demo_mode,
                    demo_data=demo_diag_str,
                )

                # Clean markdown JSON wrapping if present
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
                prompt_strength = diagnosis_json.get(
                    "prompt_strength",
                    {"before": 3, "after": 9}
                )

                # Step 2: Comparative outputs (Original vs Rewritten)
                status.write("⚡ Synthesizing expert rewritten prompt and scoring strength...")
                orig_demo = demo_data.get("original_output", "") if demo_data else None
                status.write("⚖️ Generating BEFORE output (original prompt)...")
                orig_output = ask(
                    system="You are a helpful assistant.",
                    user=user_prompt,
                    temperature=temperature,
                    json_mode=False,
                    demo_mode=demo_mode,
                    demo_data=orig_demo,
                )

                status.write("⚖️ Generating AFTER output (rewritten prompt)...")
                rewritten_demo = demo_data.get("rewritten_output", "") if demo_data else None
                rewritten_output = ask(
                    system="You are a helpful assistant.",
                    user=rewritten_prompt,
                    temperature=temperature,
                    json_mode=False,
                    demo_mode=demo_mode,
                    demo_data=rewritten_demo,
                )

                status.update(
                    label="✅ Diagnosis and comparative outputs generated successfully!",
                    state="complete",
                    expanded=False,
                )

                st.session_state["diagnose_result"] = {
                    "original_prompt": user_prompt,
                    "issues": diagnosis_json.get("issues", []),
                    "prompt_strength": prompt_strength,
                    "rewritten_prompt": rewritten_prompt,
                    "original_output": orig_output,
                    "rewritten_output": rewritten_output,
                    "diagnose_system_sent": diagnose_system,
                    "diagnose_user_sent": diagnose_user,
                    "rewritten_prompt_sent": rewritten_prompt,
                }

            except json.JSONDecodeError:
                status.update(label="❌ Failed to parse response", state="error", expanded=False)
                render_error_card(
                    "Parsing Error",
                    "The model's diagnostic response could not be parsed as valid JSON.",
                    "Toggle 'Offline Demo Mode' in Settings (top bar) for guaranteed pre-cached execution."
                )
            except Exception as ex:
                status.update(label="❌ Execution failed", state="error", expanded=False)
                render_error_card(
                    "Execution Notice",
                    str(ex),
                    "Switch on 'Offline Demo Mode' in Settings (top bar) to continue without network delays."
                )

    # --------------------------------------------------------------------------
    # STEP 2 & 3: RESULTS (Prompt Strength, Issues, Rewritten Prompt, Side-by-Side)
    # --------------------------------------------------------------------------
    if "diagnose_result" in st.session_state and st.session_state["diagnose_result"]:
        res = st.session_state["diagnose_result"]

        # STEP 2 CARD: Diagnosis & Engineered Prompt
        st.markdown('<div class="step-card">', unsafe_allow_html=True)
        render_step_header(2, "Diagnosis & Engineered Prompt", "Weaknesses diagnosed and expert prompt synthesized")

        # 1. Prompt Strength Score Meter (e.g. 3/10 -> 9/10)
        strength = res.get("prompt_strength", {})
        before_score = strength.get("before", 3)
        after_score = strength.get("after", 9)
        render_prompt_strength(before_score, after_score)

        # 2. Categorized Issue Chips
        issues = res.get("issues", [])
        render_issue_chips(issues)

        # 3. Rewritten Prompt Box
        st.markdown(
            f"""
            <div class="rewritten-box">
                <div class="rewritten-box-title">
                    <span>✨ EXPERT REWRITTEN PROMPT (PRODUCTION-READY)</span>
                </div>
                <div class="rewritten-box-content">{res.get("rewritten_prompt", "")}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )
        st.markdown('</div>', unsafe_allow_html=True)

        # STEP 3 CARD: Comparative Outputs (Side-by-Side)
        st.markdown('<div class="step-card">', unsafe_allow_html=True)
        render_step_header(3, "Comparative Outputs", "Direct BEFORE vs AFTER contrast on the exact same model")

        col_before, col_after = st.columns(2)

        with col_before:
            st.markdown(
                f"""
                <div class="before-card">
                    <div class="before-header">
                        <span>❌ BEFORE (Original Prompt Output)</span>
                    </div>
                    <div class="before-content comparison-scroll">{res.get("original_output", "")}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )

        with col_after:
            st.markdown(
                f"""
                <div class="after-card">
                    <div class="after-header">
                        <span>✅ AFTER (Rewritten Prompt Output)</span>
                    </div>
                    <div class="after-content comparison-scroll">{res.get("rewritten_output", "")}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )
        st.markdown('</div>', unsafe_allow_html=True)

    else:
        render_empty_state(
            icon="🩺",
            title="Ready for Prompt Diagnosis",
            subtitle="Click 'Load demo example' above or enter any prompt to see how prompt decomposition diagnoses gaps and generates an engineered rewrite.",
        )

    # --------------------------------------------------------------------------
    # BOTTOM EXPANDER: "Show prompts used"
    # --------------------------------------------------------------------------
    res = st.session_state.get("diagnose_result", {})
    with st.expander("🔬 Show Prompts Used (Behind the Scenes)", expanded=False):
        st.markdown("##### 1. Diagnosis System Instruction:")
        st.code(res.get("diagnose_system_sent", DIAGNOSE_SYSTEM_PROMPT), language="text")

        st.markdown("##### 2. Diagnosis User Prompt:")
        st.code(
            res.get(
                "diagnose_user_sent",
                DIAGNOSE_USER_PROMPT_TEMPLATE.format(prompt="[user prompt here]"),
            ),
            language="text",
        )

        st.markdown("##### 3. Step 2 Comparative Prompts:")
        orig_p = res.get("original_prompt", "[original user prompt]")
        rewritten_p = res.get("rewritten_prompt_sent", "[rewritten prompt]")
        st.code(
            f"-- [CALL A: ORIGINAL] --\nUser: {orig_p}\n\n"
            f"-- [CALL B: REWRITTEN] --\nUser: {rewritten_p}",
            language="text",
        )
