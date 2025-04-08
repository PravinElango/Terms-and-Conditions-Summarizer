from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from summarizer import summarize_text
from llm_processor import generate_keypoints_and_breakdown
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow your React frontend to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class InputData(BaseModel):
    text: str

@app.post("/summarize/")
async def summarize_terms(data: InputData):
    try:
        glance_summary = summarize_text(data.text)
        keypoints, detailed = generate_keypoints_and_breakdown(data.text)

        response = {
            "title": "Terms & Conditions",
            "lastUpdated": "April 2025",  # Or parse this if you're scraping
            "glance": glance_summary,
            "keyPoints": keypoints,
            "detailed": detailed,
        }
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Terms & Conditions Summarizer API is running!"}
