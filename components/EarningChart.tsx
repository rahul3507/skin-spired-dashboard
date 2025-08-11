import { useGetEarningQuery } from "@/redux/feature/dashboardAPI";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const EarningChart = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const { data: earning, isLoading } = useGetEarningQuery();

  // Map the fetched data to the format required by recharts
  const chartData =
    earning?.data?.[0]?.earnings?.map((item: any) => ({
      name: item.month, // X-axis: month (e.g., 'Jan', 'Feb')
      totalAmount: item.totalAmount, // Y-axis: earnings
    })) || [];

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
    // Future: Add logic to fetch data for the selected year if API supports it
  };

  // Show loading state while fetching data
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle case when no data is available
  if (!earning?.data?.[0]?.earnings) {
    return <div>No earnings data available.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 my-7">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Earnings Overview
        </h2>
        {/* <select
          value={selectedYear}
          onChange={handleYearChange}
          className="border border-gray-300 rounded px-4 py-1 text-sm focus:outline-none"
        >
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
        </select> */}
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalAmount"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name="Earnings"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EarningChart;
