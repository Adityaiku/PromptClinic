"""
tabs package for Prompt Clinic.
"""

from .diagnose import render_diagnose_tab
from .verify import render_verify_tab
from .remember import render_remember_tab
from .voice import render_voice_tab
from .defend import render_defend_tab

__all__ = [
    "render_diagnose_tab",
    "render_verify_tab",
    "render_remember_tab",
    "render_voice_tab",
    "render_defend_tab",
]
