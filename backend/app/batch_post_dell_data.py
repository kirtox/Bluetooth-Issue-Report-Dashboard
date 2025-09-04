import os
import math
import requests
import pandas as pd
from pathlib import Path
from dotenv import load_dotenv

# === 設定區 ===
BASE_DIR = Path(__file__).resolve().parent
EXCEL_FILE = BASE_DIR / "BTIRD.xlsx"
SHEET_REPORT = "Dell_Report_Data"     # 目標 sheet 名稱
SHEET_PLATFORM = "Dell_Platform_Data"     # 目標 sheet 名稱

# Specify the path to .env (from backend/app back to BTIRD)
env_path = Path(__file__).resolve().parents[2] / 'frontend' / '.env'  # 回到 BTIRD 資料夾
load_dotenv(dotenv_path=env_path)

# Load parameter
API_URL = os.getenv("VITE_API_BASE_URL")
print(f"VITE_API_BASE_URL: {API_URL}")

API_REPORTS = f"{API_URL}/reports"
API_PLATFORMS = f"{API_URL}/platforms"


def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    清理 DataFrame:
    1. 把 NaN / NaT / Inf 轉成 None
    2. 把 Timestamp 轉成 ISO 格式字串
    """
    # 先替換無效值
    df = df.replace([pd.NA, pd.NaT, float("inf"), -float("inf")], None)
    df = df.where(pd.notnull(df), None)

    # 處理時間欄位
    for col in df.columns:
        if pd.api.types.is_datetime64_any_dtype(df[col]):
            df[col] = df[col].map(lambda x: x.isoformat() if x is not None else None)

    # 最後保險：逐格檢查 nan → None
    df = df.applymap(lambda x: None if (isinstance(x, float) and math.isnan(x)) else x)

    return df


def create_report_data_single():
    try:
        df = pd.read_excel(EXCEL_FILE, sheet_name=SHEET_REPORT)
        df = clean_dataframe(df)
        records = df.to_dict(orient="records")

        success, fail = 0, 0
        for idx, row in enumerate(records, start=1):
            try:
                response = requests.post(API_REPORTS, json=row)
                response.raise_for_status()
                print(f"[OK] Report 第 {idx} 筆成功")
                success += 1
            except Exception as e:
                print(f"[FAIL] Report 第 {idx} 筆失敗: {e}")
                fail += 1

        print(f"[INFO] Report 上傳完成 → 成功 {success}, 失敗 {fail}")

    except Exception as e:
        print(f"[ERROR] Report 上傳過程失敗: {e}")


def create_platform_data_single():
    try:
        df = pd.read_excel(EXCEL_FILE, sheet_name=SHEET_PLATFORM)
        df = clean_dataframe(df)
        records = df.to_dict(orient="records")

        success, fail = 0, 0
        for idx, row in enumerate(records, start=1):
            try:
                response = requests.post(API_PLATFORMS, json=row)
                response.raise_for_status()
                print(f"[OK] Platform 第 {idx} 筆成功")
                success += 1
            except Exception as e:
                print(f"[FAIL] Platform 第 {idx} 筆失敗: {e}")
                fail += 1

        print(f"[INFO] Platform 上傳完成 → 成功 {success}, 失敗 {fail}")

    except Exception as e:
        print(f"[ERROR] Platform 上傳過程失敗: {e}")


if __name__ == "__main__":
    print("[INFO] 開始逐筆匯入 Excel 資料到 FastAPI...")
    create_report_data_single()
    create_platform_data_single()
    print("[INFO] 全部完成 ✅")