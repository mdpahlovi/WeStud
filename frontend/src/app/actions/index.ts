import { getUser, signinUserAction, signoutUserAction, signupUserAction } from "./auth";

export const actions = {
    auth: {
        signupUserAction,
        signinUserAction,
        signoutUserAction,
        getUser,
    },
};
