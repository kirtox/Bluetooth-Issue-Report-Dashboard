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
from app.schema_platform import PlatformCreate, PlatformUpdate, PlatformInDB
from app.schema_platform_latest_report import PlatformWithLatestReportInDB
from sqlalchemy.orm import Session
from sqlalchemy import func
# Solve CORS（Cross-Origin Resource Sharing） issue
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
import logging

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
    return crud.get_cpu_stats(db)

# Read all platforms
@app.get("/platforms", response_model=list[PlatformInDB])
def read_platforms(db: Session = Depends(get_db)):
    return crud.get_platforms(db)

@app.get("/platforms/latest_reports", response_model=list[PlatformWithLatestReportInDB])
def get_platform_latest_reports(db: Session = Depends(get_db)):
    return crud.get_platform_latest_reports(db)

    # 假資料，符合 PlatformWithLatestReportInDB
    # fake_data = [
    #     {
    #         "id": 1,
    #         "serial_num": "ABC12345",
    #         "current_status": "PASS",
    #         "platform_date": "2025-09-10T12:00:00",
    #         "platform_brand": "Intel",
    #         "platform": "AlderLake",
    #         "cpu": "i7-12700K",
    #         "wlan": "AX210",
    #         "report_date": "2025-09-09T15:30:00",
    #     },
    #     {
    #         "id": 2,
    #         "serial_num": "XYZ67890",
    #         "current_status": "FAIL",
    #         "platform_date": "2025-09-08T09:00:00",
    #         "platform_brand": "AMD",
    #         "platform": "Ryzen 7",
    #         "cpu": "5800X",
    #         "wlan": "AX200",
    #         "report_date": "2025-09-09T15:30:00",
    #     },
    # ]

    # return fake_data

@app.get("/platforms/{serial_num}", response_model=PlatformInDB)
def get_platform_by_serial_num(serial_num: str, db: Session = Depends(get_db)):
    result = crud.get_platform_by_serial_num(db, serial_num)
    if not result:
        raise HTTPException(status_code=404, detail="Platform not found")
    return result

# Add a platform
@app.post("/platforms", response_model=PlatformInDB)
def create_platform(platform: PlatformCreate, db: Session = Depends(get_db)):
    return crud.create_platform(db, platform)

# Update a platform
@app.put("/platforms/{platform_id}", response_model=PlatformInDB)
def update_platform(platform_id: int, platform: PlatformUpdate, db: Session = Depends(get_db)):
    return crud.update_platform(db, platform_id, platform)

# Delete a platform
@app.delete("/platforms/{platform_id}")
def delete_platform(platform_id: int, db: Session = Depends(get_db)):
    return crud.delete_platform(db, platform_id)

# Summary each serial_num's latest report
# @app.get("/platforms/latest_reports", response_model=list[PlatformWithLatestReportInDB])
# def get_platform_latest_reports(db: Session = Depends(get_db)):
#     # return crud.get_platform_latest_reports(db)
    
#     result = crud.get_platform_latest_reports(db)
#     return [PlatformWithLatestReportInDB(**row) for row in result]



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