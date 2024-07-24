//CHARTJS
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useQuery } from 'react-query';

import courseService from '../../services/CourseService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

export default function BarChart() {
  const [chartOptions, setChartOptions] = useState({});
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const { data, isLoading } = useQuery('courses', () =>
    courseService.findAll({
      name: undefined,
      description: undefined,
    }),
  );

  useEffect(() => {
    data &&
      setChartData({
        labels: Array.from(new Set(data.map((course) => course.name))),
        datasets: [
          {
            label: 'Assignations',
            data: Object.values(
              data.reduce((acc, course) => {
                acc[course.name] = (acc[course.name] || 0) + 1;
                return acc;
              }, {}),
            ),

            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgb(255, 159, 64)',
            borderWidth: 1,
          },
          {
            label: 'Marked as favorite',
            data: Object.values(
              data.reduce((acc, course) => {
                acc[course.name] = (acc[course.name] || 0) + 1;
                return acc;
              }, {}),
            ),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
          },
        ],
      });
    setChartOptions({
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: 'true',
          text: 'Our popular courses:',
        },
      },
    });
  }, [data]);

  return (
    <>
      <Bar options={chartOptions} data={chartData}></Bar>
    </>
  );
}
