import Link from "next/link";
import SigninForm from "../signin-form";

export default function SigninPage() {
    return (
        <>
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-xs">
                    <SigninForm />
                </div>
            </div>
            <p className="text-center text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary">
                    Sign up
                </Link>
            </p>
        </>
    );
}
