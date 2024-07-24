import { BookOpen, Home, LogOut, User, Users } from 'react-feather';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import authService from '../../services/AuthService';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  className: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const history = useHistory();

  const { authenticatedUser, setAuthenticatedUser } = useAuth();

  const handleLogout = async () => {
    await authService.logout();
    setAuthenticatedUser(null);
    history.push('/login');
  };

  return (
    <div className={'sidebar ' + className}>
      <Link to="/" className="w-full no-underline text-black">
        <img
          className="mx-auto"
          src={require('../../assets/urbano-logo-black.png')}
          alt=""
        />
      </Link>
      <nav className="mt-10 flex flex-col gap-3 flex-grow">
        <SidebarItem to="/">
          <Home className="text-primary-red" /> Dashboard
        </SidebarItem>
        <SidebarItem to="/courses">
          <BookOpen className="text-primary-red" /> Courses
        </SidebarItem>
        {authenticatedUser.role === 'admin' ? (
          <SidebarItem to="/users">
            <Users className="text-primary-red" /> Users
          </SidebarItem>
        ) : null}
      </nav>
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="cursor-pointer p-2 rounded-xl bg-primary-gray hover:bg-gray-hover"
        >
          <User className="text-white" />
        </Link>
        <button
          className="text-red-500 rounded-md p-3 transition-colors flex gap-3 justify-center items-center font-semibold focus:outline-none"
          onClick={handleLogout}
        >
          <LogOut /> Logout
        </button>
      </div>
    </div>
  );
}
