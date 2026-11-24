"""
app.py
Prompt Clinic - Streamlit Educational Application
Designed for live classroom demonstrations in Prompt Engineering.

Restyled to match the Prompt Clinic landing page design system:
- Font: Inter (18px+ readable text for projectors)
- Background: #FAFAFA, white cards with 24px radius and soft shadows
- Text: Navy #0F172A, Primary Blue #2563EB, Green (fixed/pass), Soft Red (problem/fail), Amber (uncertain)
- Every tab uses the identical template (pill, what goes wrong card, inputs, BEFORE/AFTER columns, prompt expander)
"""

import os
import streamlit as st
from dotenv import load_dotenv

# Load environment variables (.env)
load_dotenv(override=True)

# Import custom styling module
from styles import apply_styles

# Import tab renderers
from tabs import (
    render_diagnose_tab,
    render_verify_tab,
    render_remember_tab,
    render_voice_tab,
    render_defend_tab,
)

# ------------------------------------------------------------------------------
# PAGE CONFIGURATION
# ------------------------------------------------------------------------------
st.set_page_config(
    page_title="Prompt Clinic | Prompt Engineering Live Demo",
    page_icon="🩺",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Inject custom CSS (Inter font, 24px cards, soft shadows, 18px+ text)
apply_styles()

# ------------------------------------------------------------------------------
# SIDEBAR CONFIGURATION
# ------------------------------------------------------------------------------
with st.sidebar:
    st.markdown(
        """
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <div style="width: 42px; height: 42px; background: white; border-radius: 12px; 
                        box-shadow: 0 4px 12px rgba(15,23,42,0.08); border: 1px solid #e2e8f0; 
                        display: flex; align-items: center; justify-content: center; font-size: 22px;">
                🩺
            </div>
            <div>
                <div style="font-size: 20px; font-weight: 800; color: #0F172A; letter-spacing: -0.02em;">Prompt Clinic</div>
                <div style="font-size: 13px; color: #64748B; font-weight: 500;">Live Demo Lab</div>
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )
    st.caption("Fix vague answers, false facts, lost context, and hijacked prompts.")
    st.divider()

    st.subheader("⚙️ Engine Controls")

    # Temperature Slider
    temperature = st.slider(
        "Temperature",
        min_value=0.0,
        max_value=1.0,
        value=0.7,
        step=0.05,
        help="0.0 = Deterministic & focused. 1.0 = Creative & diverse."
    )

    # Offline Demo Mode Toggle
    demo_mode = st.toggle(
        "Offline Demo Mode",
        value=False,
        help="Replays pre-computed classroom examples with zero network requests."
    )

    st.divider()

    # Environment Status Indicator
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip() or "gemini-2.5-flash"

    st.subheader("🔌 Connection Status")
    if demo_mode:
        st.warning("⚠️ **Demo Mode Active** (Zero API calls)")
    elif api_key:
        st.success("✅ **Gemini API Connected**")
        st.caption(f"Model: `{model_name}`")
    else:
        st.error("❌ **No API Key Found** in `.env`")
        st.caption("Tip: Turn on **Demo Mode** above for zero-config testing!")

    st.divider()
    st.markdown(
        """
        <div style="font-size: 13px; color: #94A3B8; text-align: center;">
            Prompt Clinic • Gemini API • Streamlit<br>
            Designed for Projector Lectures
        </div>
        """,
        unsafe_allow_html=True
    )


# ------------------------------------------------------------------------------
# MAIN CONTENT HEADER
# ------------------------------------------------------------------------------
st.markdown(
    """
    <div style="margin-bottom: 24px;">
        <h1 style="font-size: 38px; font-weight: 900; color: #0F172A; letter-spacing: -0.03em; margin-bottom: 6px;">
            Prompt Clinic 🩺
        </h1>
        <p style="font-size: 19px; color: #64748B; margin: 0; line-height: 1.5;">
            Master 5 core prompt engineering techniques through live side-by-side contrast. Every tab reveals the exact prompts behind the scenes.
        </p>
    </div>
    """,
    unsafe_allow_html=True
)

# ------------------------------------------------------------------------------
# 5 INTERACTIVE TABS (Unified Visual Template)
# ------------------------------------------------------------------------------
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "🩺 1. Diagnose",
    "🔍 2. Verify",
    "🧠 3. Remember",
    "🎨 4. Voice",
    "🛡️ 5. Defend"
])

with tab1:
    render_diagnose_tab(temperature=temperature, demo_mode=demo_mode)

with tab2:
    render_verify_tab(temperature=temperature, demo_mode=demo_mode)

with tab3:
    render_remember_tab(temperature=temperature, demo_mode=demo_mode)

with tab4:
    render_voice_tab(temperature=temperature, demo_mode=demo_mode)

with tab5:
    render_defend_tab(temperature=temperature, demo_mode=demo_mode)
