// import node module libraries
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Table, Dropdown, Image } from "react-bootstrap";
import { MoreVertical } from "react-feather";

// import required data files
// import { TeamsData } from "data/dashboard/TeamsData";

interface ReportTableProps {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

// const Teams = () => {
//   const CustomToggle = React.forwardRef<HTMLAnchorElement, TeamsProps>(
//     ({ children, onClick }, ref) => (
//       <Link
//         to=""
//         ref={ref}
//         onClick={(e) => {
//           e.preventDefault();
//           onClick(e);
//         }}
//         className="text-muted text-primary-hover"
//       >
//         {children}
//       </Link>
//     )
//   );

//   CustomToggle.displayName = "CustomToggle";

//   const ActionMenu = () => {
//     return (
//       <Dropdown>
//         <Dropdown.Toggle as={CustomToggle}>
//           <MoreVertical size="15px" className="text-muted" />
//         </Dropdown.Toggle>
//         <Dropdown.Menu align={"end"}>
//           <Dropdown.Item eventKey="1">Edit</Dropdown.Item>
//           <Dropdown.Item eventKey="2">Delete</Dropdown.Item>
//         </Dropdown.Menu>
//       </Dropdown>
//     );
//   };

//   return (
//     <Card className="h-100">
//       <Card.Header className="bg-white py-4">
//         <h4 className="mb-0">Teams </h4>
//       </Card.Header>
//       <Table responsive className="text-nowrap">
//         <thead className="table-light">
//           <tr>
//             <th>Name</th>
//             <th>Role</th>
//             <th>Last Activity</th>
//             <th></th>
//           </tr>
//         </thead>
//         <tbody>
//           {TeamsData.map((item) => {
//             return (
//               <tr key={item.id}>
//                 <td className="align-middle">
//                   <div className="d-flex align-items-center">
//                     <div>
//                       <Image
//                         src={item.image}
//                         alt=""
//                         className="avatar-md avatar rounded-circle"
//                       />
//                     </div>
//                     <div className="ms-3 lh-1">
//                       <h5 className=" mb-1">{item.name}</h5>
//                       <p className="mb-0">{item.email}</p>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="align-middle">{item.role}</td>
//                 <td className="align-middle">{item.lastActivity}</td>
//                 <td className="align-middle">
//                   <ActionMenu />
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </Table>
//     </Card>
//   );
// };

// export default Teams;

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

  const filteredReports = reports
  .filter((item) =>
    item.op_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.scenario.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];
    if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <Card className="h-100">
    {/* <Card.Header className="bg-white py-4">
      <h4 className="mb-0">Daily Reports</h4>
    </Card.Header> */}
    <Card.Header className="bg-white py-4 d-flex justify-content-between align-items-center">
      <h4 className="mb-0">Daily Reports</h4>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control w-25"
      />
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