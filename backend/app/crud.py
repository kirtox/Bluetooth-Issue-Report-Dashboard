from . import models
from .schema_report import ReportCreate, ReportUpdate
from .schema_platform import PlatformCreate, PlatformUpdate
from .schema_platform_latest_report import PlatformWithLatestReportInDB
from .schema_user import UserCreate, UserUpdate
from sqlalchemy.orm import Session, aliased
from .utils import get_password_hash
from sqlalchemy import func

# Report CRUD
def get_reports(db: Session):
    return db.query(models.Report).all()

def create_report(db: Session, report: ReportCreate):
    db_report = models.Report(**report.dict())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

def update_report(db: Session, report_id: int, report: ReportUpdate):
    db_report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not db_report:
        return None
    for key, value in report.dict(exclude_unset=True).items():
        setattr(db_report, key, value)
    db.commit()
    db.refresh(db_report)
    return db_report

def delete_report(db: Session, report_id: int):
    db_report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not db_report:
        return None
    db.delete(db_report)
    db.commit()
    return {"deleted": True}

def get_cpu_stats(db: Session):
    result = db.query(models.Report.cpu, func.count(models.Report.cpu)).group_by(models.Report.cpu).all()
    return [{"cpu": cpu, "count": count} for cpu, count in result]

# Platform CRUD
def get_platforms(db: Session):
    return db.query(models.Platform).all()

def get_platform_by_serial_num(db: Session, serial_num: str):
    """
    依照 serial_num 查詢 Platform
    因為 serial_num 在 model 裡是 unique=True
    所以回傳單筆 (如果不存在就回傳 None)
    """
    return db.query(models.Platform).filter(models.Platform.serial_num == serial_num).first()

def create_platform(db: Session, platform: PlatformCreate):
    db_platform = models.Platform(**platform.dict())
    db.add(db_platform)
    db.commit()
    db.refresh(db_platform)
    return db_platform

def update_platform(db: Session, platform_id: int, platform: PlatformUpdate):
    db_platform = db.query(models.Platform).filter(models.Platform.id == platform_id).first()
    if not db_platform:
        return None
    for key, value in platform.dict(exclude_unset=True).items():
        setattr(db_platform, key, value)
    db.commit()
    db.refresh(db_platform)
    return db_platform

def delete_platform(db: Session, platform_id: int):
    db_platform = db.query(models.Platform).filter(models.Platform.id == platform_id).first()
    if not db_platform:
        return None
    db.delete(db_platform)
    db.commit()
    return {"deleted": True}

# def get_platform_latest_reports(db: Session):
#     # Subquery: find latest report date for each serial_num
#     subquery = (
#         db.query(
#             models.Report.serial_num.label("serial_num"),
#             func.max(models.Report.date).label("date")
#         )
#         .group_by(models.Report.serial_num)
#         .subquery()
#     )

#     # JOIN subquery and get latest report
#     latest_reports = (
#         db.query(models.Report)
#         .join(subquery, (models.Report.serial_num == subquery.c.serial_num) & (models.Report.date == subquery.c.date))
#         .subquery()
#     )

#     # At the end, JOIN platform
#     rows = (
#         db.query(
#             models.Platform.id,
#             models.Platform.serial_num,
#             models.Platform.current_status,
#             models.Platform.date.label("platform_date"),
#             latest_reports.c.platform_brand,
#             latest_reports.c.platform,
#             latest_reports.c.cpu,
#             latest_reports.c.wlan,
#             latest_reports.c.date.label("report_date")
#         )
#         .outerjoin(latest_reports, models.Platform.serial_num == latest_reports.c.serial_num)
#         .all()
#     )

#     result = [
#         {
#             "id": row.id,
#             "serial_num": row.serial_num,
#             "current_status": row.current_status,
#             "platform_date": row.platform_date,
#             "platform_brand": row.platform_brand,
#             "platform": row.platform,
#             "cpu": row.cpu,
#             "wlan": row.wlan,
#             "report_date": row.report_date,
#         }
#         for row in rows
#     ]

#     return result

# User CRUD
def get_user(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: UserCreate):
    db_user = models.User(
        username=user.username,
        hashed_password=get_password_hash(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user: UserUpdate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        return None

    update_data = user.dict(exclude_unset=True)
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user
