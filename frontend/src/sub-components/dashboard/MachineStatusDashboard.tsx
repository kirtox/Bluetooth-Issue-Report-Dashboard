import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip, Badge, Spinner, Card } from "react-bootstrap";
import { FaServer } from "react-icons/fa";

interface MachineStatus {
  id: number;
  serial_num: string;
  current_status: string;
  date: string;
}

// Define API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MachineStatusDashboard: React.FC = () => {
  const [machines, setMachines] = useState<MachineStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMachines = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/platforms/`); // API endpoint
      const data = await response.json();
      setMachines(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching machine status:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
    const interval = setInterval(fetchMachines, 5000);
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
    const total = machines.length;
    const online = machines.filter(m => m.current_status.toLowerCase() === "online").length;
    const running = machines.filter(m => m.current_status.toLowerCase() === "running").length;
    const offline = machines.filter(m => m.current_status.toLowerCase() === "offline").length;
    return { total, online, running, offline };
  };

  const summary = getSummary();

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
        <p>Loading machine status...</p>
      </div>
    );
  }

  return (
    <div>
      {/* <h4 className="mb-3 fw-bold">Machine Status Dashboard</h4> */}

      {/* Summary Cards */}
      <div className="d-flex gap-3 mb-4">
        <Card className="p-3 text-center shadow-sm">
          <h6>Total</h6>
          <h5>{summary.total}</h5>
        </Card>
        <Card className="p-3 text-center shadow-sm">
          <h6 className="text-success">Online</h6>
          <h5>{summary.online}</h5>
        </Card>
        <Card className="p-3 text-center shadow-sm">
          <h6 className="text-primary">Running</h6>
          <h5>{summary.running}</h5>
        </Card>
        <Card className="p-3 text-center shadow-sm">
          <h6 className="text-danger">Offline</h6>
          <h5>{summary.offline}</h5>
        </Card>
      </div>

      {/* Machine Icons */}
      <div className="d-flex flex-wrap gap-3">
        {machines.map((machine) => (
          <OverlayTrigger
            key={machine.id}
            placement="top"
            overlay={
              <Tooltip id={`tooltip-${machine.id}`}>
                <div><strong>Serial:</strong> {machine.serial_num}</div>
                <div><strong>Status:</strong> {machine.current_status}</div>
                <div><strong>Last Updated:</strong> {new Date(machine.date).toLocaleString()}</div>
              </Tooltip>
            }
          >
            <div
              className="d-flex flex-column align-items-center p-3 border rounded shadow-sm"
              style={{ width: "120px", cursor: "pointer" }}
            >
              <FaServer size={40} className="mb-2" />
              <Badge bg={getBadgeVariant(machine.current_status)}>
                {machine.current_status}
              </Badge>
            </div>
          </OverlayTrigger>
        ))}
      </div>
    </div>
  );
};

export default MachineStatusDashboard;
