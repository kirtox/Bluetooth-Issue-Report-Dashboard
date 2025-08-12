from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from .db import get_db
from .models import Report
import io
import csv
from fastapi.responses import StreamingResponse
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill
from typing import Optional, List
from datetime import datetime

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

@router.get("/export/excel")
def export_excel(
    db: Session = Depends(get_db),
    search_term: Optional[str] = Query(None),
    platforms: Optional[str] = Query(None),
    results: Optional[str] = Query(None),
    statuses: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    # 構建查詢
    query = db.query(Report)
    
    # 應用篩選條件
    if search_term:
        search_filter = f"%{search_term}%"
        query = query.filter(
            (Report.op_name.ilike(search_filter)) |
            (Report.platform.ilike(search_filter)) |
            (Report.scenario.ilike(search_filter)) |
            (Report.bt_driver.ilike(search_filter)) |
            (Report.wifi_driver.ilike(search_filter)) |
            (Report.result.ilike(search_filter)) |
            (Report.current_status.ilike(search_filter))
        )
    
    if platforms:
        platform_list = platforms.split(',')
        query = query.filter(Report.platform.in_(platform_list))
    
    if results:
        result_list = results.split(',')
        query = query.filter(Report.result.in_(result_list))
    
    if statuses:
        status_list = statuses.split(',')
        query = query.filter(Report.current_status.in_(status_list))
    
    if start_date:
        query = query.filter(Report.date >= datetime.fromisoformat(start_date))
    
    if end_date:
        # 將結束日期設為當天的最後一刻
        end_datetime = datetime.fromisoformat(end_date)
        end_datetime = end_datetime.replace(hour=23, minute=59, second=59, microsecond=999999)
        query = query.filter(Report.date <= end_datetime)
    
    reports = query.all()
    
    # 創建 Excel 工作簿
    wb = Workbook()
    ws = wb.active
    ws.title = "Reports"
    
    # 定義標題行
    headers = [
        "ID", "Operator Name", "Date", "OS Version", "Platform Brand", "Platform", 
        "Platform Phase", "Platform BIOS", "CPU", "WLAN", "WLAN Phase", 
        "BT Driver", "BT Interface", "WiFi Driver", "Audio Driver", "WRT Version", 
        "WRT Preset", "MSFT Teams Version", "Scenario", "Mouse Brand", "Mouse", 
        "Mouse Click Period", "Keyboard Brand", "Keyboard", "Keyboard Click Period",
        "Headset Brand", "Headset", "Speaker Brand", "Speaker", "Phone Brand", 
        "Phone", "Device1 Brand", "Device1", "Modern Standby", "MS Period", 
        "MS OS Waiting Time", "S4", "S4 Period", "S4 OS Waiting Time", "Warm Boot",
        "WB Period", "WB OS Waiting Time", "Cold Boot", "CB Period", 
        "CB OS Waiting Time", "Microsoft Teams", "APM", "APM Period", "OPP", 
        "Swift Pair", "Power Type", "Urgent Level", "Fix Work Week", 
        "Fix BT Driver", "JIRA ID", "IPS ID", "HSD ID", "Result", "Fail Rate", 
        "Current Status", "Log Path"
    ]
    
    # 設置標題行樣式
    header_font = Font(bold=True, color="FFFFFF")
    header_fill = PatternFill(start_color="366092", end_color="366092", fill_type="solid")
    header_alignment = Alignment(horizontal="center", vertical="center")
    
    # 寫入標題行
    for col, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col, value=header)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = header_alignment
    
    # 寫入資料
    for row, report in enumerate(reports, 2):
        ws.cell(row=row, column=1, value=report.id)
        ws.cell(row=row, column=2, value=report.op_name)
        ws.cell(row=row, column=3, value=report.date.strftime("%Y-%m-%d %H:%M:%S") if report.date else "")
        ws.cell(row=row, column=4, value=report.os_version)
        ws.cell(row=row, column=5, value=report.platform_brand)
        ws.cell(row=row, column=6, value=report.platform)
        ws.cell(row=row, column=7, value=report.platform_phase)
        ws.cell(row=row, column=8, value=report.platform_bios)
        ws.cell(row=row, column=9, value=report.cpu)
        ws.cell(row=row, column=10, value=report.wlan)
        ws.cell(row=row, column=11, value=report.wlan_phase)
        ws.cell(row=row, column=12, value=report.bt_driver)
        ws.cell(row=row, column=13, value=report.bt_interface)
        ws.cell(row=row, column=14, value=report.wifi_driver)
        ws.cell(row=row, column=15, value=report.audio_driver)
        ws.cell(row=row, column=16, value=report.wrt_version)
        ws.cell(row=row, column=17, value=report.wrt_preset)
        ws.cell(row=row, column=18, value=report.msft_teams_version)
        ws.cell(row=row, column=19, value=report.scenario)
        ws.cell(row=row, column=20, value=report.mouse_brand)
        ws.cell(row=row, column=21, value=report.mouse)
        ws.cell(row=row, column=22, value=report.mouse_click_period)
        ws.cell(row=row, column=23, value=report.keyboard_brand)
        ws.cell(row=row, column=24, value=report.keyboard)
        ws.cell(row=row, column=25, value=report.keyboard_click_period)
        ws.cell(row=row, column=26, value=report.headset_brand)
        ws.cell(row=row, column=27, value=report.headset)
        ws.cell(row=row, column=28, value=report.speaker_brand)
        ws.cell(row=row, column=29, value=report.speaker)
        ws.cell(row=row, column=30, value=report.phone_brand)
        ws.cell(row=row, column=31, value=report.phone)
        ws.cell(row=row, column=32, value=report.device1_brand)
        ws.cell(row=row, column=33, value=report.device1)
        ws.cell(row=row, column=34, value=report.modern_standby)
        ws.cell(row=row, column=35, value=report.ms_period)
        ws.cell(row=row, column=36, value=report.ms_os_waiting_time)
        ws.cell(row=row, column=37, value=report.s4)
        ws.cell(row=row, column=38, value=report.s4_period)
        ws.cell(row=row, column=39, value=report.s4_os_waiting_time)
        ws.cell(row=row, column=40, value=report.warm_boot)
        ws.cell(row=row, column=41, value=report.wb_period)
        ws.cell(row=row, column=42, value=report.wb_os_waiting_time)
        ws.cell(row=row, column=43, value=report.cold_boot)
        ws.cell(row=row, column=44, value=report.cb_period)
        ws.cell(row=row, column=45, value=report.cb_os_waiting_time)
        ws.cell(row=row, column=46, value=report.microsoft_teams)
        ws.cell(row=row, column=47, value=report.apm)
        ws.cell(row=row, column=48, value=report.apm_period)
        ws.cell(row=row, column=49, value=report.opp)
        ws.cell(row=row, column=50, value=report.swift_pair)
        ws.cell(row=row, column=51, value=report.power_type)
        ws.cell(row=row, column=52, value=report.urgent_level)
        ws.cell(row=row, column=53, value=report.fix_work_week)
        ws.cell(row=row, column=54, value=report.fix_bt_driver)
        ws.cell(row=row, column=55, value=report.jira_id)
        ws.cell(row=row, column=56, value=report.ips_id)
        ws.cell(row=row, column=57, value=report.hsd_id)
        ws.cell(row=row, column=58, value=report.result)
        ws.cell(row=row, column=59, value=report.fail_rate)
        ws.cell(row=row, column=60, value=report.current_status)
        ws.cell(row=row, column=61, value=report.log_path)
    
    # 自動調整欄寬
    for column in ws.columns:
        max_length = 0
        column_letter = column[0].column_letter
        for cell in column:
            try:
                if len(str(cell.value)) > max_length:
                    max_length = len(str(cell.value))
            except:
                pass
        adjusted_width = min(max_length + 2, 50)  # 最大寬度限制為 50
        ws.column_dimensions[column_letter].width = adjusted_width
    
    # 保存到記憶體
    output = io.BytesIO()
    wb.save(output)
    output.seek(0)
    
    # 生成檔案名稱
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"reports_{timestamp}.xlsx"
    
    return StreamingResponse(
        output, 
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )