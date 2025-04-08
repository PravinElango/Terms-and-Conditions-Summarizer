from transformers import BartForConditionalGeneration, BartTokenizer
import torch

# Load BART tokenizer and model
model_name = "facebook/bart-large-cnn"

tokenizer = BartTokenizer.from_pretrained(model_name)
model = BartForConditionalGeneration.from_pretrained(model_name)

# Use GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

def generate_summary(text: str, max_length: int = 150, min_length: int = 40) -> str:
    inputs = tokenizer.batch_encode_plus([text], return_tensors="pt", max_length=1024, truncation=True)
    input_ids = inputs["input_ids"].to(device)
    attention_mask = inputs["attention_mask"].to(device)

    summary_ids = model.generate(input_ids, attention_mask=attention_mask,
                                 max_length=max_length, min_length=min_length, length_penalty=2.0,
                                 num_beams=4, early_stopping=True)

    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary
