from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .db import get_db
from .models import Report
import io
import csv
from fastapi.responses import StreamingResponse

router = APIRouter()

@router.get("/export/csv")
def export_csv(db: Session = Depends(get_db)):
    reports = db.query(Report).all()
    stream = io.StringIO()
    writer = csv.writer(stream)
    writer.writerow(["ID", "Platform", "Scenario", "Date"])
    for r in reports:
        writer.writerow([r.id, r.platform, r.scenario, r.date])
    stream.seek(0)
    return StreamingResponse(stream, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=reports.csv"})
