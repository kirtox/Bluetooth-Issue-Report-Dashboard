import random
import requests
from datetime import datetime, timedelta

API_URL = "http://localhost:8000/reports"  # Change to your FastAPI service URL

# === Data Definition ===
op_name = ["Ernie", "Tony", "Alex", "Angus", "Ben", "Fiona"]
os_version = ["26100.4656", "22631.5624", "22621.5624", "22631.5472"]
platform_brand = ["HP", "Lenovo", "Dell", "Samsung", "Microsoft", "Acer", "Asus", "Intel"]
platform = {
    "HP": ["Regis", "Trekker", "Masada"],
    "Lenovo": ["Thames2", "Curle"],
    "Dell": ["Taroko", "Tributo"],
    "Samsung": ["Venus5-16"],
    "Microsoft": ["Surface"],
    "Acer": ["DualPlay", "NitroBlaze7"],
    "Asus": ["Dali", "Precog"],
    "Intel": ["RVP"]
}
platform_phase = ["EVT", "DVT1", "DVT2", "PV", "MP"]
platform_bios = {
    "HP": ["B 02|03", "A 02|03", "01.14.00", "01.16.00"],
    "Lenovo": ["N4BET34Z", "N4CAT2A1"],
    "Dell": ["89.7.31", "89.8.35", "89.9.39"],
    "Samsung": ["P05AMA. 140.250210.01", "P06AMA. 170.250220.01"],
    "Microsoft": ["24.091.12892.0", "24.091.12921.0", "24.092.12878.0"],
    "Acer": ["3A20", "3A29", "3A31"],
    "Asus": ["310", "202", "304", "322"],
    "Intel": ["R000.3234.D01.2506101609", "R000.3334.D01.2515202509"]
}
cpu = ["MTL", "ARL", "LNL", "PTL"]
wlan = ["AX211", "AX201", "BE200", "BE202", "BE211"]
wlan_phase = ["A0", "B0"]
bt_driver = ["23.165.0.3", "23.165.0.4", "23.165.0.7"]
bt_interface = ["USB", "PCIe"]
wifi_driver = ["99.0.96.3", "23.140.0.5", "23.160.0.4"]
audio_driver = ["20.43.11968.4", "20.43.12153.0", "20.43.12196.0"]
wrt_version = ["23.140.0.5", "23.150.0.4", "23.160.0.5"]
wrt_preset = ["Enif", "Mimosa", "Gacrux"]
msft_teams_version = ["25153.1010.3727.5483", "25151.505.3727.5755", None]
scenario = ["Teams Call", "Mouse Click (2/3/5 sec) + Play local music", "Teams Call + Play local music + S4", "Mouse click", "Teams Call + MS"]
mouse_brand = ["Logitech", "HP", "Dell", "Microsoft", ""]
mouse = {
    "Logitech": ["MX Anywhere 2S", "MX Anywhere 3S", "MX Anywhere 3"],
    "HP": ["690", "695"],
    "Dell": ["MS116", "WM126", "MS5120W"],
    "Microsoft": ["Precision", "Surface Arc", "Surface"],
    "": [""]
}
mouse_click_period = ["Random", "2", "3", "4", "5", ""]
keyboard_brand = ["Logitech", "Microsoft", ""]
keyboard = {
    "Logitech": ["MX 2S", "MX 3S", "MX 3"],
    "Microsoft": ["Precision", "Surface Arc", "Surface"],
    "": [""]
}
keyboard_click_period = mouse_click_period
headset_brand = ["Logitech", "Dell", ""]
headset = {
    "Logitech": ["Zone Vibe 100", "Zone Vibe 125"],
    "Dell": ["WL3024", "WL5024", "WL7024"],
    "": [""]
}
speaker_brand = ["Sony", "Bose", "JBL", "Marshall", ""]
speaker = {
    "Sony": ["ULT-Field", "SRS-XG300", "HT-A7000"],
    "Bose": ["SoundLink Revolve II", "Smart Soundbar 900"],
    "JBL": ["Charge 5", "PartyBox 310"],
    "Marshall": ["Emberton II", "Woburn III"],
    "": [""]
}
phone_brand = ["Samsung", "Apple", ""]
phone = {
    "Samsung": ["S25 Ultra", "S25 Edge", "Z Fold 7"],
    "Apple": ["iPhone 16", "iPhone 16 Pro", "iPhone 16 Pro Max"],
    "": [""]
}
modern_standby = ["Y", "N"]
common_period = ["3", "4", "5", ""]
yn = ["Y", "N"]
power_type = ["AC", "DC"]
urgent_level = ["Fireball", "P1", "P2", "P3", ""]
fix_work_week = [f"WW{str(i).zfill(2)}" for i in range(1, 53)] + [""]
fix_bt_driver = ["23.180.0.3", "23.180.0.5", ""]
result = ["Pass", "Fail", ""]
fail_rate = {
    "Pass": ["0/200", "0/4207", "0/1000"],
    "Fail": ["1/300", "5/13245", "2/60"],
    "": [""]
}
current_status = ["Finish", "Running", "Stop"]
log_path = ["https://www.intel.com/content/www/us/en/homepage.html", None]

