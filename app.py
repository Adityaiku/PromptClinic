"""
app.py
Prompt Clinic - Streamlit Educational Application
Designed for live classroom demonstrations in Prompt Engineering.

Redesigned shared page shell:
- Slim top bar: "<- Home" link (SITE_URL), module icon + name + technique badge,
  "Switch module" popover, and "Settings" popover.
- Sidebar collapsed by default.
- Deep linking via ?module=<slug> (diagnose, verify, remember, voice, defend).
- Clean viewport with Streamlit menu, footer, and deploy buttons hidden.
- Each module renders as a focused, numbered-step flow.
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
    initial_sidebar_state="collapsed",
)

# Inject custom CSS (Inter font, chrome hiding, cards, badges, 1080p fit)
apply_styles()

# ------------------------------------------------------------------------------
# MODULE DEFINITIONS & METADATA
# ------------------------------------------------------------------------------
MODULES = {
    "diagnose": {
        "num": "01",
        "name": "Diagnose",
        "icon": "🩺",
        "technique": "Prompt decomposition",
        "tagline": "Check up your prompt",
        "desc": "Find missing role, context, format, or constraints and rewrite weak prompts.",
        "render": render_diagnose_tab,
    },
    "verify": {
        "num": "02",
        "name": "Verify",
        "icon": "🔍",
        "technique": "Chain-of-verification",
        "tagline": "Can you trust this answer?",
        "desc": "Splits an answer into claims and flags the shaky ones with a confidence rating.",
        "render": render_verify_tab,
    },
    "remember": {
        "num": "03",
        "name": "Remember",
        "icon": "🧠",
        "technique": "Structured summarization",
        "tagline": "Save your chat's memory",
        "desc": "Turns a long chat into a context card you can paste into a fresh chat.",
        "render": render_remember_tab,
    },
    "voice": {
        "num": "04",
        "name": "Voice",
        "icon": "🎭",
        "technique": "Few-shot style transfer",
        "tagline": "Write like you",
        "desc": "Learns your writing style from 3 samples and rewrites any draft in your voice.",
        "render": render_voice_tab,
    },
    "defend": {
        "num": "05",
        "name": "Defend",
        "icon": "🛡️",
        "technique": "Delimited defense",
        "tagline": "Stop prompt hijacking",
        "desc": "Protects against prompt injection attacks hidden in untrusted text documents.",
        "render": render_defend_tab,
    },
}

# ------------------------------------------------------------------------------
# DEEP LINK ROUTING (?module=<slug>)
# ------------------------------------------------------------------------------
query_module = st.query_params.get("module", "diagnose")
if isinstance(query_module, list):
    query_module = query_module[0] if query_module else "diagnose"
query_module = str(query_module).lower().strip()

if query_module not in MODULES:
    query_module = "diagnose"
    st.query_params["module"] = "diagnose"

current_mod = MODULES[query_module]

# ------------------------------------------------------------------------------
# SESSION STATE INITIALIZATION
# ------------------------------------------------------------------------------
if "temperature" not in st.session_state:
    st.session_state["temperature"] = 0.7

if "demo_mode" not in st.session_state:
    st.session_state["demo_mode"] = False

# ------------------------------------------------------------------------------
# SLIM TOP BAR
# ------------------------------------------------------------------------------
site_url = os.getenv("SITE_URL", "http://localhost:3000").strip() or "http://localhost:3000"

col_left, col_switch, col_settings = st.columns([6, 2, 2], vertical_alignment="center")

with col_left:
    st.markdown(
        f"""
        <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap; padding: 4px 0;">
            <a href="{site_url}" target="_blank" style="
                display: inline-flex; align-items: center; gap: 6px;
                background-color: #FFFFFF; color: #0F172A;
                border: 1px solid #E2E8F0; border-radius: 12px;
                padding: 7px 15px; font-size: 14px; font-weight: 700;
                text-decoration: none; box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
                transition: all 0.2s ease;">
                <span style="font-size: 15px; color: #2563EB;">←</span> Home
            </a>
            <div style="display: inline-flex; align-items: center; gap: 10px;">
                <span style="font-size: 26px; line-height: 1;">{current_mod['icon']}</span>
                <span style="font-size: 24px; font-weight: 800; color: #0F172A; letter-spacing: -0.02em;">
                    {current_mod['name']}
                </span>
                <span class="clinic-pill" style="margin: 0; font-size: 12px; padding: 3px 12px;">
                    {current_mod['technique']}
                </span>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

