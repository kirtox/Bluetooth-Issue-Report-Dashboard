// src/sub-components/filters/ReportFilters.tsx
import React, { useState } from 'react';
import { MultiSelect, Option } from 'react-multi-select-component';
// import { DateRange, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import DateFilter from "../filters/DateFilter";
import { Download } from 'react-feather';

interface ReportFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;

  platformOptions: string[];
  selectedPlatforms: string[];
  setSelectedPlatforms: (values: string[]) => void;

  resultOptions: string[];
  selectedResults: string[];
  setSelectedResults: (values: string[]) => void;

  statusOptions: string[];
  selectedStatuses: string[];
  setSelectedStatuses: (values: string[]) => void;

  dateRange: { startDate: Date | null; endDate: Date | null };
  setDateRange: (range: { startDate: Date | null; endDate: Date | null }) => void;

  onClear: () => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  platformOptions,
  selectedPlatforms,
  setSelectedPlatforms,
  resultOptions,
  selectedResults,
  setSelectedResults,
  statusOptions,
  selectedStatuses,
  setSelectedStatuses,
  dateRange,
  setDateRange,
  onClear,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      // 構建查詢參數
      const params = new URLSearchParams();
      
      if (searchTerm) {
        params.append('search_term', searchTerm);
      }
      
      if (selectedPlatforms.length > 0) {
        params.append('platforms', selectedPlatforms.join(','));
      }
      
      if (selectedResults.length > 0) {
        params.append('results', selectedResults.join(','));
      }
      
      if (selectedStatuses.length > 0) {
        params.append('statuses', selectedStatuses.join(','));
      }
      
      if (dateRange.startDate) {
        params.append('start_date', dateRange.startDate.toISOString());
      }
      
      if (dateRange.endDate) {
        params.append('end_date', dateRange.endDate.toISOString());
      }
      
      // 發送請求
      const response = await fetch(`http://localhost:8000/export/excel?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      // 下載檔案
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reports_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="d-flex flex-wrap gap-3 align-items-center mb-3">
        <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control w-auto"
        />

        <MultiSelect
        options={platformOptions.map(p => ({ label: p, value: p }))}
        value={selectedPlatforms.map(p => ({ label: p, value: p }))}
        onChange={(selected: Option[]) => setSelectedPlatforms(selected.map(s => s.value))}
        labelledBy="Select Platforms"
        className="w-auto"
        />

        <MultiSelect
        options={resultOptions.map(r => ({ label: r, value: r }))}
        value={selectedResults.map(r => ({ label: r, value: r }))}
        onChange={(selected: Option[]) => setSelectedResults(selected.map(s => s.value))}
        labelledBy="Select Results"
        className="w-auto"
        />

        <MultiSelect
        options={statusOptions.map(s => ({ label: s, value: s }))}
        value={selectedStatuses.map(s => ({ label: s, value: s }))}
        onChange={(selected: Option[]) => setSelectedStatuses(selected.map(s => s.value))}
        labelledBy="Select Status"
        className="w-auto"
        />

        {/* <DateRange
        ranges={[{
            startDate: dateRange.startDate || new Date(),
            endDate: dateRange.endDate || new Date(),
            key: 'selection',
        }]}
        onChange={(item: RangeKeyDict) => {
            const { startDate, endDate } = item.selection;
            setDateRange({ startDate, endDate });
        }}
        className="bg-white border p-2 rounded shadow-sm"
        /> */}


        <DateFilter
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateChange={(range) => setDateRange(range)}
        />

        <button className="btn btn-outline-secondary" onClick={onClear}>Clear All</button>
        
        <button 
          className="btn btn-success d-flex align-items-center gap-2" 
          onClick={handleExportExcel}
          disabled={isExporting}
        >
          <Download size={16} />
          {isExporting ? 'Exporting...' : 'Export Excel'}
        </button>
    </div>
  );
};

export default ReportFilters;
