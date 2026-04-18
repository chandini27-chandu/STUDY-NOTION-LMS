import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
import { getAllCourses } from "../../../services/operations/courseDetailsAPI"
import Img from './../../common/Img';



export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  console.log("EnrolledCourses user:", user);
  console.log("EnrolledCourses token:", token);

  const [enrolledCourses, setEnrolledCourses] = useState(null)
  const [availableCourses, setAvailableCourses] = useState(null)
  const [availableLoading, setAvailableLoading] = useState(false)

  // fetch available courses for students when they have no enrolled courses
  const getAvailableCourses = async () => {
    try {
      setAvailableLoading(true)
      const res = await getAllCourses()
      setAvailableCourses(res)
    } catch (error) {
      console.log("Could not fetch available courses.", error)
    } finally {
      setAvailableLoading(false)
    }
  }

  // fetch all users enrolled courses
  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);
      console.log("Fetched courses response:", res);
      console.log("User account type:", user?.accountType);
      setEnrolledCourses(res);

      if (user?.accountType !== 'Instructor' && res?.length === 0) {
        await getAvailableCourses()
      }
    } catch (error) {
      console.log("Could not fetch enrolled courses.", error)
    }
  };

  useEffect(() => {
    if (token) {
      getEnrolledCourses();
    }
  }, [token, user])

  const showAvailableCourses =
    user?.accountType !== 'Instructor' &&
    enrolledCourses?.length === 0 &&
    availableCourses?.length > 0

  const showNoEnrollmentMessage =
    user?.accountType !== 'Instructor' &&
    enrolledCourses?.length === 0 &&
    !availableLoading &&
    availableCourses?.length === 0

  // Loading Skeleton
  const sklItem = () => {
    return (
      <div className="flex border border-richblack-700 px-5 py-3 w-full">
        <div className="flex flex-1 gap-x-4 ">
          <div className='h-14 w-14 rounded-lg skeleton '></div>

          <div className="flex flex-col w-[40%] ">
            <p className="h-2 w-[50%] rounded-xl  skeleton"></p>
            <p className="h-2 w-[70%] rounded-xl mt-3 skeleton"></p>
          </div>
        </div>

        <div className="flex flex-[0.4] flex-col ">
          <p className="h-2 w-[20%] rounded-xl skeleton mt-2"></p>
          <p className="h-2 w-[40%] rounded-xl skeleton mt-3"></p>
        </div>
      </div>
    )
  }



  return (
    <>
      <div className="text-4xl text-richblack-5 font-boogaloo text-center sm:text-left">
        {user?.accountType === 'Instructor' ? 'My Courses' : 'Enrolled Courses'}
      </div>
      {
        <div className="my-8 text-richblack-5">
          {/* Headings */}
          <div className="flex rounded-t-2xl bg-richblack-800 ">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            {showAvailableCourses ? (
              <p className="flex-1 px-2 py-3">Action</p>
            ) : (
              user?.accountType !== 'Instructor' && <p className="flex-1 px-2 py-3">Progress</p>
            )}
          </div>

          {/* loading Skeleton */}
          {(!enrolledCourses || (enrolledCourses.length === 0 && availableLoading)) && <div >
            {sklItem()}
            {sklItem()}
            {sklItem()}
            {sklItem()}
            {sklItem()}
          </div>}

          {/* No courses message */}
          {showNoEnrollmentMessage && (
            <div className="flex items-center justify-center border border-richblack-700 rounded-b-2xl px-5 py-8">
              <p className="text-center text-richblack-5 text-lg">
                You have not enrolled in any course yet.
              </p>
            </div>
          )}

          {/* Available courses for students when they have no enrollments */}
          {showAvailableCourses && availableCourses?.map((course, i, arr) => (
            <div
              className={`flex flex-col sm:flex-row sm:items-center border border-richblack-700 ${i === arr.length - 1 ? "rounded-b-2xl" : "rounded-none"}`}
              key={i}
            >
              <div
                className="flex sm:w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                onClick={() => navigate(`/courses/${course?._id}`)}
              >
                <Img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-14 w-14 rounded-lg object-cover"
                />

                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold">{course.courseName}</p>
                  <p className="text-xs text-richblack-300">
                    {course.courseDescription?.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>

              <div className='sm:hidden'>
                <div className=" px-2 py-3">N/A</div>
                <div className="flex sm:w-2/5 flex-col gap-2 px-2 py-3">
                  <button
                    className="rounded-md bg-yellow-25 px-4 py-2 text-black"
                    onClick={() => navigate(`/courses/${course?._id}`)}
                  >
                    View Course
                  </button>
                </div>
              </div>

              <div className="hidden sm:flex w-1/3 px-2 py-3">N/A</div>
              <div className="hidden sm:flex w-1/5 px-2 py-3">
                <button
                  className="rounded-md bg-yellow-25 px-4 py-2 text-black"
                  onClick={() => navigate(`/courses/${course?._id}`)}
                >
                  View Course
                </button>
              </div>
            </div>
          ))}

          {/* Course Names */}
          {!showAvailableCourses && enrolledCourses?.map((course, i, arr) => (
            <div
              className={`flex flex-col sm:flex-row sm:items-center border border-richblack-700 ${i === arr.length - 1 ? "rounded-b-2xl" : "rounded-none"}`}
              key={i}
            >
              <div
                className={`flex ${user?.accountType === 'Instructor' ? 'sm:w-[70%]' : 'sm:w-[45%]'} cursor-pointer items-center gap-4 px-5 py-3`}
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  )
                }}
              >
                <Img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-14 w-14 rounded-lg object-cover"
                />

                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold">{course.courseName}</p>
                  <p className="text-xs text-richblack-300">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>

              {/* only for smaller devices */}
              {/* duration -  progress */}
              <div className='sm:hidden'>
                <div className=" px-2 py-3">{course?.totalDuration}</div>

                {user?.accountType !== 'Instructor' && (
                  <div className="flex sm:w-2/5 flex-col gap-2 px-2 py-3">
                    <p>Progress: {course.progressPercentage || 0}%</p>
                    <ProgressBar
                      completed={course.progressPercentage || 0}
                      height="8px"
                      isLabelVisible={false}
                    />
                  </div>
                )}
              </div>

              {/* only for larger devices */}
              {/* duration -  progress */}
              <div className={`hidden sm:flex ${user?.accountType === 'Instructor' ? 'w-1/3' : 'w-1/5'} px-2 py-3`}>{course?.totalDuration}</div>
              {user?.accountType !== 'Instructor' && (
                <div className="hidden sm:flex w-1/5 flex-col gap-2 px-2 py-3">
                  <p>Progress: {course.progressPercentage || 0}%</p>
                  <ProgressBar
                    completed={course.progressPercentage || 0}
                    height="8px"
                    isLabelVisible={false}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      }
    </>
  )
}