with col_switch:
    with st.popover("🔀 Switch module", use_container_width=True):
        st.markdown(
            "<div style='font-size: 14px; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 8px;'>Select Module</div>",
            unsafe_allow_html=True,
        )
        for slug, mod in MODULES.items():
            is_active = slug == query_module
            label = f"{mod['icon']} {mod['num']} {mod['name']} {'✓' if is_active else ''}"
            help_text = f"{mod['technique']} — {mod['tagline']}"
            if st.button(
                label,
                key=f"switch_to_{slug}",
                use_container_width=True,
                disabled=is_active,
                help=help_text,
            ):
                st.query_params["module"] = slug
                st.rerun()

with col_settings:
    with st.popover("⚙️ Settings", use_container_width=True):
        st.markdown(
            "<div style='font-size: 14px; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 8px;'>Engine Controls</div>",
            unsafe_allow_html=True,
        )

        # Temperature slider
        temp_val = st.slider(
            "Temperature",
            min_value=0.0,
            max_value=1.0,
            value=float(st.session_state["temperature"]),
            step=0.05,
            help="0.0 = Deterministic & focused. 1.0 = Creative & diverse.",
            key="temp_control",
        )
        st.session_state["temperature"] = temp_val

        # Offline Demo Mode toggle
        demo_val = st.toggle(
            "Offline Demo Mode",
            value=bool(st.session_state["demo_mode"]),
            help="Replays pre-computed classroom examples with zero network requests.",
            key="demo_control",
        )
        st.session_state["demo_mode"] = demo_val

        st.divider()

        # Connection status
        st.markdown(
            "<div style='font-size: 13px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 6px;'>Connection Status</div>",
            unsafe_allow_html=True,
        )
        api_key = os.getenv("GEMINI_API_KEY", "").strip()
        model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip() or "gemini-2.5-flash"

        if demo_val:
            st.warning("⚠️ **Demo Mode Active**\n\nZero API calls (Pre-cached dataset)")
        elif api_key:
            st.success(f"✅ **Gemini API Connected**\n\nModel: `{model_name}`")
        else:
            st.error("❌ **No API Key Found** in `.env`")
            st.caption("Tip: Turn on Offline Demo Mode above for zero-config testing!")

# Top bar bottom divider
st.markdown("<div style='border-bottom: 1px solid #E2E8F0; margin-top: 6px; margin-bottom: 22px;'></div>", unsafe_allow_html=True)

# ------------------------------------------------------------------------------
# SIDEBAR (COLLAPSED BY DEFAULT - SUPPLEMENTAL INFO ONLY)
# ------------------------------------------------------------------------------
with st.sidebar:
    st.markdown(
        """
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <span style="font-size: 24px;">🩺</span>
            <div>
                <div style="font-size: 18px; font-weight: 800; color: #0F172A;">Prompt Clinic</div>
                <div style="font-size: 12px; color: #64748B;">Live Lab & Demonstrations</div>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    st.caption("Fix vague answers, false facts, lost context, and hijacked prompts.")
    st.divider()

    st.markdown(f"**Current Module:** {current_mod['icon']} {current_mod['name']}")
    st.caption(f"Technique: {current_mod['technique']}\n\n{current_mod['desc']}")

    st.divider()
    st.markdown(
        f"""
        <div style="font-size: 13px; color: #94A3B8; text-align: center;">
            <a href="{site_url}" target="_blank" style="color: #2563EB; font-weight: 600; text-decoration: none;">← Back to Landing Page</a><br><br>
            Designed for Projector Lectures
        </div>
        """,
        unsafe_allow_html=True,
    )

# ------------------------------------------------------------------------------
# RENDER ACTIVE MODULE
# ------------------------------------------------------------------------------
current_mod["render"](
    temperature=st.session_state["temperature"],
    demo_mode=st.session_state["demo_mode"],
)
