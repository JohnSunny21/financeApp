import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

// We have to register the components we want to use from chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const CategoryChart = ({ chartData, theme }) => {
  if (!chartData || chartData.length == 0) {
    return (
      <p className="text-center mt-4">
        No expense data for this month to display a chart.
      </p>
    );
  }

  const textColor = theme === "dark" ? "#f8f9fa" : "#212529";

  const data = {
    labels: chartData.map((d) => d.category),
    datasets: [
      {
        label: "Spending",
        data: chartData.map((d) => d.totalAmount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#C9CBCF",
          "#E7E9ED",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        lables: {
          color: textColor, // Apply theme color
        },
      },
      title: {
        display: true,
        text: "Spending by Category (Current Month)",
        color: textColor,
      },
    },
  };

  return (
    <div style={{ maxwidth: "450px", margin: "auto" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default CategoryChart;
