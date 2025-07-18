import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (range: { startDate: Date | null; endDate: Date | null }) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ startDate, endDate, onDateChange }) => {
  const handleChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    onDateChange({ startDate: start, endDate: end });
  };

  return (
    <DatePicker
      selected={startDate}
      onChange={handleChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      isClearable
      placeholderText="Select date range"
      className="form-control w-auto"
    />
  );
};

export default DateFilter;
