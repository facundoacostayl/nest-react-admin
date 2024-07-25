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

import AddFavoriteCourseRequest from '../../models/user/AddFavoriteCourseRequest';
import courseService from '../../services/CourseService';
import UserService from '../../services/UserService';

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
  const [favoriteCourses, setFavoriteCourses] = useState<
    AddFavoriteCourseRequest[]
  >();

  useEffect(() => {
    (async () => {
      const favoriteCoursesList = await UserService.findAllFavoriteCourses();
      if (favoriteCoursesList) {
        setFavoriteCourses(favoriteCoursesList);
      }
    })();
  }, []);

  const getFavoritesOfEachCourse = (nonRepeatedIds: string[]) => {
    if (!favoriteCourses) return;
    const repeatedIds = favoriteCourses.map((course) => course.courseId);

    const idCountMap = repeatedIds.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    const counts = nonRepeatedIds.map((id) => idCountMap[id] || 0);

    return counts;
  };

  useEffect(() => {
    data &&
      setChartData({
        labels: Array.from(new Set(data.map((course) => course.name))),
        datasets: [
          {
            label: 'Marked as favorite',
            data: getFavoritesOfEachCourse(
              Array.from(new Set(data.map((course) => course.id))),
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
          text: 'Favorites of users',
        },
      },
    });
  }, [data, favoriteCourses]);

  return (
    <>
      <Bar options={chartOptions} data={chartData}></Bar>
    </>
  );
}
