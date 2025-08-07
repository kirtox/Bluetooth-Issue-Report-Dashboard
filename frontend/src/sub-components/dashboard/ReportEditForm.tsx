import React from "react";
import { Form, Card, Row, Col } from "react-bootstrap";
import { Report } from "types";

interface ReportEditFormProps {
  report: Report | null;
  onChange: (report: Report) => void;
  readonly?: boolean;
}

const ReportEditForm: React.FC<ReportEditFormProps> = ({ report, onChange, readonly = false }) => {
  if (!report) return null;

  const handleFieldChange = (field: keyof Report, value: any) => {
    onChange({ ...report, [field]: value });
  };

  const renderField = (
    label: string,
    field: keyof Report,
    type: string = "text",
    colSize: number = 6
  ) => (
    <Form.Group as={Col} md={colSize} className="mb-3">
      <Form.Label className="fw-bold">{label}</Form.Label>
      <Form.Control
        type={type}
        value={report[field] || ""}
        onChange={(e) => handleFieldChange(field, e.target.value)}
        readOnly={readonly}
      />
    </Form.Group>
  );

  return (
    <Form>

      {/* Basic Info. */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="fw-bold">Operator</Card.Title>
          <Row>
            {renderField("Date", "date", "datetime-local")}
          </Row>
          <Card.Title className="fw-bold">Date</Card.Title>
          <Row>
            {renderField("Date", "date", "datetime-local")}
          </Row>
        </Card.Body>
      </Card>

      {/* Platform Info. */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="fw-bold">Platform Info.</Card.Title>
          <Row>
            {renderField("Platform Brand", "platform_brand")}
            {renderField("Platform", "platform")}
            {renderField("Platform Phase", "platform_phase")}
            {renderField("CPU", "cpu")}
          </Row>
          <Card.Title className="fw-bold">System Info.</Card.Title>
          <Row>
            {renderField("OS Version", "os_version")}
            {renderField("Platform BIOS", "platform_bios")}
            {renderField("MS Teams Version", "msft_teams_version")}
          </Row>
        </Card.Body>
      </Card>

      {/* Wireless Info. */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="fw-bold">Wireless Module</Card.Title>
          <Row>
            {renderField("WLAN", "wlan")}
            {renderField("WLAN Phase", "wlan_phase")}
            {renderField("BT Interface", "bt_interface")}
          </Row>
          <Card.Title className="fw-bold">Drivers Version</Card.Title>
          <Row>
            {renderField("BT Driver", "bt_driver")}
            {renderField("WiFi Driver", "wifi_driver")}
            {renderField("Audio Driver", "audio_driver")}
          </Row>
        </Card.Body>
      </Card>

      {/* System Info. */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
            <Card.Title className="fw-bold">System Info.</Card.Title>
          <Row>
            {renderField("OS Version", "os_version")}
            {renderField("Platform Brand", "platform_brand")}
            {renderField("Platform", "platform")}
            {renderField("Platform Phase", "platform_phase")}
            {renderField("Platform BIOS", "platform_bios")}
            {renderField("CPU", "cpu")}
          </Row>
        </Card.Body>
      </Card>

      {/* WRT settings */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="fw-bold">WRT 資訊</Card.Title>
          <Row>
            {renderField("WRT Version", "wrt_version")}
            {renderField("WRT Preset", "wrt_preset")}
          </Row>
        </Card.Body>
      </Card>

      {/* Test scenario */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="fw-bold">Test Scenario</Card.Title>
          <Row>
            {renderField("Scenario", "scenario")}
          </Row>
          <Card.Title className="fw-bold">Test Accessories</Card.Title>
          <Row>
            {renderField("Mouse Brand", "mouse_brand")}
            {renderField("Mouse", "mouse")}
            {/* {renderField("Keyboard Brand", "keyboard_brand")}
            {renderField("Headset Brand", "headset_brand")}
            {renderField("Keyboard Type", "keyboard_type")}
            {renderField("Headset Type", "headset_type")} */}
          </Row>
        </Card.Body>
      </Card>

      {/* 其他區塊可再擴充如下：測試場景、滑鼠鍵盤資訊、裝置資訊、S4流程、結果等 */}
    </Form>
  );
};

export default ReportEditForm;
