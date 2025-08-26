from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
import datetime

# from backend.app.generate_test_data import current_status

Base = declarative_base()

class Report(Base):
    __tablename__ = "report"
    id = Column(Integer, primary_key=True, index=True)
    op_name = Column(String, nullable=False)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    serial_num = Column(String, nullable=False)

    os_version = Column(String, nullable=False)
    platform_brand = Column(String, nullable=False)
    platform = Column(String, nullable=False)
    platform_phase = Column(String, nullable=False)
    platform_bios = Column(String, nullable=False)
    cpu = Column(String, nullable=False)
    wlan = Column(String, nullable=False)
    wlan_phase = Column(String, nullable=False)
    bt_driver = Column(String, nullable=False)
    bt_interface = Column(String, nullable=False)
    wifi_driver = Column(String, nullable=False)
    audio_driver = Column(String, nullable=False)
    wrt_version = Column(String, nullable=False)
    wrt_preset = Column(String, nullable=False)
    msft_teams_version = Column(String)

    scenario = Column(String, nullable=False)

    mouse_brand = Column(String)
    mouse = Column(String)
    mouse_click_period = Column(String)

    keyboard_brand = Column(String)
    keyboard = Column(String)
    keyboard_click_period = Column(String)

    headset_brand = Column(String)
    headset = Column(String)

    speaker_brand = Column(String)
    speaker = Column(String)

    phone_brand = Column(String)
    phone = Column(String)

    device1_brand = Column(String)
    device1 = Column(String)

    modern_standby = Column(String, nullable=False)
    ms_period = Column(String)
    ms_os_waiting_time = Column(String)
    
    s4 = Column(String, nullable=False)
    s4_period = Column(String)
    s4_os_waiting_time = Column(String)
    
    warm_boot = Column(String, nullable=False)
    wb_period = Column(String)
    wb_os_waiting_time = Column(String)
    
    cold_boot = Column(String, nullable=False)
    cb_period = Column(String)
    cb_os_waiting_time = Column(String)
    
    microsoft_teams = Column(String, nullable=False)

    apm = Column(String, nullable=False)
    apm_period = Column(String)

    opp = Column(String, nullable=False)
    swift_pair = Column(String, nullable=False)

    power_type = Column(String, nullable=False)
    urgent_level = Column(String)
    fix_work_week = Column(String)
    fix_bt_driver = Column(String)
    jira_id = Column(String)
    ips_id = Column(String)
    hsd_id = Column(String)

    result = Column(String, nullable=False)
    fail_cycles = Column(String)
    cycles = Column(String)

    log_path = Column(String)

class Platform(Base):
    __tablename__ = "platform"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    serial_num = Column(String, unique=True, nullable=False)
    current_status = Column(String, nullable=False)

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
