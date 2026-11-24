"""
tabs/defend.py
Tab 5: Defend (Prompt Shield) - Stub for Phase 5

Technique: Delimited Defense & Instruction Hierarchy
Problem: Untrusted user input can hijack model instructions (Prompt Injection).
Solution: Structural delimiters, strict data-instruction separation, and defense guards.
"""

import streamlit as st


def render_defend_tab(temperature: float, demo_mode: bool):
    """Renders the Tab 5: Defend (Prompt Shield) placeholder."""
    st.markdown("### 🛡️ Tab 5: Defend (Prompt Shield)")
    st.caption(
        "**Technique:** Structural Sandboxing & Instruction Hierarchy. Defends against indirect prompt injections "
        "by treating document inputs strictly as passive data."
    )

    st.info(
        "🛠️ **Tab 5 is queued for Phase 5.**\n\n"
        "This tab will pit naive vs defended prompts against simulated prompt injections with automated pass/fail badges."
    )
