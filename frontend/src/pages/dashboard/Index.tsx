// import node module libraries
import { Fragment } from "react";
// import { Link } from "react-router-dom";
import { Container, Col, Row, Card } from "react-bootstrap";

// import widget/custom components
import { StatRightTopIcon } from "widgets";

// import sub components
// import { ActiveProjects, Teams, TasksPerformance } from "sub-components";

// import cpu icon selection
import { getCpuIcon } from "../../data/dashboard/CPUIcon";

// import required data files
// import ProjectsStatsData from "data/dashboard/ProjectsStatsData";
import { useCPUStats } from "../../data/dashboard/CPUStats";
import ReportTable from "sub-components/dashboard/ReportTable";
import { useState, useEffect } from "react";

import ReportFilters from "sub-components/filters/ReportFilters";
import { Report } from "types";

// import ReportPieChart from "sub-components/dashboard/ReportPieChart";
import ReportDoughnutChart from "sub-components/dashboard/ReportDoughnutChart";
// import ReportBarChart from "sub-components/dashboard/ReportBarChart";

// Need to fix
// import PlatformStatusDashboard from "sub-components/dashboard/PlatformStatusDashboard";


import ReportCrossBarChart from "sub-components/dashboard/ReportCrossBarChart";
import ReportDurationChart from "sub-components/dashboard/ReportDurationChart";

