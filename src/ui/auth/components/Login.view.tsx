import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/lib/components/ui/card";
import { Label } from "@/ui/lib/components/ui/label";
import { Input } from "@/ui/lib/components/ui/input";
import { Button } from "@/ui/lib/components/ui/button";
import { useForm } from "react-hook-form";

interface LoginViewProps {
  onLogin: (username: string, password: string) => void;
}

export function LoginView(props: LoginViewProps) {
  const { onLogin } = props;
  const { register, handleSubmit, formState } = useForm<{
    username: string;
    password: string;
  }>();

  function onSubmit(data: { username: string; password: string }) {
    onLogin(data.username, data.password);
  }

  return (
    <div className="mx-auto max-w-sm p-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="leading-none">Login</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter username"
                {...register("username", { required: true })}
              />
              {formState.errors.username && (
                <div className="text-sm text-destructive">
                  Username is required
                </div>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                {...register("password", { required: true })}
              />
              {formState.errors.password && (
                <div className="text-sm text-destructive">
                  Password is required
                </div>
              )}
            </div>
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
