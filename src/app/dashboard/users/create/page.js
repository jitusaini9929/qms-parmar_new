"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const allowedPermissions = ["question:create"];

export default function CreateUserPage() {
  const router = useRouter();

  const [roles, setRoles] = useState([
    { _id: 'ADMIN', name: 'Admin' },
    { _id: 'REVIEWER', name: 'Question Reviewer' },
    { _id: 'USER', name: 'User' }
  ]);
  const [selectedRole, setSelectedRole] = useState('USER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = {
      name: e.currentTarget.name.value,
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
      role: selectedRole,
    };

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/dashboard/users");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create user");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create User</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* show error */}
          {error && (
            <div className="p-2 text-sm text-red-600 bg-red-100 rounded">
              {error}
            </div>
          )}

          {/* name */}
          <div>
            <Label htmlFor="name" className="mb-2">Name</Label>
            <Input id="name" name="name" required />
          </div>

          {/* email */}
          <div>
            <Label htmlFor="email" className="mb-2">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>

          {/* password */}
          <div>
            <Label htmlFor="password" className="mb-2">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>

          {/* roles checkboxes/radios */}
          <div>
            <Label>Role</Label>
            <div className="flex flex-col space-y-2 mt-1">
              {roles.map((role) => {
                const isChecked = selectedRole === role._id;

                return (
                  <label
                    key={role._id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role._id}
                      checked={isChecked}
                      onChange={() => setSelectedRole(role._id)}
                      className="h-4 w-4"
                    />
                    <span>{role.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
