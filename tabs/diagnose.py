"""
tabs/diagnose.py
Tab 1: Diagnose (Prompt Doctor)

Technique: Systematic Prompt Diagnosis & Remediation
Problem: Users often submit underspecified prompts lacking role, context, format, or constraints.
Solution:
  - Step 1: LLM analyzes the weak prompt, returning structured JSON with categorized issues and a rewritten prompt.
  - Step 2: Run both the original and rewritten prompt through the LLM, showing outputs side-by-side.
"""

import json
import os
import streamlit as st
from prompts import DIAGNOSE_SYSTEM_PROMPT, DIAGNOSE_USER_PROMPT_TEMPLATE
from llm import ask


def load_demo_data():
    """Loads cached demonstration data from demo_data/diagnose_demo.json."""
    demo_file = os.path.join(os.path.dirname(__file__), "..", "demo_data", "diagnose_demo.json")
    try:
        with open(demo_file, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        st.error(f"Failed to load demo data: {e}")
        return None


def get_category_color(category: str) -> str:
    """Returns a CSS style color badge based on the issue category."""
    category_normalized = category.lower().strip()
    colors = {
        "missing role": "#8b5cf6",         # Purple
        "missing context": "#3b82f6",      # Blue
        "missing format": "#10b981",       # Green
        "missing constraints": "#f59e0b", # Amber
        "no examples": "#06b6d4",          # Cyan
        "ambiguity": "#ef4444",            # Red
    }
    return colors.get(category_normalized, "#6b7280")


def render_diagnose_tab(temperature: float, demo_mode: bool):
    """Renders the Tab 1: Diagnose (Prompt Doctor) UI."""

    # Tab Overview Header
    st.markdown("### 🩺 Tab 1: Prompt Doctor (Diagnose & Rewrite)")
    st.caption(
        "**Technique:** Structural Prompt Decomposition. Detects missing ingredients "
        "(Role, Context, Format, Constraints, Examples, Clarity) and contrasts the original vs improved outputs."
    )

    demo_data = load_demo_data()

    # Pre-populate session state if not set
    if "diagnose_input" not in st.session_state:
        st.session_state["diagnose_input"] = ""

    # Top Controls Row
    col_input_hdr, col_btn = st.columns([4, 1])
    with col_input_hdr:
        st.markdown("**Enter a prompt to diagnose:**")
    with col_btn:
        if st.button("📋 Load demo example", use_container_width=True, help="Load a classic underspecified prompt"):
            if demo_data:
                st.session_state["diagnose_input"] = demo_data.get("weak_prompt", "")
                st.rerun()

    # Input Text Area
    user_prompt = st.text_area(
        label="Prompt to diagnose",
        value=st.session_state["diagnose_input"],
        height=100,
        placeholder="e.g. Write an email to my team about the project",
        label_visibility="collapsed"
    )
    # Sync typed text to session state
    st.session_state["diagnose_input"] = user_prompt

    # Action Button
    run_diagnosis = st.button("🔍 Diagnose & Compare Outputs", type="primary", use_container_width=False)

    # Trigger processing
    if run_diagnosis:
        if not user_prompt.strip():
            st.warning("Please enter or load a prompt first.")
            return

        with st.spinner("Diagnosing prompt weaknesses and generating comparison outputs..."):
            try:
                # Prepare diagnosis prompt payloads
                diagnose_system = DIAGNOSE_SYSTEM_PROMPT
                diagnose_user = DIAGNOSE_USER_PROMPT_TEMPLATE.format(prompt=user_prompt)

                # Prepare fallback demo data string if running in demo mode
                demo_diag_str = json.dumps(demo_data.get("diagnosis", {})) if demo_data else None

                # STEP 1: Ask model for structured JSON diagnosis
                diag_raw_response = ask(
                    system=diagnose_system,
                    user=diagnose_user,
                    temperature=temperature,
                    json_mode=True,
                    demo_mode=demo_mode,
                    demo_data=demo_diag_str
                )

                # Parse the JSON response
                # Clean any accidental markdown backticks
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

                # STEP 2: Execute both original and rewritten prompts
                # Original Prompt Execution
                original_demo = demo_data.get("original_output", "") if demo_data else None
                original_output = ask(
                    system="You are a helpful assistant.",
                    user=user_prompt,
                    temperature=temperature,
                    json_mode=False,
                    demo_mode=demo_mode,
                    demo_data=original_demo
                )

                # Rewritten Prompt Execution
                rewritten_demo = demo_data.get("rewritten_output", "") if demo_data else None
                rewritten_output = ask(
                    system="You are a helpful assistant.",
                    user=rewritten_prompt,
                    temperature=temperature,
                    json_mode=False,
                    demo_mode=demo_mode,
                    demo_data=rewritten_demo
                )

                # Save everything in session state for reliable display
                st.session_state["diagnose_result"] = {
                    "original_prompt": user_prompt,
                    "issues": diagnosis_json.get("issues", []),
                    "rewritten_prompt": rewritten_prompt,
                    "original_output": original_output,
                    "rewritten_output": rewritten_output,
                    "diagnose_system_sent": diagnose_system,
                    "diagnose_user_sent": diagnose_user,
                    "rewritten_prompt_sent": rewritten_prompt,
                }

            except json.JSONDecodeError as jde:
                st.error(f"Failed to parse LLM diagnosis as JSON: {jde}\nRaw output: {diag_raw_response}")
            except Exception as ex:
                st.error(f"Error during diagnosis: {ex}")

    # ==========================================================================
    # DISPLAY RESULTS
    # ==========================================================================
    if "diagnose_result" in st.session_state and st.session_state["diagnose_result"]:
        res = st.session_state["diagnose_result"]

        st.divider()

        # Section 1: Identified Issues
        st.markdown("#### 🔍 Step 1: Prompt Diagnosis")
        issues = res.get("issues", [])
        if issues:
            st.markdown(f"Found **{len(issues)} prompt weaknesses** in the original prompt:")
            for item in issues:
                cat = item.get("category", "unspecified")
                exp = item.get("explanation", "")
                cat_color = get_category_color(cat)

                st.markdown(
                    f"""
                    <div style="background-color: #f8fafc; border-left: 4px solid {cat_color}; 
                                padding: 10px 14px; margin-bottom: 8px; border-radius: 4px;">
                        <span style="background-color: {cat_color}; color: white; padding: 2px 8px; 
                                     border-radius: 4px; font-size: 0.78rem; font-weight: 600; text-transform: uppercase;">
                            {cat}
                        </span>
                        <span style="margin-left: 8px; color: #1e293b; font-size: 0.95rem;">
                            {exp}
                        </span>
                    </div>
                    """,
                    unsafe_allow_html=True
                )
        else:
            st.info("No specific weaknesses detected.")

        # Section 2: Rewritten Prompt Callout
        st.markdown("#### ✨ Step 2: Improved Prompt Formulation")
        st.code(res.get("rewritten_prompt", ""), language="markdown")

        # Section 3: Side-by-Side Output Comparison
        st.markdown("#### ⚖️ Step 3: Live Output Comparison")
        col_orig, col_rewritten = st.columns(2)

        with col_orig:
            st.markdown(
                """
                <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 6px; padding: 8px 12px; margin-bottom: 8px;">
                    <b style="color: #9f1239;">❌ Original Prompt Output</b><br/>
                    <small style="color: #881337;">Vague context yields generic, templated responses.</small>
                </div>
                """,
                unsafe_allow_html=True
            )
            st.markdown(res.get("original_output", ""))

        with col_rewritten:
            st.markdown(
                """
                <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 8px 12px; margin-bottom: 8px;">
                    <b style="color: #166534;">✅ Rewritten Prompt Output</b><br/>
                    <small style="color: #14532d;">Structured instructions yield actionable, professional results.</small>
                </div>
                """,
                unsafe_allow_html=True
            )
            st.markdown(res.get("rewritten_output", ""))

        # Section 4: "Show Prompts Used" Inspection Expander (Required for educational demo)
        with st.expander("🔬 Show Prompts Used (Behind the Scenes)", expanded=False):
            st.markdown("##### 1. Diagnosis System Prompt:")
            st.code(res.get("diagnose_system_sent", ""), language="text")

            st.markdown("##### 2. Diagnosis User Prompt:")
            st.code(res.get("diagnose_user_sent", ""), language="text")

            st.markdown("##### 3. Step 2 Comparison Prompt Sent:")
            st.code(
                f"-- [CALL A: ORIGINAL] --\nUser: {res.get('original_prompt')}\n\n"
                f"-- [CALL B: REWRITTEN] --\nUser: {res.get('rewritten_prompt_sent')}",
                language="text"
            )