const Dashboard = () => {
  const { stats, loading } = useCPUStats();

  // reports data and filter condition
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatformBrands, setSelectedPlatformBrands] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedWlans, setSelectedWlans] = useState<string[]>([]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [selectedBTDrivers, setSelectedBTDrivers] = useState<string[]>([]);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  // const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({ startDate: null, endDate: null });

  // useEffect(() => {
  //   fetch('http://localhost:8000/reports')
  //     .then(res => res.json())
  //     .then(data => setReports(data));
  // }, []);

  // Define API_BASE_URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchReports = () => {
    fetch(`${API_BASE_URL}/reports`)
      .then(res => res.json())
      .then(data => setReports(data));
  };
  
  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports.filter((item) => {
    const matchesSearch =
      item.op_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.platform_brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.wlan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.scenario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bt_driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.wifi_driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.result.toLowerCase().includes(searchTerm.toLowerCase());
      // item.current_status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatformBrand =
      selectedPlatformBrands.length === 0 || selectedPlatformBrands.includes(item.platform_brand);
    const matchesPlatform =
      selectedPlatforms.length === 0 || selectedPlatforms.includes(item.platform);
    const matchesWlan =
      selectedWlans.length === 0 || selectedWlans.includes(item.wlan);
    const matchesScenario =
      selectedScenarios.length === 0 || selectedScenarios.includes(item.scenario);
    const matchesBTDriver =
      selectedBTDrivers.length === 0 || selectedBTDrivers.includes(item.bt_driver);
    const matchesResult =
      selectedResults.length === 0 || selectedResults.includes(item.result?.toUpperCase() || '');
    // const matchesStatus =
    //   selectedStatuses.length === 0 || selectedStatuses.includes(item.current_status?.toUpperCase() || '');
    const reportDate = new Date(item.date);
    const start = dateRange.startDate;
    const end = dateRange.endDate ? new Date(new Date(dateRange.endDate).setHours(23, 59, 59, 999)) : null;
    const matchesDate = !start || !end || (reportDate >= start && reportDate <= end);
    return matchesSearch && matchesPlatformBrand && matchesPlatform && matchesWlan && matchesScenario 
            && matchesBTDriver && matchesResult && matchesDate;
  });


  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedPlatformBrands([]);
    setSelectedPlatforms([]);
    setSelectedWlans([]);
    setSelectedScenarios([]);
    setSelectedBTDrivers([]);
    setSelectedResults([]);
    // setSelectedStatuses([]);
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
                {/* <div>
                  <Link to="#" className="btn btn-white">
                    Create New Project
                  </Link>
                </div> */}
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
              {/* <h4 className="mb-2">Pie Charts</h4> */}
              <Row>
                <Col lg={6} md={12} xs={12}>
                  <ReportDoughnutChart reports={filteredReports} field="result" title="Total test results" />
                </Col>
                <Col lg={6} md={12} xs={12}>
                  <ReportDoughnutChart reports={filteredReports} field="bt_driver" title="Test by Bluetooth driver version" />
                </Col>
                <Col lg={12} md={12} xs={12} className="mt-4">
                  <ReportDoughnutChart reports={filteredReports} field="scenario" title="Total test by scenario" />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Bar chart summary area */}
        {/* <Row className="my-6">
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
        </Row> */}

        {/* Cross Bar summary area */}
        <Row className="my-6">
          <Col lg={12} md={12} xs={12}>
            <Card className="p-3 mb-4">
              {/* <h4 className="mb-2">Bar Charts</h4> */}
              <Row>
                <Col lg={6} md={12} xs={12}>
                  {/* <ReportCrossBarChart
                    fieldX="bt_driver"
                    fieldY="platform"
                    title="Total completed tests by Bluetooth driver version and platform"
                  /> */}
                  <ReportCrossBarChart
                    reports={filteredReports}
                    fieldX="bt_driver"
                    fieldY="platform"
                    title="Total completed tests by Bluetooth driver Ver. and platform"
                  />
                </Col>
                <Col lg={6} md={12} xs={12}>
                  {/* <ReportCrossBarChart
                    fieldX="bt_driver"
                    fieldY="scenario"
                    title="Total completed tests by Bluetooth driver Ver. and scenario"
                  /> */}
                  <ReportCrossBarChart
                    reports={filteredReports}
                    fieldX="bt_driver"
                    fieldY="scenario"
                    title="Total completed tests by Bluetooth driver Ver. and scenario"
                  />
                </Col>
              </Row>
              <Row>
                <Col lg={6} md={12} xs={12}>
                  {/* <ReportCrossBarChart
                    fieldX="platform"
                    fieldY="scenario"
                    title="Total completed tests by platform and scenario"
                  /> */}
                  <ReportCrossBarChart
                    reports={filteredReports}
                    fieldX="platform"
                    fieldY="scenario"
                    title="Total completed tests by platform and scenario"
                  />
                </Col>
                <Col lg={6} md={12} xs={12}>
                  {/* <ReportDurationChart title="BT Driver Duration Accumulation" /> */}
                  <ReportDurationChart
                    reports={filteredReports}
                    title="Total duration (hours) by Bluetooth driver"
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Machine status area */}
        {/* <Row className="my-6">
          <Col lg={12} md={12} xs={12}>
            <Card className="p-3 mb-4">
              <h4 className="mb-2">Platform Status Dashboard</h4>
              <Row>
                <PlatformStatusDashboard />
              </Row>
            </Card>
          </Col>
        </Row> */}


        {/* Filter area */}
        <Row className="my-6">
          <Col lg={12} md={12} xs={12}>
            <Card className="p-3 mb-4">
              <h4 className="mb-2">Report Filters</h4>
              <ReportFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                
                platformBrandOptions={[...new Set(reports.map(r => r.platform_brand))]}
                selectedPlatformBrands={selectedPlatformBrands}
                setSelectedPlatformBrands={setSelectedPlatformBrands}

                platformOptions={[...new Set(reports.map(r => r.platform))]}
                selectedPlatforms={selectedPlatforms}
                setSelectedPlatforms={setSelectedPlatforms}

                wlanOptions={[...new Set(reports.map(r => r.wlan))]}
                selectedWlans={selectedWlans}
                setSelectedWlans={setSelectedWlans}

                scenarioOptions={[...new Set(reports.map(r => r.scenario))]}
                selectedScenarios={selectedScenarios}
                setSelectedScenarios={setSelectedScenarios}

                btDriverOptions={[...new Set(reports.map(r => r.bt_driver))]}
                selectedBTDrivers={selectedBTDrivers}
                setSelectedBTDrivers={setSelectedBTDrivers}

                resultOptions={['PASS', 'FAIL', '']}
                selectedResults={selectedResults}
                setSelectedResults={setSelectedResults}

                // statusOptions={['FINISH', 'RUNNING', 'STOP', '']}
                // selectedStatuses={selectedStatuses}
                // setSelectedStatuses={setSelectedStatuses}

                dateRange={dateRange}
                setDateRange={setDateRange}
                onClear={clearAllFilters}
              />
            </Card>
          </Col>
          
          {/* Table area */}
          <Col lg={12} md={12} xs={12}>
            {/* <ReportTable reports={filteredReports} /> */}
            <ReportTable reports={filteredReports} onReload={fetchReports} />
          </Col>
        </Row>

        {/* <ActiveProjects /> */}

        {/* <Row className="my-6">
          <Col xl={4} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">
            <TasksPerformance />
          </Col>

          <Col xl={8} lg={12} md={12} xs={12}>
            <Teams />
          </Col>
        </Row> */}
      </Container>
    </Fragment>
  );
};
export default Dashboard;
