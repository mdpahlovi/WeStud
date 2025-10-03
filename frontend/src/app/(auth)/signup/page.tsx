import Link from "next/link";
import SignupForm from "../components/signup-form";

export default function SignupPage() {
    return (
        <>
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-xs">
                    <SignupForm />
                </div>
            </div>
            <p className="text-center text-muted-foreground">
                Already have an account?{" "}
                <Link href="/signin" className="text-primary">
                    Sign in
                </Link>
            </p>
        </>
    );
}
