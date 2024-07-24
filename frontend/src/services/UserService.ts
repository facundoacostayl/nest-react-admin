import AddFavoriteCourseRequest from '../models/user/AddFavoriteCourseRequest';
import addFavoriteCourseRequest from '../models/user/AddFavoriteCourseRequest';
import CreateUserRequest from '../models/user/CreateUserRequest';
import UpdateUserRequest from '../models/user/UpdateUserRequest';
import User from '../models/user/User';
import UserQuery from '../models/user/UserQuery';
import apiService from './ApiService';

class UserService {
  async save(createUserRequest: CreateUserRequest): Promise<void> {
    await apiService.post('/api/users', createUserRequest);
  }

  async findAll(userQuery: UserQuery): Promise<User[]> {
    return (
      await apiService.get<User[]>('/api/users', {
        params: userQuery,
      })
    ).data;
  }

  async findOne(id: string): Promise<User> {
    return (await apiService.get<User>(`/api/users/${id}`)).data;
  }

  async update(
    id: string,
    updateUserRequest: UpdateUserRequest,
  ): Promise<void> {
    const {
      firstName,
      isActive,
      lastName,
      password,
      role,
      username,
    } = updateUserRequest;
    await apiService.put(`/api/users/${id}`, {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      username: username || undefined,
      role: role || undefined,
      isActive,
      password: password || undefined,
    });
  }

  async delete(id: string): Promise<void> {
    await apiService.delete(`/api/users/${id}`);
  }

  async addFavoriteCourse(
    addFavoriteCourseRequest: AddFavoriteCourseRequest,
  ): Promise<void> {
    await apiService.post('/api/users/favorite', addFavoriteCourseRequest);
  }

  async deleteFavoriteCourse(
    addFavoriteCourseRequest: AddFavoriteCourseRequest,
  ): Promise<void> {
    await apiService.delete(
      `/api/users/favorite/${addFavoriteCourseRequest.userId}/${addFavoriteCourseRequest.courseId}`,
    );
  }

  async findFavoriteCourses(id: string) {
    const response = (await apiService.get(`api/users/favorite/user/${id}`))
      .data;
    return response;
  }
}

export default new UserService();
