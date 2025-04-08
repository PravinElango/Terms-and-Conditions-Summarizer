from models.bart_model import generate_summary

def summarize_text(text: str, max_length: int = 150) -> str:
    chunks = [text[i:i + 1024] for i in range(0, len(text), 1024)]
    summary = ""
    for chunk in chunks:
        summary += generate_summary(chunk, max_length=max_length) + " "
    return summary.strip()
    print("Summary:", summary)
