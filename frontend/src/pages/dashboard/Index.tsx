// import node module libraries
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Container, Col, Row, Card } from "react-bootstrap";

// import widget/custom components
import { StatRightTopIcon } from "widgets";

// import sub components
import { ActiveProjects, Teams, TasksPerformance } from "sub-components";

// import cpu icon selection
import { getCpuIcon } from "../../data/dashboard/CPUIcon";

// import required data files
// import ProjectsStatsData from "data/dashboard/ProjectsStatsData";
import { useCPUStats } from "../../data/dashboard/CPUStats";
import ReportTable from "sub-components/dashboard/ReportTable";
import React, { useState, useEffect } from "react";

import ReportFilters from "sub-components/filters/ReportFilters";
import { Report } from "sub-components/dashboard/ReportTable";

// import ReportPieChart from "sub-components/dashboard/ReportPieChart";
import ReportDoughnutChart from "sub-components/dashboard/ReportDoughnutChart";
import ReportBarChart from "sub-components/dashboard/ReportBarChart";


const Dashboard = () => {
  const { stats, loading } = useCPUStats();

  // 報表資料與 filter 狀態
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({ startDate: null, endDate: null });

  useEffect(() => {
    fetch('http://localhost:8000/reports')
      .then(res => res.json())
      .then(data => setReports(data));
  }, []);

  const filteredReports = reports.filter((item) => {
    const matchesSearch =
      item.op_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.scenario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bt_driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.wifi_driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.result.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.current_status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform =
      selectedPlatforms.length === 0 || selectedPlatforms.includes(item.platform);
    const matchesResult =
      selectedResults.length === 0 || selectedResults.includes(item.result?.toUpperCase() || '');
    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(item.current_status?.toUpperCase() || '');
    const reportDate = new Date(item.date);
    const start = dateRange.startDate;
    const end = dateRange.endDate ? new Date(new Date(dateRange.endDate).setHours(23, 59, 59, 999)) : null;
    const matchesDate = !start || !end || (reportDate >= start && reportDate <= end);
    return matchesSearch && matchesPlatform && matchesResult && matchesStatus && matchesDate;
  });

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedPlatforms([]);
    setSelectedResults([]);
    setSelectedStatuses([]);
    setDateRange({ startDate: null, endDate: null });
  };

  console.log("Dashboard");
  return (
    <Fragment>
      <div className="bg-primary pt-10 pb-21"></div>
      <Container fluid className="mt-n22 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="mb-2 mb-lg-0">
                  <h3 className="mb-0  text-white">Bluetooth Issue Report Dashboard</h3>
                </div>
                <div>
                  <Link to="#" className="btn btn-white">
                    Create New Project
                  </Link>
                </div>
              </div>
            </div>
          </Col>
          {/* {ProjectsStatsData.map((item, index) => {
            console.log('ProjectsStatsData item:', item, 'index:', index);
            return (
              <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={index}>
                <StatRightTopIcon info={item} />
              </Col>
            );
          })} */}
          <Row>
            {loading ? (
              <div>Loading...</div>
            ) : (
              stats.map((item, index) => (
                <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={index}>
                  <StatRightTopIcon
                    info={{
                      id: index,
                      cpu: item.cpu,
                      count: item.count,
                      icon: getCpuIcon(item.cpu),
                    }}
                  />
                </Col>
              ))
            )}
          </Row>
        </Row>

        {/* Pie chart summary area */}
        <Row className="my-6">
          <Col lg={12} md={12} xs={12}>
            <Card className="p-3 mb-4">
              <h4 className="mb-2">Charts</h4>
              <Row>
                <Col lg={6} md={12} xs={12}>
                  <ReportDoughnutChart reports={filteredReports} field="result" title="Results" />
                </Col>
                <Col lg={6} md={12} xs={12}>
                  <ReportDoughnutChart reports={filteredReports} field="bt_driver" title="BT drivers" />
                </Col>
                <Col lg={12} md={12} xs={12} className="mt-4">
                  <ReportDoughnutChart reports={filteredReports} field="scenario" title="Scenarios" />
                </Col>
              </Row>
              {/* 你可以加更多 PieChart */}
            </Card>
          </Col>
        </Row>

        {/* Line chart summary area */}
        <Row className="my-6">
          <Col lg={12} md={12} xs={12}>
            <Card className="p-3 mb-4">
              <h4 className="mb-2">Trend Charts</h4>
              <Row>
                <Col lg={6} md={12} xs={12}>
                  <ReportBarChart reports={filteredReports} field="bt_driver" title="BT drivers" />
                </Col>
                <Col lg={6} md={12} xs={12}>
                  <ReportBarChart reports={filteredReports} field="platform_brand" title="Platform Brand" />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Filter 區塊 */}
        <Row className="my-6">
          <Col lg={12} md={12} xs={12}>
            <Card className="p-3 mb-4">
              <h4 className="mb-2">Report Filters</h4>
              <ReportFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                platformOptions={[...new Set(reports.map(r => r.platform))]}
                selectedPlatforms={selectedPlatforms}
                setSelectedPlatforms={setSelectedPlatforms}
                resultOptions={['PASS', 'FAIL', '']}
                selectedResults={selectedResults}
                setSelectedResults={setSelectedResults}
                statusOptions={['FINISH', 'RUNNING', 'STOP', '']}
                selectedStatuses={selectedStatuses}
                setSelectedStatuses={setSelectedStatuses}
                dateRange={dateRange}
                setDateRange={setDateRange}
                onClear={clearAllFilters}
              />
            </Card>
          </Col>
          
          {/* Table 區塊 */}
          <Col lg={12} md={12} xs={12}>
            <ReportTable reports={filteredReports} />
          </Col>
        </Row>

        
        <Row className="my-6">
          
        </Row>

        <ActiveProjects />

        <Row className="my-6">
          <Col xl={4} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">
            <TasksPerformance />
          </Col>

          <Col xl={8} lg={12} md={12} xs={12}>
            <Teams />
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};
export default Dashboard;
