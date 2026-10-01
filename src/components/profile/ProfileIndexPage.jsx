import Styles from "./_profile.module.css";
import { useAuth } from "../../hooks/FetchUser";
import { useEffect, useState } from "react";

// let courses = [
//   {
//     course_name: "reactjs",
//     trainer: "shashi",
//     duration: "1month",
//     price: 10000,
//     date: "10/5/2026",
//   },
//   {
//     course_name: "spring",
//     trainer: "dixit",
//     duration: "1month",
//     price: 10000,
//     date: "11/5/2026",
//   },
// ];
const ProfileIndexPage = () => {
  const { user , getAllCoursesApi , getEnrollCourseApi} = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEnrolledCourses = async () => {
      if (!user?.courses?.length) {
        setEnrolledCourses([]);
        setLoading(false);
        return;
      }
            try {
        // Get all course details
        const courseResponse = await getAllCoursesApi();
        const allCourses = courseResponse?.courses ?? [];

        // Get the IDs of courses the user enrolled in
        const enrolledCourseIds = user.courses.map(
          (course) => course._id
        );

        // Get details + content for each enrolled course
        const enrolledData = await Promise.all(
          enrolledCourseIds.map(async (courseId) => {
            const course = allCourses.find(
              (item) => item._id === courseId
            );
            const contentResponse =
              await getEnrollCourseApi(courseId);

            return {
              course,
              content: contentResponse?.content ?? []
            };
          })
        );
        setEnrolledCourses(enrolledData);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };

    getEnrolledCourses();
  }, [user]);

  return (
    <aside className={Styles.content}>
      <main>
        <div>
          <strong>Email</strong>
          <span>{user?.email}</span>
        </div>
        <div>
          <strong>Role</strong>
          <span>{user?.role}</span>
        </div>
        {/* <div className={Styles.courses}>
          {courses?.map((course) => {
            return (
              <main key={course?._id}>
                <h1>{course.name}</h1>
                <p>
                  <span>level</span> <span>{course?.level}</span>
                </p>
                <p>
                  <span>tags</span> <span>{course?.tags}</span>
                </p>
                <p>
                  <span>price</span> <span>{course?.price}</span>
                </p>
              </main>
            );
          })}

        </div> */}
                <section>
          <h2>My Courses</h2>

          {loading && <p>Loading enrolled courses...</p>}

          {!loading && enrolledCourses.length === 0 && (
            <p>You haven't enrolled in any courses yet.</p>
          )}

          {!loading &&
            enrolledCourses.map((item) => (
            <article className={Styles.profileCourse}
             key={item.course?._id}>
              <img
                className={Styles.profileCourse__image}
                src={item.course?.thumbnail?.url}
                alt={item.course?.name}
              />

              <div className={Styles.profileCourse__details}>
                <h3 className={Styles.profileCourse__title}>
                  {item.course?.name}
                </h3>

                <p className={Styles.profileCourse__description}>
                  {item.course?.description}
                </p>

                <p>
                  Lessons: {item.content.length}
                </p>
              </div>
            </article>
            ))}
        </section>
      </main>
    </aside>
  );
};

export default ProfileIndexPage;
