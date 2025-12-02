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
import { useState } from "react";
import type { Role } from "@/domain/auth/auth.type";

interface RegisterViewProps {
  rolesOptions: Role[];
  onRegister: (username: string, password: string, roles: Role[]) => void;
}

export function RegisterView(props: RegisterViewProps) {
  const { rolesOptions, onRegister } = props;
  const { register, handleSubmit, formState } = useForm<{
    username: string;
    password: string;
  }>();
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);

  function toggleRole(role: Role) {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  }

  function onSubmit(data: { username: string; password: string }) {
    onRegister(data.username, data.password, selectedRoles);
  }

  return (
    <div className="mx-auto max-w-sm p-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="leading-none">Register</CardTitle>
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
            <div className="space-y-2">
              <Label>Roles</Label>
              <div className="grid gap-2">
                {rolesOptions.map((role) => (
                  <label key={role} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onChange={() => toggleRole(role)}
                    />
                    <span>{role}</span>
                  </label>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
