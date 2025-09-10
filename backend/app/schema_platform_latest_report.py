# from pydantic import BaseModel
# from typing import Optional
# from datetime import datetime

# class PlatformWithLatestReportInDB(BaseModel):
#     id: int
#     serial_num: str
#     current_status: str
#     platform_date: Optional[datetime] = None
#     platform_brand: Optional[str] = None
#     platform: Optional[str] = None
#     cpu: Optional[str] = None
#     wlan: Optional[str] = None
#     report_date: Optional[datetime] = None

#     class Config:
#         from_attributes = True

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PlatformWithLatestReportInDB(BaseModel):
    id: int
    serial_num: str
    current_status: str
    platform_date: datetime
    platform_brand: Optional[str]
    platform: Optional[str]
    cpu: Optional[str]
    wlan: Optional[str]
    report_date: Optional[datetime]

    class Config:
        from_attributes = True
