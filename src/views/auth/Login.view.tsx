import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export function LoginView({
  username,
  password,
  onChangeUsername,
  onChangePassword,
  onSubmit,
}: {
  username: string;
  password: string;
  onChangeUsername: (value: string) => void;
  onChangePassword: (value: string) => void;
  onSubmit: () => void;
}) {
  const { register, handleSubmit, formState } = useForm<{
    username: string;
    password: string;
  }>({
    defaultValues: { username, password },
  });

  return (
    <div className="mx-auto max-w-sm p-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="leading-none">Login</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <form className="space-y-4" onSubmit={handleSubmit(() => onSubmit())}>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter username"
                {...register("username", {
                  required: true,
                  onChange: (e) =>
                    onChangeUsername((e.target as HTMLInputElement).value),
                })}
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
                {...register("password", {
                  required: true,
                  onChange: (e) =>
                    onChangePassword((e.target as HTMLInputElement).value),
                })}
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
