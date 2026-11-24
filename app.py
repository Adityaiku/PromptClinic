"""
app.py
Prompt Clinic - Streamlit Educational Application
Designed for live classroom demonstrations in Prompt Engineering.

Architecture:
- 5 Modular Tabs demonstrating core prompt engineering techniques.
- Resilient sidebar controls: Temperature slider & Offline Demo Mode toggle.
- Clear error handling, visible prompts expander, and student-friendly layout.
"""

import os
import streamlit as st
from dotenv import load_dotenv

# Load environment variables (.env)
load_dotenv(override=True)

# Import tab renderers
from tabs import (
    render_diagnose_tab,
    render_verify_tab,
    render_remember_tab,
    render_voice_tab,
    render_defend_tab,
)

# ------------------------------------------------------------------------------
# PAGE CONFIGURATION & STYLING
# ------------------------------------------------------------------------------
st.set_page_config(
    page_title="Prompt Clinic | Prompt Engineering Live Demo",
    page_icon="🩺",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Clean, professional styling for classroom presentation
st.markdown(
    """
    <style>
    /* Metric and card accents */
    .metric-box {
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 12px;
    }
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
    }
    .stTabs [data-baseweb="tab"] {
        padding: 8px 16px;
        font-weight: 500;
        border-radius: 4px;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# ------------------------------------------------------------------------------
# SIDEBAR CONFIGURATION
# ------------------------------------------------------------------------------
with st.sidebar:
    st.title("🩺 Prompt Clinic")
    st.caption("Interactive Prompt Engineering Lab for College Students")
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

    # Demo Mode Toggle
    # Essential for live lecture reliability when Wi-Fi is spotty or API keys are not yet configured
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
    st.caption("Prompt Clinic • Gemini API • Streamlit")


# ------------------------------------------------------------------------------
# MAIN CONTENT: 5 INTERACTIVE TABS
# ------------------------------------------------------------------------------
st.header("🩺 Prompt Clinic")
st.markdown(
    "Explore how structured prompt engineering techniques eliminate common LLM failure modes. "
    "Every tab exposes the actual prompt templates used behind the scenes."
)

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
