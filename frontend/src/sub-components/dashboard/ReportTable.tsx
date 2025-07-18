// import node module libraries
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Table, Dropdown, Image } from "react-bootstrap";
import { MoreVertical } from "react-feather";

// import ReportFilters from '@/sub-components/filters/ReportFilters';
import ReportFilters from '../filters/ReportFilters';

// import SearchInput from '../filters/SearchInput';
// import DateRangePicker from '../filters/DateRangePicker';
// import MultiSelect from '../filters/MultiSelect';
// import ClearFiltersButton from '../filters/ClearFiltersButton';

// import SearchInput from '@/sub-components/filters/SearchInput';
// import DateRangePicker from '@/sub-components/filters/DateRangePicker';
// import MultiSelect from '@/sub-components/filters/MultiSelect';
// import ClearFiltersButton from '@/sub-components/filters/ClearFiltersButton';

interface ReportTableProps {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface Report {
  id: number;
  op_name: string;
  date: string;
  platform: string;
  scenario: string;
  bt_driver: string;
  wifi_driver: string;
  power_type: string;
  urgent_level: string;
  result: string;
  current_status: string;
  log_path: string;
  [key: string]: any; // ← To accommodate extra fields
}

function ReportTable() {
  const [reports, setReports] = useState<Report[]>([]);

  const [sortField, setSortField] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [resultFilter, setResultFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // For ReportFilters use
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({ startDate: null, endDate: null });

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedPlatforms([]);
    setSelectedResults([]);
    setSelectedStatuses([]);
    setDateRange({ startDate: null, endDate: null });
  };

  // useEffect(() => {
  //   fetch('http://localhost:8000/reports')
  //     .then((res) => res.json())
  //     .then((data) => setReports(data))
  //     .catch((err) => console.error('Failed to load reports:', err));
  // }, []);

  useEffect(() => {
    fetch('http://localhost:8000/reports')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('✅ Report fetch success, data:', data);
        setReports(data);
      })
      .catch((err) => {
        console.error('❌ Report failed to load reports:', err);
      });
  }, []);

  const ActionMenu = () => {
    return (
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle}>
          <MoreVertical size="15px" className="text-muted" />
        </Dropdown.Toggle>
        <Dropdown.Menu align={"end"}>
          <Dropdown.Item eventKey="1">Edit</Dropdown.Item>
          <Dropdown.Item eventKey="2">Delete</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const CustomToggle = React.forwardRef<HTMLAnchorElement, ReportTableProps>(
    ({ children, onClick }, ref) => (
      <Link
        to=""
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
        className="text-muted text-primary-hover"
      >
        {children}
      </Link>
    )
  );

  // const filteredReports = reports
  //   .filter((item) =>
  //     item.op_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.scenario.toLowerCase().includes(searchTerm.toLowerCase())
  //   )
  //   .sort((a, b) => {
  //     const fieldA = a[sortField];
  //     const fieldB = b[sortField];
  //     if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
  //     if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
  //     return 0;
  // });

  // const filteredReports = reports
  // .filter((item) => {
  //   const matchesSearch =
  //     item.op_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.scenario.toLowerCase().includes(searchTerm.toLowerCase());

  //   const matchesPlatform =
  //     platformFilter === 'All' || item.platform === platformFilter;

  //   const matchesResult =
  //     resultFilter === 'All' || item.result?.toUpperCase() === resultFilter;

  //   const matchesStatus =
  //     statusFilter === 'All' || item.current_status?.toUpperCase() === statusFilter;

  //   return matchesSearch && matchesPlatform && matchesResult && matchesStatus;
  // })
  // .sort((a, b) => {
  //   const fieldA = a[sortField];
  //   const fieldB = b[sortField];
  //   if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
  //   if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
  //   return 0;
  // });

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredReports = reports
  .filter((item) => {
    const matchesSearch =
      item.op_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.scenario.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlatform =
      selectedPlatforms.length === 0 || selectedPlatforms.includes(item.platform);

    const matchesResult =
      selectedResults.length === 0 || selectedResults.includes(item.result?.toUpperCase() || '');

    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(item.current_status?.toUpperCase() || '');

    const reportDate = new Date(item.date);
    const start = dateRange.startDate;
    const end = dateRange.endDate? new Date(new Date(dateRange.endDate).setHours(23, 59, 59, 999)) : null;

    const matchesDate = !start || !end || (reportDate >= start && reportDate <= end);
    // const matchesDate =
    //   !dateRange.startDate || !dateRange.endDate ||
    //   (reportDate >= dateRange.startDate && reportDate <= dateRange.endDate);

    return matchesSearch && matchesPlatform && matchesResult && matchesStatus && matchesDate;
  })
  .sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];
    if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  

  return (
    <Card className="h-100">
    {/* <Card.Header className="bg-white py-4">
      <h4 className="mb-0">Daily Reports</h4>
    </Card.Header> */}
    {/* <Card.Header className="bg-white py-4 d-flex justify-content-between align-items-center">
      <h4 className="mb-0">Daily Reports</h4>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control w-25"
      />
    </Card.Header> */}
    <Card.Header className="bg-white py-4">
      <h4 className="mb-2">Daily Reports</h4>
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
      <div className="d-flex flex-wrap gap-2 align-items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control w-auto"
        />

        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="form-select w-auto"
        >
          <option value="All">All Platforms</option>
          {[...new Set(reports.map((r) => r.platform))].map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>

        <select
          value={resultFilter}
          onChange={(e) => setResultFilter(e.target.value)}
          className="form-select w-auto"
        >
          <option value="All">All Results</option>
          <option value="PASS">PASS</option>
          <option value="FAIL">FAIL</option>
          <option value="">(Empty)</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-select w-auto"
        >
          <option value="All">All Status</option>
          <option value="FINISH">FINISH</option>
          <option value="RUNNING">RUNNING</option>
          <option value="STOP">STOP</option>
          <option value="">(Empty)</option>
        </select>
      </div>
    </Card.Header>

    <Table responsive className="text-nowrap">
      <thead className="table-light">
        <tr>
          <th onClick={() => handleSort('op_name')} style={{ cursor: 'pointer' }}>
            Operator {sortField === 'op_name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </th>
          <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
            Date {sortField === 'date' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </th>
          <th onClick={() => handleSort('platform')} style={{ cursor: 'pointer' }}>
            Platform {sortField === 'platform' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </th>
          <th onClick={() => handleSort('scenario')} style={{ cursor: 'pointer' }}>
            Scenario {sortField === 'scenario' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </th>
          <th onClick={() => handleSort('bt_driver')} style={{ cursor: 'pointer' }}>
            BT Driver {sortField === 'bt_driver' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </th>
          <th onClick={() => handleSort('wifi_driver')} style={{ cursor: 'pointer' }}>
            WiFi Driver {sortField === 'wifi_driver' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </th>
          <th onClick={() => handleSort('result')} style={{ cursor: 'pointer' }}>
            Result {sortField === 'result' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </th>
          <th onClick={() => handleSort('current_status')} style={{ cursor: 'pointer' }}>
            Status {sortField === 'current_status' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </th>
          <th onClick={() => handleSort('log_path')} style={{ cursor: 'pointer' }}>
            Log {sortField === 'log_path' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {filteredReports.map((item) => {
          return (
            <tr key={item.id}>
              <td className="align-middle">{item.op_name}</td>
              <td className="align-middle">{new Date(item.date).toLocaleString()}</td>
              <td className="align-middle">{item.platform}</td>
              <td className="align-middle">{item.scenario}</td>
              <td className="align-middle">{item.bt_driver}</td>
              <td className="align-middle">{item.wifi_driver}</td>
              <td className="align-middle">
                {item.result?.toUpperCase() === 'PASS' ? (
                  <span className="badge bg-success">{item.result}</span>
                ) : item.result?.toUpperCase() === 'FAIL' ? (
                  <span className="badge bg-danger">{item.result}</span>
                ) : (
                  <span>{item.result || ''}</span>
                )}
              </td>
              <td className="align-middle">
                {item.current_status?.toUpperCase() === 'FINISH' ? (
                  <span className="badge bg-success">{item.current_status}</span>
                ) : item.current_status?.toUpperCase() === 'RUNNING' ? (
                  <span className="badge bg-warning">{item.current_status}</span>
                ) : item.current_status?.toUpperCase() === 'STOP' ? (
                  <span className="badge bg-danger">{item.current_status}</span>
                ) : (
                  <span>{item.current_status || ''}</span>
                )}
              </td>
              <td className="align-middle">
                <a href={item.log_path} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                  Log Link
                </a>
              </td>
              <td className="align-middle">
                <ActionMenu />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
    </Card>
  );
}

export default ReportTable;