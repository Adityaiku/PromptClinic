"""
llm.py
Shared LLM engine for Prompt Clinic.

Features:
- Encapsulates Google GenAI SDK (google-genai).
- Single entrypoint: ask(system, user, temperature, json_mode, demo_data)
- Automatic retry with exponential backoff on transient errors (rate limits, server hiccups).
- Offline Demo Mode support when no API key is available or internet fails.
- Student-friendly error reporting.
"""

import os
import json
import time
import random
from typing import Optional, Any
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv(override=True)

# Module-level client cache
_client = None


def get_gemini_client():
    """Initializes and returns the Google GenAI client lazily."""
    global _client
    if _client is not None:
        return _client

    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise ValueError(
            "GEMINI_API_KEY is missing. Please set your key in the .env file or enable 'Demo Mode' in the sidebar."
        )

    # Initialize official google-genai client
    from google import genai
    _client = genai.Client(api_key=api_key)
    return _client


def ask(
    system: str,
    user: str,
    temperature: float = 0.7,
    json_mode: bool = False,
    demo_mode: bool = False,
    demo_data: Optional[str] = None
) -> str:
    """
    Executes a prompt call to Gemini with retry logic and fallback support.

    Parameters:
        system: The system instruction guiding the model's persona and constraints.
        user: The user prompt input.
        temperature: Controls output randomness (0.0 = deterministic, 1.0 = creative).
        json_mode: If True, instructs Gemini to return parseable JSON.
        demo_mode: If True, returns demo_data immediately without network calls.
        demo_data: Cached response text or JSON string to return in demo mode.

    Returns:
        The generated text response as a string.
    """
    # 1. Offline Demo Mode check
    if demo_mode:
        if demo_data is not None:
            # Simulate a realistic slight processing delay for classroom realism
            time.sleep(0.4)
            return demo_data
        return "Demo mode is active, but no cached output was provided."

    # 2. Check for API Key
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        if demo_data is not None:
            # Helpful fallback: if user forgot key, fall back to demo data with notification
            time.sleep(0.3)
            return demo_data
        raise ValueError(
            "No GEMINI_API_KEY found in .env. Please configure your key or enable 'Demo Mode' in the sidebar."
        )

    # 3. Model Configuration
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip() or "gemini-2.5-flash"
    client = get_gemini_client()

    # Import types from google.genai
    from google.genai import types

    # Configure generation parameters
    config_kwargs = {
        "temperature": temperature,
        "system_instruction": system if system else None,
    }

    if json_mode:
        config_kwargs["response_mime_type"] = "application/json"

    config = types.GenerateContentConfig(**config_kwargs)

    # 4. Exponential Backoff Retry Loop (up to 3 retries)
    max_retries = 3
    delay = 1.0

    for attempt in range(1, max_retries + 1):
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=user,
                config=config,
            )
            if response and response.text:
                return response.text
            return ""

        except Exception as exc:
            error_msg = str(exc)
            # If we've exhausted retries, format a student-friendly explanation
            if attempt == max_retries:
                # If demo_data is available, salvage the live demo!
                if demo_data is not None:
                    return demo_data
                
                # Check for common error types to give actionable advice
                if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
                    raise RuntimeError(
                        f"Rate limit exceeded (Quota 429). Gemini is temporarily busy. "
                        f"Tip: Try enabling 'Demo Mode' in the sidebar to continue the lecture seamlessly.\nDetails: {error_msg}"
                    )
                elif "API_KEY_INVALID" in error_msg or "403" in error_msg:
                    raise RuntimeError(
                        f"Invalid Gemini API Key. Please verify your GEMINI_API_KEY in .env.\nDetails: {error_msg}"
                    )
                else:
                    raise RuntimeError(
                        f"LLM Call failed after {max_retries} attempts: {error_msg}"
                    )

            # Wait with exponential backoff and jitter before next attempt
            jitter = random.uniform(0.1, 0.5)
            time.sleep(delay + jitter)
            delay *= 2.0
