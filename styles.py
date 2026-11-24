"""
styles.py
Central styling module for Prompt Clinic Streamlit app.
Matches the design system of the Prompt Clinic landing page:
- Font: Inter (18px+ readable text for projectors)
- Background: #FAFAFA
- Cards: 24px border-radius, soft diffuse shadow (0 10px 30px rgba(15,23,42,0.06))
- Colors: Navy #0F172A, Primary Blue #2563EB, Green #16A34A (pass/fixed),
  Soft Red #E11D48 (problem/fail), Amber #F59E0B (uncertain).
- Fixes Material Symbols icons font collision so sidebar arrows render properly.
"""

import streamlit as st

CUSTOM_CSS = """
<style>
/* -------------------------------------------------------------------------- */
/* FONT & GLOBAL TYPOGRAPHY                                                   */
/* -------------------------------------------------------------------------- */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

/* Apply Inter to normal text elements only */
html, body, .stApp, .stMarkdown, p, label, li, .stText, h1, h2, h3, h4, h5, h6,
span:not([data-testid="stIconMaterial"]):not(.material-symbols-rounded):not([class*="material-symbols"]) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
    color: #0F172A;
}

/* -------------------------------------------------------------------------- */
/* PRESERVE MATERIAL ICONS (FIX SIDEBAR GLITCH)                               */
/* Prevents 'keyboard_double_arrow_left' from showing as text                 */
/* -------------------------------------------------------------------------- */
[data-testid="stIconMaterial"],
.material-symbols-rounded,
[class*="material-symbols"],
button [data-testid="stIconMaterial"],
[data-testid="stSidebarCollapseButton"] span,
[data-testid="stSidebarCollapseButton"] [data-testid="stIconMaterial"] {
    font-family: 'Material Symbols Rounded' !important;
    font-weight: normal !important;
    font-style: normal !important;
    font-size: 24px !important;
    line-height: 1 !important;
    letter-spacing: normal !important;
    text-transform: none !important;
    display: inline-block !important;
    white-space: nowrap !important;
    word-wrap: normal !important;
    direction: ltr !important;
    -webkit-font-feature-settings: 'liga' 1 !important;
    -webkit-font-smoothing: antialiased !important;
}

/* Projector-ready font sizing: at least 18px body text */
.stMarkdown p, .stMarkdown li, .stText {
    font-size: 18px !important;
    line-height: 1.6 !important;
}

/* Background */
.stApp {
    background-color: #FAFAFA !important;
}

/* -------------------------------------------------------------------------- */
/* STREAMLIT CHROME HIDING (Keep Sidebar Toggle)                              */
/* -------------------------------------------------------------------------- */
#MainMenu { visibility: hidden !important; display: none !important; }
footer { visibility: hidden !important; display: none !important; }
header [data-testid="stToolbar"] { visibility: hidden !important; display: none !important; }
.stDeployButton { display: none !important; }
div[data-testid="stDecoration"] { display: none !important; }

/* Ensure header is transparent and click-through except for buttons */
header,
header.stAppHeader,
header[data-testid="stHeader"],
.stAppHeader,
[data-testid="stHeader"] {
    background: transparent !important;
    background-color: transparent !important;
    box-shadow: none !important;
    border: none !important;
    pointer-events: none !important;
}

/* Ensure sidebar collapse & expand toggle buttons remain visible and interactive */
[data-testid="stSidebarCollapseButton"],
[data-testid="stExpandSidebarButton"],
button[data-testid="stSidebarCollapseButton"],
button[data-testid="stExpandSidebarButton"] {
    visibility: visible !important;
    display: inline-flex !important;
    pointer-events: auto !important;
    z-index: 1000 !important;
}

/* Clean container spacing with top padding */
.stMainBlockContainer,
[data-testid="stMainBlockContainer"],
.block-container,
div.block-container,
div[class*="stMainBlockContainer"],
div[class*="block-container"] {
    padding-top: 2rem !important;
    padding-bottom: 3rem !important;
    padding-left: 2rem !important;
    padding-right: 2rem !important;
    max-width: 1400px !important;
}

/* -------------------------------------------------------------------------- */
/* PILL SELECTOR (st.segmented_control)                                       */
/* -------------------------------------------------------------------------- */
div[data-testid="stSegmentedControl"] {
    background-color: #f1f5f9 !important;
    padding: 6px !important;
    border-radius: 18px !important;
    border: 1px solid #e2e8f0 !important;
    gap: 8px !important;
    margin-bottom: 26px !important;
    display: flex !important;
    width: 100% !important;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03) !important;
}

div[data-testid="stSegmentedControl"] > div {
    flex: 1 1 0 !important;
}

div[data-testid="stSegmentedControl"] button {
    border-radius: 12px !important;
    font-size: 17px !important;
    font-weight: 600 !important;
    color: #64748B !important;
    background-color: transparent !important;
    border: none !important;
    padding: 10px 18px !important;
    transition: all 0.2s ease !important;
    width: 100% !important;
    text-align: center !important;
    cursor: pointer !important;
}

div[data-testid="stSegmentedControl"] button:hover {
    color: #0F172A !important;
    background-color: rgba(255, 255, 255, 0.6) !important;
}

div[data-testid="stSegmentedControl"] button[aria-selected="true"],
div[data-testid="stSegmentedControl"] button[data-checked="true"],
div[data-testid="stSegmentedControl"] button[aria-checked="true"] {
    background-color: #FFFFFF !important;
    color: #0F172A !important;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08) !important;
}

/* -------------------------------------------------------------------------- */
/* BUTTONS: Blue Run Button & Clean White Secondary                           */
/* -------------------------------------------------------------------------- */
.stButton > button[kind="primary"],
.stButton > button[data-testid="baseButton-primary"] {
    background-color: #2563EB !important;
    color: #FFFFFF !important;
    border: none !important;
    border-radius: 14px !important;
    font-size: 18px !important;
    font-weight: 600 !important;
    padding: 12px 28px !important;
    box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4) !important;
    transition: all 0.2s ease !important;
}
.stButton > button[kind="primary"]:hover,
.stButton > button[data-testid="baseButton-primary"]:hover {
    background-color: #1D4ED8 !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 14px 28px -4px rgba(37, 99, 235, 0.5) !important;
}

.stButton > button[kind="secondary"],
.stButton > button[data-testid="baseButton-secondary"],
.stButton > button:not([kind="primary"]) {
    background-color: #FFFFFF !important;
    color: #0F172A !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 14px !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    padding: 10px 20px !important;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04) !important;
    transition: all 0.2s ease !important;
}
.stButton > button:not([kind="primary"]):hover {
    background-color: #F8FAFC !important;
    border-color: #CBD5E1 !important;
    transform: translateY(-1px) !important;
}

/* -------------------------------------------------------------------------- */
/* INPUTS & TEXT AREAS                                                        */
/* -------------------------------------------------------------------------- */
.stTextArea textarea, .stTextInput input {
    background-color: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 16px !important;
    font-size: 18px !important;
    line-height: 1.5 !important;
    color: #0F172A !important;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.02) !important;
    padding: 14px 16px !important;
}
.stTextArea textarea:focus, .stTextInput input:focus {
    border-color: #2563EB !important;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
}

/* -------------------------------------------------------------------------- */
/* EXPANDER STYLING (Show Prompts Used)                                       */
/* -------------------------------------------------------------------------- */
.streamlit-expanderHeader {
    background-color: #FFFFFF !important;
    border-radius: 16px !important;
    font-size: 17px !important;
    font-weight: 600 !important;
    color: #0F172A !important;
    padding: 14px 20px !important;
    border: 1px solid #E2E8F0 !important;
}
details[data-testid="stExpander"] {
    background-color: #FFFFFF !important;
    border-radius: 18px !important;
    border: 1px solid #E2E8F0 !important;
    box-shadow: 0 6px 20px rgba(15, 23, 42, 0.03) !important;
    margin-top: 24px !important;
}

/* -------------------------------------------------------------------------- */
/* REUSABLE CLINIC CARDS (24px radius, soft shadow)                           */
/* -------------------------------------------------------------------------- */
.clinic-card {
    background-color: #FFFFFF;
    border-radius: 24px;
    border: 1px solid #E2E8F0;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
    margin-bottom: 20px;
}

/* Technique pill label */
.clinic-pill {
    display: inline-flex;
    align-items: center;
    padding: 4px 14px;
    background-color: #FFFFFF;
    border: 1px solid #CBD5E1;
    border-radius: 9999px;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #2563EB;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
    margin-bottom: 8px;
}

/* What goes wrong card */
.problem-card {
    background-color: #FFFFFF;
    border-radius: 18px;
    border: 1px solid #FEE2E2;
    border-left: 6px solid #EF4444;
    padding: 16px 20px;
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.06);
    margin-bottom: 20px;
}
.problem-card-title {
    font-size: 14px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #DC2626;
    margin-bottom: 4px;
}
.problem-card-desc {
    font-size: 18px;
    color: #1E293B;
    margin: 0;
    line-height: 1.5;
}

/* BEFORE card (light red tint) */
.before-card {
    background-color: #FFF1F2;
    border: 1.5px solid #FECDD3;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(225, 29, 72, 0.05);
    height: 100%;
    min-height: 280px;
}
.before-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 800;
    color: #9F1239;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #FECDD3;
}
.before-content {
    font-size: 18px;
    color: #1E293B;
    line-height: 1.6;
    white-space: pre-wrap;
}

/* AFTER card (light green tint) */
.after-card {
    background-color: #F0FDF4;
    border: 1.5px solid #BBF7D0;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(22, 163, 74, 0.05);
    height: 100%;
    min-height: 280px;
}
.after-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 800;
    color: #166534;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #BBF7D0;
}
.after-content {
    font-size: 18px;
    color: #1E293B;
    line-height: 1.6;
    white-space: pre-wrap;
}

/* Empty state card */
.empty-card {
    background-color: #FFFFFF;
    border: 2px dashed #CBD5E1;
    border-radius: 24px;
    padding: 40px 24px;
    text-align: center;
    color: #64748B;
    margin: 20px 0;
}
.empty-card-icon {
    font-size: 36px;
    margin-bottom: 8px;
}
.empty-card-title {
    font-size: 20px;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 6px;
}
.empty-card-text {
    font-size: 17px;
    color: #64748B;
    max-width: 520px;
    margin: 0 auto;
}

/* Friendly error card (no raw tracebacks) */
.error-card {
    background-color: #FFF1F2;
    border: 1.5px solid #FECDD3;
    border-left: 6px solid #E11D48;
    border-radius: 20px;
    padding: 20px;
    margin: 20px 0;
}
.error-card-title {
    font-size: 18px;
    font-weight: 800;
    color: #9F1239;
    margin-bottom: 6px;
}
.error-card-text {
    font-size: 16px;
    color: #4C0519;
    line-height: 1.5;
}

/* Badges for issues / claims */
.badge-red {
    background-color: #FFF1F2;
    color: #E11D48;
    border: 1px solid #FECDD3;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
}
.badge-green {
    background-color: #F0FDF4;
    color: #16A34A;
    border: 1px solid #BBF7D0;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
}
.badge-amber {
    background-color: #FFFBEB;
    color: #D97706;
    border: 1px solid #FDE68A;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
}

/* -------------------------------------------------------------------------- */
/* NUMBERED STEP CARDS & 1080P VIEWPORT OPTIMIZATIONS                         */
/* -------------------------------------------------------------------------- */
.step-card {
    background-color: #FFFFFF;
    border-radius: 24px;
    border: 1px solid #E2E8F0;
    padding: 22px 24px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
    margin-bottom: 20px;
}
.step-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
    padding-bottom: 12px;
    border-bottom: 1px solid #F1F5F9;
}
.step-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}
.step-badge {
    background-color: #EFF6FF;
    color: #2563EB;
    font-size: 14px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 10px;
    border: 1px solid #BFDBFE;
    letter-spacing: 0.02em;
}
.step-title {
    font-size: 20px;
    font-weight: 800;
    color: #0F172A;
    letter-spacing: -0.02em;
}
.step-subtitle {
    font-size: 15px;
    color: #64748B;
    font-weight: 500;
}

/* -------------------------------------------------------------------------- */
/* PROMPT STRENGTH SCORE METER                                                */
/* -------------------------------------------------------------------------- */
.strength-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 18px;
    padding: 16px 20px;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
}
.strength-item {
    display: flex;
    align-items: center;
    gap: 12px;
}
.strength-label {
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #64748B;
}
.strength-score-pill-before {
    background-color: #FFF1F2;
    color: #E11D48;
    border: 1px solid #FECDD3;
    padding: 6px 14px;
    border-radius: 12px;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.02em;
}
.strength-score-pill-after {
    background-color: #F0FDF4;
    color: #16A34A;
    border: 1px solid #BBF7D0;
    padding: 6px 14px;
    border-radius: 12px;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.02em;
}
.strength-arrow {
    font-size: 22px;
    color: #94A3B8;
    font-weight: 800;
}
.strength-delta {
    font-size: 14px;
    font-weight: 700;
    color: #16A34A;
    background: #DCFCE7;
    padding: 4px 10px;
    border-radius: 8px;
}

/* -------------------------------------------------------------------------- */
/* CATEGORIZED ISSUE CHIPS                                                    */
/* -------------------------------------------------------------------------- */
.issue-chips-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
}
.issue-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
}
.issue-chip-role { background-color: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE; }
.issue-chip-context { background-color: #FAF5FF; color: #7E22CE; border: 1px solid #E9D5FF; }
.issue-chip-format { background-color: #F0FDF4; color: #15803D; border: 1px solid #BBF7D0; }
.issue-chip-constraints { background-color: #FFF7ED; color: #C2410C; border: 1px solid #FFEDD5; }
.issue-chip-ambiguity { background-color: #FFF1F2; color: #BE123C; border: 1px solid #FECDD3; }
.issue-chip-examples { background-color: #FEFCE8; color: #A16207; border: 1px solid #FEF08A; }
.issue-chip-default { background-color: #F1F5F9; color: #334155; border: 1px solid #CBD5E1; }

/* -------------------------------------------------------------------------- */
/* REWRITTEN PROMPT CALLOUT BOX                                               */
/* -------------------------------------------------------------------------- */
.rewritten-box {
    background: linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 100%);
    border: 1.5px solid #93C5FD;
    border-radius: 18px;
    padding: 16px 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.06);
}
.rewritten-box-title {
    font-size: 14px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #2563EB;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
}
.rewritten-box-content {
    font-size: 17px;
    color: #0F172A;
    line-height: 1.55;
    white-space: pre-wrap;
    font-family: 'JetBrains Mono', monospace;
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 14px 16px;
}

/* Scrollable comparison content for 1080p height fitting */
.comparison-scroll {
    max-height: 340px;
    overflow-y: auto;
    padding-right: 6px;
    scrollbar-width: thin;
    scrollbar-color: #CBD5E1 transparent;
}
.comparison-scroll::-webkit-scrollbar {
    width: 6px;
}
.comparison-scroll::-webkit-scrollbar-thumb {
    background-color: #CBD5E1;
    border-radius: 4px;
}
</style>
"""


