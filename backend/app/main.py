# from fastapi import FastAPI, Depends
# from .db import get_db, engine
# from . import models, crud, auth, export
# from .schema_report import ReportCreate, ReportUpdate, ReportInDB
# from sqlalchemy.orm import Session
# from sqlalchemy import func
# # Solve CORS（Cross-Origin Resource Sharing） issue
# from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, Depends, Body, HTTPException
from app.db import get_db, engine
from app import models, crud, auth, export
from app.schema_report import ReportCreate, ReportUpdate, ReportInDB
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

# Read all reports
@app.get("/reports", response_model=list[ReportInDB])
def read_reports(db: Session = Depends(get_db)):
    return crud.get_reports(db)

# Add a report
@app.post("/reports", response_model=ReportInDB)
def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    return crud.create_report(db, report)

# Update a report
@app.put("/reports/{report_id}", response_model=ReportInDB)
def update_report(report_id: int, report: ReportUpdate, db: Session = Depends(get_db)):
    return crud.update_report(db, report_id, report)

# Delete a report
@app.delete("/reports/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db)):
    return crud.delete_report(db, report_id)

# Summary each cpu numbers
@app.get("/reports/cpu_stats")
def get_cpu_stats(db: Session = Depends(get_db)):
    result = db.query(models.Report.cpu, func.count(models.Report.cpu)).group_by(models.Report.cpu).all()
    return [{"cpu": cpu, "count": count} for cpu, count in result]

# # Partial update by specific columns (current: platform, scenario)
# @app.patch("/reports/latest", response_model=ReportInDB)
# def update_latest_report(
#     platform: str,
#     scenario: str,
#     update_data: ReportUpdate = Body(...),
#     db: Session = Depends(get_db)
# ):
#     latest_report = (
#         db.query(models.Report)
#         .filter(models.Report.platform == platform, models.Report.scenario == scenario)
#         .order_by(models.Report.date.desc())
#         .first()
#     )

#     if not latest_report:
#         raise HTTPException(status_code=404, detail="No matching report found")

#     update_dict = update_data.dict(exclude_unset=True)
#     for key, value in update_dict.items():
#         setattr(latest_report, key, value)

#     db.commit()
#     db.refresh(latest_report)
#     return latest_report