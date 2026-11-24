"""
app.py
Prompt Clinic - Streamlit Educational Application
Designed for live classroom demonstrations in Prompt Engineering.

Restyled to match the Prompt Clinic landing page design system:
- Deep link: reads st.query_params["module"] (diagnose, verify, remember, voice, defend)
- Pill-style selector (st.segmented_control) at top, synchronizing with query params
- Top-right 'Back to Prompt Clinic home' link using SITE_URL from .env
- Renders ONLY the selected module
- Large readable text (18px+) for projectors
- Friendly empty, loading and error states with no raw tracebacks
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

# Inject custom CSS (Inter font, Material icon fix, 24px cards, soft shadows)
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
# MAIN CONTENT HEADER & TOP-RIGHT HOME LINK
# ------------------------------------------------------------------------------
site_url = os.getenv("SITE_URL", "http://localhost:5173").strip() or "http://localhost:5173"

col_title, col_link = st.columns([3, 1])

with col_title:
    st.markdown(
        """
        <div style="margin-bottom: 16px;">
            <h1 style="font-size: 38px; font-weight: 900; color: #0F172A; letter-spacing: -0.03em; margin: 0 0 6px 0;">
                Prompt Clinic 🩺
            </h1>
            <p style="font-size: 19px; color: #64748B; margin: 0; line-height: 1.5;">
                Master 5 core prompt engineering techniques through live side-by-side contrast.
            </p>
        </div>
        """,
        unsafe_allow_html=True
    )

with col_link:
    st.markdown(
        f"""
        <div style="text-align: right; padding-top: 8px;">
            <a href="{site_url}" target="_blank" style="
                display: inline-flex; align-items: center; gap: 8px;
                background-color: #FFFFFF; color: #2563EB;
                border: 1px solid #E2E8F0; border-radius: 14px;
                padding: 10px 18px; font-size: 15px; font-weight: 600;
                text-decoration: none; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
                transition: all 0.2s ease;">
                <span style="font-size: 16px;">←</span>
                <span>Back to Prompt Clinic home</span>
            </a>
        </div>
        """,
        unsafe_allow_html=True
    )

# ------------------------------------------------------------------------------
# DEEP LINK & PILL-STYLE SELECTOR
# ------------------------------------------------------------------------------
MODULE_KEYS = ["diagnose", "verify", "remember", "voice", "defend"]
MODULE_LABELS = {
    "diagnose": "🩺 1. Diagnose",
    "verify": "🔍 2. Verify",
    "remember": "🧠 3. Remember",
    "voice": "🎨 4. Voice",
    "defend": "🛡️ 5. Defend",
}

# 1. Read query parameter ?module=...
raw_param = st.query_params.get("module", "diagnose")
url_module = raw_param.lower().strip() if raw_param else "diagnose"
if url_module not in MODULE_KEYS:
    url_module = "diagnose"

# Keep track of active module in session state
if "active_module" not in st.session_state:
    st.session_state["active_module"] = url_module
elif st.query_params.get("module") and st.query_params.get("module").lower() in MODULE_KEYS:
    if st.query_params.get("module").lower() != st.session_state["active_module"]:
        st.session_state["active_module"] = st.query_params.get("module").lower()

def on_module_change():
    chosen = st.session_state.get("active_module_selector")
    if chosen and chosen in MODULE_KEYS:
        st.session_state["active_module"] = chosen
        st.query_params["module"] = chosen

# 2. Pill selector via st.segmented_control
selected_module = st.segmented_control(
    label="Prompt Clinic Modules",
    options=MODULE_KEYS,
    format_func=lambda k: MODULE_LABELS.get(k, k),
    default=st.session_state["active_module"],
    selection_mode="single",
    label_visibility="collapsed",
    key="active_module_selector",
    on_change=on_module_change,
)

if not selected_module:
    selected_module = st.session_state["active_module"]

# Ensure query param in browser reflects active module
if st.query_params.get("module") != selected_module:
    st.query_params["module"] = selected_module

# ------------------------------------------------------------------------------
# RENDER ONLY THE SELECTED MODULE
# ------------------------------------------------------------------------------
if selected_module == "diagnose":
    render_diagnose_tab(temperature=temperature, demo_mode=demo_mode)
elif selected_module == "verify":
    render_verify_tab(temperature=temperature, demo_mode=demo_mode)
elif selected_module == "remember":
    render_remember_tab(temperature=temperature, demo_mode=demo_mode)
elif selected_module == "voice":
    render_voice_tab(temperature=temperature, demo_mode=demo_mode)
elif selected_module == "defend":
    render_defend_tab(temperature=temperature, demo_mode=demo_mode)
