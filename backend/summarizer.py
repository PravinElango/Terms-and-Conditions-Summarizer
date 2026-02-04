from llm_processor import client

def summarize_text(text: str, max_length: int = 150) -> str:
    prompt = f"""
    Please provide a concise "At a Glance" summary of the following Terms and Conditions text. 
    Keep it under {max_length} words, simple, and easy to understand for a general user.
    
    TEXT:
    {text[:20000]} 
    """
    # Truncate text to avoid token limits if necessary, though recent models handle large context. 
    # 20k chars is a safe rough limit for a quick glance.

    try:
        response = client.chat.completions.create(
            model="meta-llama/llama-3.3-70b-versatile", # Or similar efficient model
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error generating summary: {e}")
        return "Could not generate summary at this time."

