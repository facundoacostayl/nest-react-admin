import { useState } from 'react';
import { Check, Loader } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import useAuth from '../../hooks/useAuth';
import UpdateUserRequest from '../../models/user/UpdateUserRequest';
import userService from '../../services/UserService';

export default function UpdateProfile() {
  const { authenticatedUser } = useAuth();
  const [error, setError] = useState<string>();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const { data, isLoading, refetch } = useQuery(
    `user-${authenticatedUser.id}`,
    () => userService.findOne(authenticatedUser.id),
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm<UpdateUserRequest>();

  const handleUpdateUser = async (updateUserRequest: UpdateUserRequest) => {
    try {
      if (updateUserRequest.username === data.username) {
        delete updateUserRequest.username;
      }
      await userService.update(authenticatedUser.id, updateUserRequest);
      isSubmittedHandler();
      setError(null);
      setValue('password', '');
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const isSubmittedHandler = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 1000);
  };

  if (!isLoading) {
    return (
      <div className="card shadow">
        <form
          className="py-5 flex flex-col gap-3 justify-center md:w-1/2 lg:w-1/3 mx-auto items-center"
          onSubmit={handleSubmit(handleUpdateUser)}
        >
          <h1 className="font-semibold text-4xl">{`Welcome again, ${data.firstName}`}</h1>
          <p className="mb-7 text-primary-gray">
            here you can update your account's details.
          </p>
          <hr />
          <div className="flex gap-3 w-full">
            <div className="w-1/2">
              <label className="font-semibold">First Name</label>
              <input
                type="text"
                className="input w-full mt-1"
                defaultValue={data.firstName}
                disabled={isSubmitting}
                placeholder="First Name"
                {...register('firstName')}
              />
            </div>
            <div className="w-1/2">
              <label className="font-semibold">Last Name</label>
              <input
                type="text"
                className="input w-full mt-1"
                defaultValue={data.lastName}
                disabled={isSubmitting}
                placeholder="Last Name"
                {...register('lastName')}
              />
            </div>
          </div>
          <div className="w-full">
            <label className="font-semibold">Username</label>
            <input
              type="text"
              className="input w-full mt-1"
              defaultValue={data.username}
              disabled={isSubmitting}
              placeholder="Username"
              {...register('username')}
            />
          </div>
          <div className="w-full">
            <label className="font-semibold">Password</label>
            <input
              type="password"
              className="input w-full mt-1"
              placeholder="Password (min 6 characters)"
              disabled={isSubmitting}
              {...register('password')}
            />
          </div>
          <button
            className={`btn ${isSubmitted && 'btn success'} w-full`}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader className="animate-spin mx-auto" />}
            {isSubmitted && !isSubmitting && (
              <Check className="animate-ping mx-auto" />
            )}
            {!isSubmitting && !isSubmitted && 'Update'}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </div>
    );
  }

  return null;
}
