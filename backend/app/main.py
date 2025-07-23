from fastapi import FastAPI, Depends
from .db import get_db, engine
from . import models, crud, auth, export
from .schema_report import ReportCreate, ReportUpdate, ReportInDB
from sqlalchemy.orm import Session
from sqlalchemy import func
# Solve CORS（Cross-Origin Resource Sharing） issue
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ For dev mode "*"
    # allow_origins=["http://localhost:5173"], # For production mode
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(export.router)

@app.get("/")
def root():
    return {"message": "Hello FastAPI"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/reports", response_model=list[ReportInDB])
def read_reports(db: Session = Depends(get_db)):
    return crud.get_reports(db)

@app.post("/reports", response_model=ReportInDB)
def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    return crud.create_report(db, report)

@app.put("/reports/{report_id}", response_model=ReportInDB)
def update_report(report_id: int, report: ReportUpdate, db: Session = Depends(get_db)):
    return crud.update_report(db, report_id, report)

@app.delete("/reports/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db)):
    return crud.delete_report(db, report_id)

@app.get("/reports/cpu_stats")
def get_cpu_stats(db: Session = Depends(get_db)):
    result = db.query(models.Report.cpu, func.count(models.Report.cpu)).group_by(models.Report.cpu).all()
    return [{"cpu": cpu, "count": count} for cpu, count in result]