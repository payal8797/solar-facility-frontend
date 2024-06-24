import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Brush
} from 'recharts';
import { format } from 'date-fns';
import {Box} from '@mui/material';

const LineChartComponent = ({
  filteredData,
  interval,
  showPower,
  showEnergy
}) => {
  return (
    <Box mt={4}>
      {filteredData.length > 0 && (
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={filteredData}>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timeStr) => {
                switch (interval) {
                  case 'all':
                  case '15-min':
                    return format(new Date(timeStr), 'MM-dd HH:mm');
                  case 'hourly':
                    return format(new Date(timeStr), 'MM-dd HH:mm');
                  case 'daily':
                    return format(new Date(timeStr), 'yyyy-MM-dd');
                  default:
                    return format(new Date(timeStr), 'MM-dd HH:mm');
                }
              }} />
            <YAxis
              label={{
                value: 'Active Power (in kW)',
                angle: -90,
                position: 'insideLeft',
                offset: 10,
              }} />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'activePower') {
                  return [`${value} kW`, 'Active Power'];
                } else if (name === 'energy') {
                  return [`${value} kW/h`, 'Energy'];
                } else {
                  return [value];
                }
              }}
            />
            <Legend verticalAlign="top" />
            {showPower && <Line type="monotone" dataKey="activePower" stroke="#8884d8" />}
            {showEnergy && <Line type="monotone" dataKey="energy" stroke="#82ca9d" />}
            <Brush dataKey="timestamp" tickFormatter={(timeStr) => format(new Date(timeStr), 'yyyy-MM-dd HH:mm')} height={30} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export { LineChartComponent };
