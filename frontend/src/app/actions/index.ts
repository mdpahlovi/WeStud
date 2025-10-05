import { getUser, signinUserAction, signoutUserAction, signupUserAction } from "./auth";
import { getAllCourseAction, getOneCourseAction } from "./course";

export const actions = {
    auth: {
        signupUserAction,
        signinUserAction,
        signoutUserAction,
        getUser,
    },
    course: {
        getAllCourseAction,
        getOneCourseAction,
    },
};
