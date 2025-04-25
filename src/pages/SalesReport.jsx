import React, { useState, useEffect } from 'react';
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
  const [orders, setOrders] = useState([]);
  const [reportType, setReportType] = useState('week'); // 'week' or 'month'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch orders data from API when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:9999/orders');
        if (!response.ok) {
          throw new Error('Unable to fetch orders data from the server.');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper: Get the week number of a date (ISO week number)
  const getWeekKey = (dateStr) => {
    const d = new Date(dateStr);
    // Convert to UTC date
    const utcDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set the date to Thursday (in ISO, Thursday is considered the start of the week)
    utcDate.setUTCDate(utcDate.getUTCDate() + 4 - (utcDate.getUTCDay() || 7));
    // First day of the year in ISO
    const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);
    return `${utcDate.getUTCFullYear()}-W${weekNo}`;
  };

  // Group orders by month: key format "YYYY-MM"
  const groupOrdersByMonth = (ordersList) => {
    const monthMap = {};

    ordersList.forEach(order => {
      const d = new Date(order.order_date);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { month: monthKey, totalSales: 0, orderCount: 0 };
      }
      monthMap[monthKey].totalSales += order.total_amount;
      monthMap[monthKey].orderCount += 1;
    });

    // Convert object to array
    return Object.values(monthMap).sort((a, b) => (a.month > b.month ? 1 : -1));
  };

  // Group orders by week: key format "YYYY-W{weekNo}"
  const groupOrdersByWeek = (ordersList) => {
    const weekMap = {};

    ordersList.forEach(order => {
      const weekKey = getWeekKey(order.order_date);

      if (!weekMap[weekKey]) {
        weekMap[weekKey] = { week: weekKey, totalSales: 0, orderCount: 0 };
      }
      weekMap[weekKey].totalSales += order.total_amount;
      weekMap[weekKey].orderCount += 1;
    });

    // Convert object to array and sort by week (lexicographically stable if format is consistent)
    return Object.values(weekMap).sort((a, b) => (a.week > b.week ? 1 : -1));
  };

  // Determine the chart data based on reportType
  const chartData = reportType === 'week'
    ? groupOrdersByWeek(orders)
    : groupOrdersByMonth(orders);

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading data...</p>;
  }

  if (error) {
    return <p style={{ textAlign: 'center', marginTop: '20px', color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div style={styles.container}>
      <h2>Sales and Order Report</h2>
      <div style={styles.buttonGroup}>
        <button
          onClick={() => setReportType('week')}
          style={{ 
            ...styles.button,
            backgroundColor: reportType === 'week' ? '#0056b3' : '#007BFF'
          }}
        >
          Weekly Report
        </button>
        <button
          onClick={() => setReportType('month')}
          style={{ 
            ...styles.button,
            backgroundColor: reportType === 'month' ? '#0056b3' : '#007BFF'
          }}
        >
          Monthly Report
        </button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={reportType === 'week' ? 'week' : 'month'} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSales" fill="#8884d8" name="Sales" />
          <Bar dataKey="orderCount" fill="#82ca9d" name="Orders" />
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
    marginBottom: '20px',
    textAlign: 'center'
  },
  button: {
    padding: '10px 20px',
    marginRight: '10px',
    border: 'none',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default SaleReport;
