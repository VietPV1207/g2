import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const SaleReport = () => {
  // State để chọn hiển thị báo cáo theo tuần hoặc theo tháng
  const [reportType, setReportType] = useState('week');

  // Dữ liệu báo cáo theo tuần (giá trị giả lập)
  const weeklyData = [
    { week: 'Week 1', totalSales: 343, orderCount: 5 },
    { week: 'Week 2', totalSales: 410, orderCount: 3 },
    { week: 'Week 3', totalSales: 520, orderCount: 4 },
    { week: 'Week 4', totalSales: 600, orderCount: 7 }
  ];

  // Dữ liệu báo cáo theo tháng (giá trị giả lập)
  const monthlyData = [
    { month: 'January', totalSales: 1200, orderCount: 10 },
    { month: 'February', totalSales: 1500, orderCount: 12 },
    { month: 'March', totalSales: 2000, orderCount: 15 },
    { month: 'April', totalSales: 1800, orderCount: 14 },
    { month: 'May', totalSales: 2100, orderCount: 16 },
    { month: 'June', totalSales: 1900, orderCount: 13 }
  ];

  // Xác định dữ liệu cần hiển thị dựa trên loại báo cáo
  const data = reportType === 'week' ? weeklyData : monthlyData;

  return (
    <div style={styles.container}>
      <h2>Sales Report - {reportType === 'week' ? 'Weekly' : 'Monthly'}</h2>
      <div style={styles.buttonGroup}>
        <button
          onClick={() => setReportType('week')}
          style={{
            ...styles.button,
            backgroundColor: reportType === 'week' ? '#0056b3' : styles.button.backgroundColor
          }}
        >
          Weekly Report
        </button>
        <button
          onClick={() => setReportType('month')}
          style={{
            ...styles.button,
            backgroundColor: reportType === 'month' ? '#0056b3' : styles.button.backgroundColor
          }}
        >
          Monthly Report
        </button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={reportType === 'week' ? 'week' : 'month'} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSales" fill="#8884d8" name="Total Sales" />
          <Bar dataKey="orderCount" fill="#82ca9d" name="Order Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  buttonGroup: {
    marginBottom: '20px'
  },
  button: {
    padding: '10px 20px',
    marginRight: '10px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default SaleReport;
