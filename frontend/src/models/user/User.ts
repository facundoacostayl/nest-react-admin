import Course from '../course/Course';

export default interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  isActive: boolean;
  favoriteCourses: Course[];
}
