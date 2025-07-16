# Bluetooth Issue Report Dashboard (Wait to update)

Developed by **Ernie**, this GUI tool is designed to assist in testing the behavior of classic Bluetooth devices on Intel PTL/WhP platform with respect to **diversity mode switching** (Single / Dual antenna mode). 
It collects real-time data, visualizes it, screenshot while switching diversity, and generates detailed logs and reports.

## 🛠 Features
- 📡 **RSSI Hex Conversion**: Converts raw hexadecimal RSSI to signed 8-bit integers (-128 to 127).
- 🔀 **Mode Tracking**: Real-time detection of Bluetooth diversity mode (DIV_OFF / DIV_ON).
- 📈 **Live Chart Updates**: Displays ongoing RSSI and mode status using QtCharts.
- 📸 **Auto Screenshot**: Captures the application window when the mode switch occurs.
- 📊 **Excel Report Generator**:
  - Exports to `result.xlsx`
  - Includes timestamped data with mode and RSSI
  - Embeds two charts: one for mode switching, and one for RSSI signal quality

## 📁 Output Folder Structure
- All data is saved automatically to:
```
Logs/trace_YYYYMMDD_HHMMSS/
```
- Contents include:
  - `result.xlsx` — Excel report with embedded charts
  - `Screenshot_*.png` — Captures taken during each mode switch

## 📦 Requirements
- Python 3.8+
- Required libraries:
  ```bash
  pip install PyQt5 matplotlib xlsxwriter pyinstaller
  ```

## 🚀 How to Run
- Generate exe file by pyinstaller at first time:
  ```bash
  pyinstaller --name Intel_Dual_Bluetooth_Diversity_Tool --onefile --windowed --icon=./assets/images/intel_logo.ico Intel_Dual_Bluetooth_Diversity_Tool.py
  ```
- Modified python file and wanna generate exe again (already got the .spec file):
  ```bash
  pyinstaller --clean --noconfirm Intel_Dual_Bluetooth_Diversity_Tool.spec
  ```