import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip, Badge, Spinner, Card, Row, Col, Popover } from "react-bootstrap";
import { PlatformStatusProps } from "types";

// Define API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 動態匯入 icons（也可以用 Vite 的 import.meta.glob）
import DellIcon from "@/assets/platform-icons/platform_dell.png";
import HpIcon from "@/assets/platform-icons/platform_hp.png";
import LenovoIcon from "@/assets/platform-icons/platform_lenovo.png";
import IntelIcon from "@/assets/platform-icons/platform_intel.png";
import SamsungIcon from "@/assets/platform-icons/platform_samsung.png";
import MicrosoftIcon from "@/assets/platform-icons/platform_microsoft.png";
import AcerIcon from "@/assets/platform-icons/platform_acer.png";
import AsusIcon from "@/assets/platform-icons/platform_asus.png";
import RazerIcon from "@/assets/platform-icons/platform_razer.png";
import MsiIcon from "@/assets/platform-icons/platform_msi.png";
import PanasonicIcon from "@/assets/platform-icons/platform_panasonic.png";
import FujitsuIcon from "@/assets/platform-icons/platform_fujitsu.png";
import HonorIcon from "@/assets/platform-icons/platform_honor.png";
import HuaweiIcon from "@/assets/platform-icons/platform_huawei.png";
import OppoIcon from "@/assets/platform-icons/platform_oppo.png";
import XiaomiIcon from "@/assets/platform-icons/platform_xiaomi.png";
import OthersIcon from "@/assets/platform-icons/platform_others.png";

