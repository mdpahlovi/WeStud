import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
    return (
        <form className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-muted-foreground text-balance">Please enter your details to get started</p>
            </div>
            <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input name="firstName" type="text" label="First Name" required />
                    <Input name="lastName" type="text" label="Last Name" required />
                </div>
                <Input name="email" type="email" label="Email" required />
                <Input name="password" type="password" label="Password" required />
                <div className="my-2 flex items-center gap-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms" className="text-muted-foreground">
                        Accept terms and conditions
                    </Label>
                </div>
                <Button type="submit" className="w-full">
                    Sign Up
                </Button>
            </div>
        </form>
    );
}
