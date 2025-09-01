import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip, Badge, Spinner, Card, Row, Col } from "react-bootstrap";
import { FaServer } from "react-icons/fa";
import { PlatformStatusProps } from "types";

// interface PlatformStatus {
//   id: number;
//   serial_num: string;
//   current_status: string;
//   date: string;
// }

// Define API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PlatformStatusDashboard: React.FC = () => {
  const [platforms, setPlatforms] = useState<PlatformStatusProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlatformWithLatestInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/platforms/latest_reports`); // API endpoint
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
    const interval = setInterval(fetchPlatformWithLatestInfo, 5000);
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
      {/* <h4 className="mb-3 fw-bold">Platform Status Dashboard</h4> */}

      {/* Summary Cards */}
      <Row className="my-6">
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
      </Row>

      {/* Machine Icons */}
      <div className="d-flex flex-wrap gap-3">
        {platforms.map((platform) => (
          <OverlayTrigger
            key={platform.id}
            placement="top"
            overlay={
              <Tooltip id={`tooltip-${platform.id}`}>
                <div><strong>Serial:</strong> {platform.serial_num}</div>
                <div><strong>Platform:</strong> {platform.platform_brand} - {platform.platform}</div>
                <div><strong>CPU:</strong> {platform.cpu}</div>
                <div><strong>WLAN:</strong> {platform.wlan}</div>
                <div><strong>Status:</strong> {platform.current_status}</div>
                <div><strong>Last Status Updated:</strong> {new Date(platform.platform_date).toLocaleString()}</div>
                <div><strong>Last Report Updated:</strong> {new Date(platform.report_date).toLocaleString()}</div>
              </Tooltip>
            }
          >
            <div
              className="d-flex flex-column align-items-center p-3 border rounded shadow-sm"
              style={{ width: "120px", cursor: "pointer" }}
            >
              <FaServer size={40} className="mb-2" />
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