const PlatformStatusDashboard: React.FC = () => {
  const [platforms, setPlatforms] = useState<PlatformStatusProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlatformWithLatestInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/platforms/latest_reports`);
      const data = await response.json();
      setPlatforms(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching platform latest Info.:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatformWithLatestInfo();
    const interval = setInterval(fetchPlatformWithLatestInfo, 60000);
    return () => clearInterval(interval);
  }, []);

  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
        return "success";
      case "running":
        return "primary";
      case "offline":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getSummary = () => {
    const total = platforms.length;
    const online = platforms.filter(m => m.current_status.toLowerCase() === "online").length;
    const running = platforms.filter(m => m.current_status.toLowerCase() === "running").length;
    const offline = platforms.filter(m => m.current_status.toLowerCase() === "offline").length;
    return { total, online, running, offline };
  };

  const summary = getSummary();

  const summaryData = [
    { label: "Total", value: summary.total },
    { label: "Online", value: summary.online, className: "text-success" },
    { label: "Running", value: summary.running, className: "text-primary" },
    { label: "Offline", value: summary.offline, className: "text-danger" },
  ];

  // 根據 platform 判斷 icon
  // const getPlatformIcon = (platformBrand: string): string => {
  //   console.log("getPlatformIcon: ", platformBrand);
  //   const name = platformBrand.toLowerCase();
  //   if (name.includes("dell")) return DellIcon;
  //   else if (name.includes("hp")) return HpIcon;
  //   else if (name.includes("lenovo")) return LenovoIcon;
  //   else if (name.includes("intel")) return IntelIcon;
  //   else if (name.includes("samsung")) return SamsungIcon;
  //   else if (name.includes("microsoft")) return MicrosoftIcon;
  //   else if (name.includes("acer")) return AcerIcon;
  //   else if (name.includes("asus")) return AsusIcon;
  //   else if (name.includes("razer")) return RazerIcon;
  //   else if (name.includes("msi")) return MsiIcon;
  //   else if (name.includes("panasonic")) return PanasonicIcon;
  //   else if (name.includes("fujitsu")) return FujitsuIcon;
  //   else if (name.includes("honor")) return HonorIcon;
  //   else if (name.includes("huawei")) return HuaweiIcon;
  //   else if (name.includes("oppo")) return OppoIcon;
  //   else if (name.includes("xiaomi")) return XiaomiIcon;
  //   return OthersIcon;
  // };
  const platformIcons: Record<string, string> = {
    dell: DellIcon,
    hp: HpIcon,
    lenovo: LenovoIcon,
    intel: IntelIcon,
    samsung: SamsungIcon,
    microsoft: MicrosoftIcon,
    acer: AcerIcon,
    asus: AsusIcon,
    razer: RazerIcon,
    msi: MsiIcon,
    panasonic: PanasonicIcon,
    fujitsu: FujitsuIcon,
    honor: HonorIcon,
    huawei: HuaweiIcon,
    oppo: OppoIcon,
    xiaomi: XiaomiIcon,
  };
  
  const getPlatformIcon = (brand: string): string => {
    if (!brand) return OthersIcon;
    const key = brand.toLowerCase();
    return platformIcons[key] || OthersIcon;
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
        <p>Loading platform status...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Cards */}
      {/* <Row className="my-6">
        <Col xl={3} lg={6} md={12} xs={12} className="mt-6">
          <Card className="p-3 text-center shadow-sm">
            <h6>Total</h6>
            <h5>{summary.total}</h5>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={12} xs={12} className="mt-6">
          <Card className="p-3 text-center shadow-sm">
            <h6 className="text-success">Online</h6>
            <h5>{summary.online}</h5>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={12} xs={12} className="mt-6">
          <Card className="p-3 text-center shadow-sm">
            <h6 className="text-primary">Running</h6>
            <h5>{summary.running}</h5>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={12} xs={12} className="mt-6">
          <Card className="p-3 text-center shadow-sm">
            <h6 className="text-danger">Offline</h6>
            <h5>{summary.offline}</h5>
          </Card>
        </Col>
      </Row> */}
      

      <Row className="my-6">
        {summaryData.map((item, idx) => (
          <Col key={idx} xl={3} lg={6} md={12} xs={12} className="mt-6">
            <Card className="p-3 text-center shadow-sm">
              <h6 className={item.className}>{item.label}</h6>
              <h5>{item.value}</h5>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Machine Icons */}
      <div className="d-flex flex-wrap gap-3">
        {platforms.map((platform) => (
          <OverlayTrigger
            key={platform.id}
            placement="top"
            overlay={
              // <Tooltip id={`tooltip-${platform.id}`}>
              //   <div><strong>Serial Number:</strong> {platform.serial_num}</div>
              //   <div><strong>Platform:</strong> {platform.platform_brand} - {platform.platform}</div>
              //   <div><strong>CPU:</strong> {platform.cpu}</div>
              //   <div><strong>WLAN:</strong> {platform.wlan}</div>
              //   <div><strong>Status:</strong> {platform.current_status}</div>
              //   <div><strong>Last Status Updated:</strong> {new Date(platform.platform_date).toLocaleString()}</div>
              //   <div><strong>Last Report Updated:</strong> {new Date(platform.report_date).toLocaleString()}</div>
              // </Tooltip>
              <Popover id={`popover-${platform.id}`} className="shadow-lg">
                <Card style={{ width: "220px" }}>
                  <Card.Body>
                    <Card.Title className="fs-6">{platform.platform_brand}</Card.Title>
                    <ul className="list-unstyled mb-0">
                      <li><strong>Serial Number:</strong> {platform.serial_num}</li>
                      <li><strong>Platform:</strong> {platform.platform}</li>
                      <li><strong>CPU:</strong> {platform.cpu}</li>
                      <li><strong>WLAN:</strong> {platform.wlan}</li>
                      <li><strong>Status:</strong> {platform.current_status}</li>
                      <li><strong>Last Status Updated:</strong> {new Date(platform.platform_date).toLocaleString()}</li>
                      <li><strong>Last Report Updated:</strong> {new Date(platform.report_date).toLocaleString()}</li>
                    </ul>
                  </Card.Body>
                </Card>
              </Popover>
            }
          >
            <div
              className="d-flex flex-column align-items-center p-3 border rounded shadow-sm"
              style={{ width: "120px", cursor: "pointer" }}
            >
              <img
                src={getPlatformIcon(platform.platform_brand)}
                alt={platform.platform_brand}
                style={{ width: "40px", height: "40px", marginBottom: "10px" }}
              />
              <Badge bg={getBadgeVariant(platform.current_status)}>
                {platform.current_status}
              </Badge>
            </div>
          </OverlayTrigger>
        ))}
      </div>
    </div>
  );
};

export default PlatformStatusDashboard;
