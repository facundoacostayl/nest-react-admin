import UpdateProfile from '../components/dashboard/UpdateProfile';
import Layout from '../components/layout';

export default function MyUser() {
  return (
    <Layout>
      <h1 className="font-medium text-3xl mb-5">My User</h1>
      <hr />
      <div className="mt-5 flex flex-col gap-5">
        <UpdateProfile />
      </div>
    </Layout>
  );
}
