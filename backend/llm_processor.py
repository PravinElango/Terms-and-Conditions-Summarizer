import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Access your API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Create Groq client
client = Groq(api_key=GROQ_API_KEY)

def generate_keypoints_and_breakdown(text: str):
    prompt = f"""
You are an assistant that summarizes legal Terms and Conditions.

Given the following text:

1. Extract 4–6 bullet-point key points, each with a risk label (low, medium, high).
2. Then, provide a detailed breakdown of major sections, each with a title, description, and risk level.

Output in JSON format like:
{{
  "keyPoints": [{{"point": "...", "risk": "low"}}],
  "detailed": [{{"section": "...", "content": "...", "risk": "medium"}}]
}}

TEXT:
{text}
"""

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4
    )

    raw_output = response.choices[0].message.content
    print("🔎 Raw model output:\n", raw_output)  # Debug print

    try:
        # Try parsing raw output as JSON
        data = json.loads(raw_output)
    except json.JSONDecodeError:
        try:
            # Fallback: Extract JSON block using regex
            json_match = re.search(r'{.*}', raw_output, re.DOTALL)
            if json_match:
                json_text = json_match.group()
                data = json.loads(json_text)
            else:
                raise ValueError("No valid JSON object found in response.")
        except Exception as e:
            print("⚠️ Failed to extract/parse JSON:", e)
            return [
                {"point": "Fallback key point", "risk": "medium"}
            ], [
                {"section": "Fallback section", "content": "Fallback explanation.", "risk": "medium"}
            ]

    return data.get("keyPoints", []), data.get("detailed", [])