def random_date_2025():
    start = datetime(2025, 1, 1)
    end = datetime(2025, 12, 31, 23, 59, 59)
    return start + timedelta(seconds=random.randint(0, int((end - start).total_seconds())))

def generate_random_report():
    pb = random.choice(platform_brand)
    mb = random.choice(mouse_brand)
    kb = random.choice(keyboard_brand)
    hs = random.choice(headset_brand)
    sp = random.choice(speaker_brand)
    ph = random.choice(phone_brand)

    r = {
        "op_name": random.choice(op_name),
        "date": random_date_2025().isoformat(),
        "os_version": random.choice(os_version),
        "platform_brand": pb,
        "platform": random.choice(platform[pb]),
        "platform_phase": random.choice(platform_phase),
        "platform_bios": random.choice(platform_bios[pb]),
        "cpu": random.choice(cpu),
        "wlan": random.choice(wlan),
        "wlan_phase": random.choice(wlan_phase),
        "bt_driver": random.choice(bt_driver),
        "bt_interface": random.choice(bt_interface),
        "wifi_driver": random.choice(wifi_driver),
        "audio_driver": random.choice(audio_driver),
        "wrt_version": random.choice(wrt_version),
        "wrt_preset": random.choice(wrt_preset),
        "msft_teams_version": random.choice(msft_teams_version),
        "scenario": random.choice(scenario),
        "mouse_brand": mb,
        "mouse": random.choice(mouse[mb]),
        "mouse_click_period": random.choice(mouse_click_period),
        "keyboard_brand": kb,
        "keyboard": random.choice(keyboard[kb]),
        "keyboard_click_period": random.choice(keyboard_click_period),
        "headset_brand": hs,
        "speaker_brand": sp,
        "phone_brand": ph,
        "device1_brand": "",
        "device1": "",
        "modern_standby": random.choice(yn),
        "ms_period": random.choice(common_period),
        "ms_os_waiting_time": random.choice(common_period),
        "s4": random.choice(yn),
        "s4_period": random.choice(common_period),
        "s4_os_waiting_time": random.choice(common_period),
        "warm_boot": random.choice(yn),
        "wb_period": random.choice(common_period),
        "wb_os_waiting_time": random.choice(common_period),
        "cold_boot": random.choice(yn),
        "cb_period": random.choice(common_period),
        "cb_os_waiting_time": random.choice(common_period),
        "microsoft_teams": random.choice(yn),
        "apm": random.choice(yn),
        "apm_period": random.choice(common_period),
        "opp": "N",
        "swift_pair": "N",
        "power_type": random.choice(power_type),
        "urgent_level": random.choice(urgent_level),
        "fix_work_week": random.choice(fix_work_week),
        "fix_bt_driver": random.choice(fix_bt_driver),
        "jira_id": "",
        "ips_id": "",
        "hsd_id": "",
        "result": (res := random.choice(result)),
        "fail_rate": random.choice(fail_rate[res]),
        "current_status": random.choice(current_status),
        "log_path": random.choice(log_path)
    }
    return r

def post_report():
    data = generate_random_report()
    response = requests.post(API_URL, json=data)
    print(f"Status: {response.status_code}")
    print(response.json())

if __name__ == "__main__":
    for _ in range(30):
        # print(f"report_data: {generate_random_report()}")
        report_data = generate_random_report()
        response = requests.post(API_URL, json=report_data)
        print(f"Status: {response.status_code}, Response: {response.json()}")
