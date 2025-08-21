from dotenv import load_dotenv
from pathlib import Path
import os

# 指定 .env 的路徑（從 backend/app 回到 BTIRD）
env_path = Path(__file__).resolve().parents[2] / '.env'  # 回到 BTIRD 資料夾
load_dotenv(dotenv_path=env_path)

# 測試讀取
db_url = os.getenv("VITE_API_BASE_URL")
print(f"VITE_API_BASE_URL: {db_url}")
