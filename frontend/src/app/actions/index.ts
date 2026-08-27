import { getUser, signinUserAction, signoutUserAction, signupUserAction } from "./auth";
import { enrollCourseAction, getAllCourseAction, getEnrolledCourseAction, getEnrolledCoursesAction, getOneCourseAction } from "./course";

export const actions = {
    auth: {
        signupUserAction,
        signinUserAction,
        signoutUserAction,
        getUser,
    },
    course: {
        enrollCourseAction,
        getAllCourseAction,
        getOneCourseAction,
        getEnrolledCourseAction,
        getEnrolledCoursesAction,
    },
};
