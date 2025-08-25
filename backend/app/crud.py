from . import models
from .schema_report import ReportCreate, ReportUpdate
from .schema_platform import PlatformCreate, PlatformUpdate
from .schema_user import UserCreate, UserUpdate
from sqlalchemy.orm import Session
from .utils import get_password_hash

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

# Platform CRUD
def get_platforms(db: Session):
    return db.query(models.Platform).all()

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

