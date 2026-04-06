from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid
import os

app = FastAPI(
    title="PDI Chatbot AI Service",
    description="AI-powered chatbot for PDI Platform with Romanian language support",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MessageRequest(BaseModel):
    message: str
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None


class MessageResponse(BaseModel):
    response: str
    session_id: str
    intent: Optional[str] = None
    entities: Optional[Dict[str, Any]] = None
    confidence: float = 1.0


class AppointmentRequest(BaseModel):
    user_id: str
    service_type: str
    date: str
    time: str
    description: Optional[str] = None


class ComplaintRequest(BaseModel):
    user_id: str
    description: str
    category: str
    location: Optional[str] = None
    attachments: Optional[List[str]] = None


class KnowledgeBaseEntry(BaseModel):
    question: str
    answer: str
    category: str
    keywords: Optional[List[str]] = None


sessions: Dict[str, List[Dict]] = {}
knowledge_base: List[KnowledgeBaseEntry] = [
    KnowledgeBaseEntry(
        question="Cum plătesc impozitele?",
        answer="Puteți plăti impozitele online prin portalul nostru secțiunea Taxe sau fizic la sediul primăriei.",
        category="taxe",
        keywords=["impozit", "plată", "taxe"],
    ),
    KnowledgeBaseEntry(
        question="Cum obțin certificat de urbanism?",
        answer="Pentru a obține un certificat de urbanism, trebuie să depuneți o cerere la ghișeul de urbanism sau online.",
        category="urbanism",
        keywords=["certificat urbanism", "CU", "autorizație"],
    ),
    KnowledgeBaseEntry(
        question="Cum mă înregistrez în registrul agricol?",
        answer="Înregistrarea în registrul agricol se face la sediul primăriei cu actele de proprietate.",
        category="agricultură",
        keywords=["registru agricol", "terne", "animale"],
    ),
]

intents = {
    "greeting": ["bună", "buna", "salut", "hello", "hei"],
    "tax_info": ["impozit", "taxa", "plată", "datorie", "restanță"],
    "urbanism": ["urbanism", "certificat", "autorizație", "construire", "clădire"],
    "agriculture": ["agricultur", "registru", "teren", "parcelă", "animal"],
    "appointment": ["programare", "program", "rezervare", "audiență"],
    "complaint": ["sesizare", "reclamație", "problemă", "neconformitate"],
    "status": ["status", "stare", "progres", "unde"],
    "help": ["ajutor", "help", "ghid", "informații"],
}


def detect_intent(message: str) -> tuple[str, float, dict]:
    message_lower = message.lower()

    for intent, keywords in intents.items():
        for keyword in keywords:
            if keyword in message_lower:
                confidence = min(
                    0.9, 0.5 + 0.1 * len([k for k in keywords if k in message_lower])
                )
                return intent, confidence, {"keyword": keyword}

    return "general", 0.5, {}


def extract_entities(message: str) -> dict:
    entities = {}

    import re

    cnp_pattern = r"\b\d{13}\b"
    cnps = re.findall(cnp_pattern, message)
    if cnps:
        entities["cnp"] = cnps[0]

    date_pattern = (
        r"\b(\d{1,2}[-./]\d{1,2}[-./]\d{2,4}|\d{4}[-./]\d{1,2}[-./]\d{1,2})\b"
    )
    dates = re.findall(date_pattern, message)
    if dates:
        entities["date"] = dates[0]

    return entities


def generate_response(intent: str, entities: dict, session_history: list) -> str:
    responses = {
        "greeting": "Bună ziua! Sunt asistentul virtual al Primăriei Nucet. Cum vă pot ajuta?",
        "tax_info": "Pentru informații despre impozite și taxe, accesați secțiunea 'Taxe' din portal sau contactați departamentul contabilitate.",
        "urbanism": "Pentru certificate de urbanism sau autorizații de construire, vă recomand să programați o audiență la departamentul de urbanism.",
        "agriculture": "Pentru înregistrarea în registrul agricol sau informații despre terenuri, vă așteptăm la sediul primăriei.",
        "appointment": "Pentru programare, vă rog să specificați: serviciul dorit, data și ora preferată.",
        "complaint": "Înțeleg. Vă rog să descrieți problema dumneavoastră în detaliu pentru a o înregistra.",
        "status": "Pentru a verifica statusul unei cereri, aveți nevoie de numărul de înregistrare. Îl puteți găsi în confirmarea trimisă pe email.",
        "help": "Vă pot ajuta cu: informații despre impozite, urbanism, registrul agricol, programări, sesizări sau statusul cererilor.",
    }

    return responses.get(
        intent,
        "Nu am înțeles exact ce aveți nevoie. Vă pot ajuta cu informații despre serviciile primăriei.",
    )


@app.get("/")
def root():
    return {"service": "PDI Chatbot AI", "status": "running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/api/v1/chatbot/converse", response_model=MessageResponse)
def converse(request: MessageRequest):
    session_id = request.session_id or str(uuid.uuid4())

    if session_id not in sessions:
        sessions[session_id] = []

    intent, confidence, entities = detect_intent(request.message)
    extracted_entities = extract_entities(request.message)
    entities.update(extracted_entities)

    response_text = generate_response(intent, entities, sessions[session_id])

    sessions[session_id].append(
        {
            "user": request.message,
            "bot": response_text,
            "intent": intent,
            "timestamp": datetime.now().isoformat(),
        }
    )

    return MessageResponse(
        response=response_text,
        session_id=session_id,
        intent=intent,
        entities=entities,
        confidence=confidence,
    )


@app.get("/api/v1/chatbot/sessions/{session_id}")
def get_session(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"session_id": session_id, "history": sessions[session_id]}


@app.post("/api/v1/chatbot/appointments")
def create_appointment(request: AppointmentRequest):
    appointment_id = str(uuid.uuid4())
    return {
        "appointment_id": appointment_id,
        "status": "confirmed",
        "message": f"Programare confirmată pentru {request.date} la ora {request.time}",
    }


@app.post("/api/v1/chatbot/complaints")
def create_complaint(request: ComplaintRequest):
    complaint_id = str(uuid.uuid4())
    return {
        "complaint_id": complaint_id,
        "status": "submitted",
        "message": "Sesizarea dumneavoastră a fost înregistrată cu succes",
    }


@app.get("/api/v1/chatbot/knowledge")
def get_knowledge():
    return {"entries": [kb.dict() for kb in knowledge_base]}


@app.post("/api/v1/chatbot/knowledge")
def add_knowledge(entry: KnowledgeBaseEntry):
    knowledge_base.append(entry)
    return {"message": "Knowledge base entry added"}


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("CHATBOT_PORT", "8089"))
    uvicorn.run(app, host="0.0.0.0", port=port)
