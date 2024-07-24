import { useQuery } from 'react-query';

import BarChart from '../components/dashboard/BarChart';
import UpdateProfile from '../components/dashboard/UpdateProfile';
import Layout from '../components/layout';
import courseService from '../services/CourseService';
import statsService from '../services/StatsService';

export default function Dashboard() {
  const { data, isLoading } = useQuery('stats', statsService.getStats);

  return (
    <Layout>
      <h1 className="font-medium text-3xl mb-5">Dashboard</h1>
      <hr />
      <div className="mt-5 flex flex-col gap-5">
        {!isLoading ? (
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="card shadow text-white bg-gray-600 flex-1">
              <h1 className="font-semibold sm:text-4xl text-center mb-3">
                {data.numberOfUsers}
              </h1>
              <p className="text-center sm:text-lg font-semibold">Users</p>
            </div>
            <div className="card shadow text-white bg-[#d95054] flex-1">
              <h1 className="font-semibold sm:text-4xl mb-3 text-center">
                {data.numberOfCourses}
              </h1>
              <p className="text-center sm:text-lg font-semibold">Courses</p>
            </div>
            <div className="card shadow text-white bg-[#dd5f5f] flex-1">
              <h1 className="font-semibold sm:text-4xl mb-3 text-center">
                {data.numberOfContents}
              </h1>
              <p className="text-center sm:text-lg font-semibold">Contents</p>
            </div>
          </div>
        ) : null}
      </div>
      <div className="hidden mx-auto md:block md:w-5/6 xxl:w-4/6 mt-10">
        <BarChart />
      </div>
    </Layout>
  );
}