def apply_styles():
    """Injects the custom CSS styles into the Streamlit session."""
    st.markdown(CUSTOM_CSS, unsafe_allow_html=True)


def render_step_header(step_num: int, title: str, subtitle: str = ""):
    """Renders a standardized numbered step header."""
    sub_html = f'<span class="step-subtitle">— {subtitle}</span>' if subtitle else ""
    st.markdown(
        f"""
        <div class="step-header">
            <div class="step-header-left">
                <span class="step-badge">STEP {step_num}</span>
                <span class="step-title">{title}</span>
                {sub_html}
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )


def render_prompt_strength(before: int, after: int):
    """Renders a visual comparison meter for prompt strength before and after."""
    delta = after - before
    delta_text = f"+{delta} pts boost" if delta > 0 else f"{delta} pts"
    st.markdown(
        f"""
        <div class="strength-card">
            <div class="strength-item">
                <span class="strength-label">Prompt Strength:</span>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="strength-score-pill-before">❌ {before}/10</span>
                    <span class="strength-arrow">➔</span>
                    <span class="strength-score-pill-after">⚡ {after}/10</span>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="strength-delta">{delta_text}</span>
                <span style="font-size: 14px; color: #64748B;">Ready for production</span>
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )


def render_issue_chips(issues: list):
    """Renders categorized colored chips for prompt weaknesses."""
    if not issues:
        return

    cat_map = {
        "missing role": ("chip-role", "🎭"),
        "missing context": ("chip-context", "📖"),
        "missing format": ("chip-format", "📐"),
        "missing constraints": ("chip-constraints", "📏"),
        "ambiguity": ("chip-ambiguity", "❓"),
        "no examples": ("chip-examples", "💡"),
    }

    chips_html = []
    for issue in issues:
        cat = issue.get("category", "").lower().strip()
        explanation = issue.get("explanation", "")
        chip_cls, icon = "issue-chip-default", "⚠️"
        for key, val in cat_map.items():
            if key in cat:
                chip_cls = f"issue-{val[0]}"
                icon = val[1]
                break

        chips_html.append(
            f'<div class="issue-chip {chip_cls}">'
            f'<span>{icon} <strong>{cat.title()}:</strong> {explanation}</span>'
            f'</div>'
        )

    st.markdown(
        f"""
        <div style="margin-bottom: 8px;">
            <div style="font-size: 14px; font-weight: 700; text-transform: uppercase; color: #64748B; letter-spacing: 0.04em; margin-bottom: 8px;">
                Identified Weaknesses ({len(issues)} detected)
            </div>
            <div class="issue-chips-wrapper">
                {''.join(chips_html)}
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )


def render_technique_pill(technique_name: str):
    """Renders a small pill label with the technique name."""
    st.markdown(
        f'<span class="clinic-pill">{technique_name}</span>',
        unsafe_allow_html=True
    )


def render_problem_card(description: str):
    """Renders the one-line 'What goes wrong' card."""
    st.markdown(
        f"""
        <div class="problem-card">
            <div class="problem-card-title">⚠️ What goes wrong</div>
            <div class="problem-card-desc">{description}</div>
        </div>
        """,
        unsafe_allow_html=True
    )


def render_empty_state(icon: str, title: str, subtitle: str):
    """Renders a friendly projector-sized empty state."""
    st.markdown(
        f"""
        <div class="empty-card">
            <div class="empty-card-icon">{icon}</div>
            <div class="empty-card-title">{title}</div>
            <div class="empty-card-text">{subtitle}</div>
        </div>
        """,
        unsafe_allow_html=True
    )


def render_error_card(title: str, message: str, suggestion: str = ""):
    """Renders a friendly error card without raw Python tracebacks."""
    suggestion_html = f"<div style='margin-top: 8px; font-weight: 600;'>Tip: {suggestion}</div>" if suggestion else ""
    st.markdown(
        f"""
        <div class="error-card">
            <div class="error-card-title">🛑 {title}</div>
            <div class="error-card-text">
                {message}
                {suggestion_html}
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )
