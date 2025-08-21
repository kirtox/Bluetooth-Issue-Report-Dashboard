from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReportBase(BaseModel):
    op_name: str
    date: Optional[datetime] = None

    os_version: str
    platform_brand: str
    platform: str
    platform_phase: str
    platform_bios: str
    cpu: str
    wlan: str
    wlan_phase: str
    bt_driver: str
    bt_interface: str
    wifi_driver: str
    audio_driver: str
    wrt_version: str
    wrt_preset: str
    msft_teams_version: Optional[str] = None
    scenario: str

    mouse_brand: Optional[str] = None
    mouse: Optional[str] = None
    mouse_click_period: Optional[str] = None

    keyboard_brand: Optional[str] = None
    keyboard: Optional[str] = None
    keyboard_click_period: Optional[str] = None

    headset_brand: Optional[str] = None
    speaker_brand: Optional[str] = None
    phone_brand: Optional[str] = None
    device1_brand: Optional[str] = None
    device1: Optional[str] = None

    modern_standby: str
    ms_period: Optional[str] = None
    ms_os_waiting_time: Optional[str] = None

    s4: str
    s4_period: Optional[str] = None
    s4_os_waiting_time: Optional[str] = None

    warm_boot: str
    wb_period: Optional[str] = None
    wb_os_waiting_time: Optional[str] = None

    cold_boot: str
    cb_period: Optional[str] = None
    cb_os_waiting_time: Optional[str] = None

    microsoft_teams: str
    apm: str
    apm_period: Optional[str] = None
    opp: str
    swift_pair: str

    power_type: str
    urgent_level: Optional[str] = None
    fix_work_week: Optional[str] = None
    fix_bt_driver: Optional[str] = None
    jira_id: Optional[str] = None
    ips_id: Optional[str] = None
    hsd_id: Optional[str] = None

    result: Optional[str] = None
    fail_rate: Optional[str] = None
    current_status: str
    log_path: Optional[str] = None

class ReportCreate(ReportBase):
    pass

class ReportUpdate(ReportBase):
    pass

class ReportInDB(ReportBase):
    id: int
    
    model_config = {
        "from_attributes": True
    }

# Backup #
# op_name: Optional[str] = None
# date: Optional[datetime] = None

# os_version: Optional[str] = None
# platform_brand: Optional[str] = None
# platform: Optional[str] = None
# platform_phase: Optional[str] = None
# platform_bios: Optional[str] = None
# cpu: Optional[str] = None
# wlan: Optional[str] = None
# wlan_phase: Optional[str] = None
# bt_driver: Optional[str] = None
# bt_interface: Optional[str] = None
# wifi_driver: Optional[str] = None
# audio_driver: Optional[str] = None
# wrt_version: Optional[str] = None
# wrt_preset: Optional[str] = None
# msft_teams_version: Optional[str] = None
# scenario: Optional[str] = None

# mouse_brand: Optional[str] = None
# mouse: Optional[str] = None
# mouse_click_period: Optional[str] = None

# keyboard_brand: Optional[str] = None
# keyboard: Optional[str] = None
# keyboard_click_period: Optional[str] = None

# headset_brand: Optional[str] = None
# speaker_brand: Optional[str] = None
# phone_brand: Optional[str] = None
# device1_brand: Optional[str] = None
# device1: Optional[str] = None

# modern_standby: Optional[str] = None
# ms_period: Optional[str] = None
# ms_os_waiting_time: Optional[str] = None

# s4: Optional[str] = None
# s4_period: Optional[str] = None
# s4_os_waiting_time: Optional[str] = None

# warm_boot: Optional[str] = None
# wb_period: Optional[str] = None
# wb_os_waiting_time: Optional[str] = None

# cold_boot: Optional[str] = None
# cb_period: Optional[str] = None
# cb_os_waiting_time: Optional[str] = None

# microsoft_teams: Optional[str] = None
# apm: Optional[str] = None
# apm_period: Optional[str] = None
# opp: Optional[str] = None
# swift_pair: Optional[str] = None

# power_type: Optional[str] = None
# urgent_level: Optional[str] = None
# fix_work_week: Optional[str] = None
# fix_bt_driver: Optional[str] = None
# jira_id: Optional[str] = None
# ips_id: Optional[str] = None
# hsd_id: Optional[str] = None

# result: Optional[str] = None
# fail_rate: Optional[str] = None
# current_status: Optional[str] = None
# log_path: Optional[str] = None