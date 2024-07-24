import axios from 'axios';
import { useState } from 'react';
import { Check, Loader, Plus, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import ReactPaginate from 'react-paginate';
import { useQuery } from 'react-query';

import CoursesTable from '../components/courses/CoursesTable';
import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import useAuth from '../hooks/useAuth';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import courseService from '../services/CourseService';

export default function Courses() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [addCourseShow, setAddCourseShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [imageToUpload, setImageToUpload] = useState(null);

  const { authenticatedUser } = useAuth();
  const { data, isLoading } = useQuery(
    ['courses', name, description],
    () =>
      courseService.findAll({
        name: name || undefined,
        description: description || undefined,
      }),
    {
      refetchInterval: 1000,
    },
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  //const clientsPerPage = data.length / 5;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateCourseRequest>();

  const saveCourse = async (createCourseRequest: CreateCourseRequest) => {
    try {
      if (imageToUpload) {
        const imageUrl = await uploadImage();
        createCourseRequest.imageUrl = imageUrl;
      }

      await courseService.save(createCourseRequest);
      isSubmittedHandler();
      addCourseShowHandler();
      reset();
      setError(null);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append('file', imageToUpload);
    formData.append('upload_preset', 'qd303rrl');

    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dwviwb8zr/image/upload',
      formData,
    );

    return response.data.url;
  };

  const isSubmittedHandler = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 1000);
  };

  const addCourseShowHandler = () => {
    setTimeout(() => {
      setAddCourseShow(false);
    }, 1000);
  };

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">Manage Courses</h1>
      <hr />
      {authenticatedUser.role !== 'user' ? (
        <button
          className="btn my-5 flex gap-2 w-full sm:w-auto justify-center"
          onClick={() => setAddCourseShow(true)}
        >
          <Plus /> Add Course
        </button>
      ) : null}

      <div className="table-filter">
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="input w-1/2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <CoursesTable data={data} isLoading={isLoading} />
      {/*<ReactPaginate
        breakLabel="..."
        pageRangeDisplayed={5}
        previousLabel={'<'}
        nextLabel={'>'}
        pageCount={clientsPerPage}
        onPageChange={changePage}
        containerClassName="flex gap-5 justify-center items-center py-5"
        previousLinkClassName="text-lg font-semibold text-blue-800 border border-gray-200 shadow-md p-2 rounded-full"
        nextLinkClassName="text-lg font-semibold text-blue-800 border border-gray-200 shadow-md p-2 rounded-full"
        disabledClassName="hidden"
        activeClassName="text-lg font-semibold text-white bg-blue-800 p-1 px-3 rounded-full"
      />*/}

      {/* Add User Modal */}
      <Modal show={addCourseShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Add Course</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setAddCourseShow(false);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveCourse)}
        >
          <input
            type="text"
            className="input"
            placeholder="Name"
            disabled={isSubmitting}
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder="Description"
            disabled={isSubmitting}
            required
            {...register('description')}
          />
          <label className="text-primary-gray mt-3" htmlFor="image-input">
            Upload an image (optional)
          </label>
          <input
            title="image-input"
            type="file"
            onChange={(e) => setImageToUpload(e.target.files[0])}
          />
          <button
            className={`btn ${isSubmitted && 'btn success'} w-full`}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader className="animate-spin mx-auto" />}
            {isSubmitted && !isSubmitting && (
              <Check className="animate-ping mx-auto" />
            )}
            {!isSubmitting && !isSubmitted && 'Save'}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </Modal>
    </Layout>
  );
}
