// import node module libraries
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Table, Dropdown, Image, Spinner } from "react-bootstrap";
import { MoreVertical } from "react-feather";

import { ReportTableProps } from "types";

function ReportTable({ reports }: ReportTableProps) {
  const [sortField, setSortField] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  // const [searchTerm, setSearchTerm] = useState<string>('');

  // For ReportFilters use
  // const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  // const [selectedResults, setSelectedResults] = useState<string[]>([]);
  // const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  // const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({ startDate: null, endDate: null });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // 10 data per page

  // Auto reset to first page while changing filters
  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [searchTerm, selectedPlatforms, selectedResults, selectedStatuses, dateRange]);

  // const clearAllFilters = () => {
  //   setSearchTerm('');
  //   setSelectedPlatforms([]);
  //   setSelectedResults([]);
  //   setSelectedStatuses([]);
  //   setDateRange({ startDate: null, endDate: null });
  // };

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

  const CustomToggle = React.forwardRef<HTMLAnchorElement, { children: React.ReactNode; onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void }>(
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

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // const filteredReports = reports
  // .filter((item) => {
  //   const matchesSearch =
  //     item.op_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.scenario.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.bt_driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.wifi_driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.result.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.current_status.toLowerCase().includes(searchTerm.toLowerCase());

  //   const matchesPlatform =
  //     selectedPlatforms.length === 0 || selectedPlatforms.includes(item.platform);

  //   const matchesResult =
  //     selectedResults.length === 0 || selectedResults.includes(item.result?.toUpperCase() || '');

  //   const matchesStatus =
  //     selectedStatuses.length === 0 || selectedStatuses.includes(item.current_status?.toUpperCase() || '');

  //   const reportDate = new Date(item.date);
  //   const start = dateRange.startDate;
  //   const end = dateRange.endDate? new Date(new Date(dateRange.endDate).setHours(23, 59, 59, 999)) : null;

  //   const matchesDate = !start || !end || (reportDate >= start && reportDate <= end);
  //   // const matchesDate =
  //   //   !dateRange.startDate || !dateRange.endDate ||
  //   //   (reportDate >= dateRange.startDate && reportDate <= dateRange.endDate);

  //   return matchesSearch && matchesPlatform && matchesResult && matchesStatus && matchesDate;
  // })
  // .sort((a, b) => {
  //   const fieldA = a[sortField];
  //   const fieldB = b[sortField];
  //   if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
  //   if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
  //   return 0;
  // });

  // Pagination calculation
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentReports = reports.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(reports.length / rowsPerPage);
  // const currentReports = filteredReports.slice(indexOfFirstRow, indexOfLastRow);
  // const totalPages = Math.ceil(filteredReports.length / rowsPerPage);

  

  return (
    <Card className="h-100">

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
    
    {/* Pie chart summary 區塊 */}
    {/* <div className="mb-4">
      <Card className="p-3">
        <ReportSummary reports={filteredReports} />
      </Card>
    </div> */}

    <Card.Header className="bg-white py-4">
      <h4 className="mb-2">Daily Reports</h4>
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
        {currentReports.map((item) => {
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
                  <span className="badge bg-success d-flex align-items-center justify-content-center" style={{ height: "2em" }}>
                    {item.result}
                  </span>
                ) : item.result?.toUpperCase() === 'FAIL' ? (
                  <span className="badge bg-danger d-flex align-items-center justify-content-center" style={{ height: "2em" }}>
                    {item.result}
                  </span>
                ) : item.result?.toUpperCase() === 'ON-GOING' ? (
                  <span className="badge bg-warning d-flex align-items-center justify-content-center" style={{ height: "2em" }}>
                    <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-1"
                    />
                    {item.result}
                  </span>
                ) : (
                  <span className="badge bg-secondary d-flex align-items-center justify-content-center" style={{ height: "2em" }}>
                    {item.result || ''}
                  </span>
                )}
              </td>
              <td className="align-middle">
                {item.current_status?.toUpperCase() === 'FINISH' ? (
                  <span className="badge bg-success d-flex align-items-center justify-content-center" style={{ height: "2em" }}>
                    {item.current_status}
                  </span>
                ) : item.current_status?.toUpperCase() === 'RUNNING' ? (
                  <span className="badge bg-warning d-flex align-items-center justify-content-center" style={{ height: "2em" }}>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-1"
                    />
                    {item.current_status}
                  </span>
                ) : item.current_status?.toUpperCase() === 'STOP' ? (
                  <span className="badge bg-danger d-flex align-items-center justify-content-center" style={{ height: "2em" }}>
                    {item.current_status}
                  </span>
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
    {/* Pagination controls */}
    <div className="d-flex justify-content-between align-items-center mt-3">
      <div>
        <span>Rows per page </span>
        <select
          value={rowsPerPage}
          onChange={e => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          style={{ width: 70, display: 'inline-block' }}
        >
          {[5, 10, 20, 50].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <span> , Total: {reports.length} data</span>
      </div>
      <nav>
        <ul className="pagination mb-0">
          <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
          </li>
          <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>‹</button>
          </li>
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).slice(
            Math.max(0, currentPage - 3),
            Math.min(totalPages, currentPage + 2)
          ).map(pageNum => (
            <li key={pageNum} className={`page-item${currentPage === pageNum ? ' active' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(pageNum)}>{pageNum}</button>
            </li>
          ))}
          <li className={`page-item${currentPage === totalPages || totalPages === 0 ? ' disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}>›</button>
          </li>
          <li className={`page-item${currentPage === totalPages || totalPages === 0 ? ' disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0}>»</button>
          </li>
        </ul>
      </nav>
    </div>
    </Card>
  );
}

export default ReportTable;