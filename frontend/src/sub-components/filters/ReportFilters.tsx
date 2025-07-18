// src/sub-components/filters/ReportFilters.tsx
import React, { useState } from 'react';
import { MultiSelect, Option } from 'react-multi-select-component';
import { DateRange, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import DateFilter from "../filters/DateFilter";

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
    </div>
  );
};

export default ReportFilters;
