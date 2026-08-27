"use client";

import { actions } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as Yup from "yup";

const signinSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

export default function SigninForm({ className, ...props }: React.ComponentProps<"form">) {
    const { setUser } = useAuthStore();
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: signinSchema,
        onSubmit: async (value) => {
            await actions.auth.signinUserAction(value).then((res) => {
                if (res?.success) {
                    toast.success(res.message);
                    setUser(res.data);
                    router.replace("/dashboard");
                } else {
                    toast.error(res.message);
                }
            });
        },
    });

    return (
        <form className={cn("flex flex-col gap-6", className)} onSubmit={formik.handleSubmit} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">Please enter your details to sign in</p>
            </div>
            <div className="grid gap-4">
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
                <div className="my-2 flex justify-between items-center gap-4">
                    <div></div>
                    <Link href="/forgot-password" className="text-primary">
                        Forgot Password?
                    </Link>
                </div>
                <Button type="submit" className="w-full" loading={formik.isSubmitting}>
                    Sign In
                </Button>
            </div>
        </form>
    );
}
