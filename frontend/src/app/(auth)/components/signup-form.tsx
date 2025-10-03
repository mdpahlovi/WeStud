"use client";

import { actions } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";

const signupSchema = Yup.object({
    firstName: Yup.string().max(15, "Must be 15 characters or less").required("First name is required"),
    lastName: Yup.string().max(20, "Must be 20 characters or less").required("Last name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

export default function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
        validationSchema: signupSchema,
        onSubmit: async (value) => {
            await actions.auth.signupUserAction(value).then((res) => {
                if (res?.success) {
                    toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
            });
        },
    });

    return (
        <form className={cn("flex flex-col gap-6", className)} onSubmit={formik.handleSubmit} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-muted-foreground text-balance">Please enter your details to get started</p>
            </div>
            <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        name="firstName"
                        type="text"
                        label="First Name"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        error={formik.errors.firstName}
                    />
                    <Input
                        name="lastName"
                        type="text"
                        label="Last Name"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        error={formik.errors.lastName}
                    />
                </div>
                <Input
                    name="email"
                    type="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.errors.email}
                />
                <Input
                    name="password"
                    type="password"
                    label="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.errors.password}
                />
                <div className="my-2 flex items-center gap-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms" className="text-muted-foreground">
                        Accept terms and conditions
                    </Label>
                </div>
                <Button type="submit" className="w-full" loading={formik.isSubmitting}>
                    Sign Up
                </Button>
            </div>
        </form>
    );
}
