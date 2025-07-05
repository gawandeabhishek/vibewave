"use client";

import { useEffect, useState } from "react";
import { updateUserData } from "@/actions/user";
import { getUserData } from "@/actions/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      const user = await getUserData();
      if (user) {
        setForm({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
        });
      }
      setLoading(false);
    };

    fetchInitialData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await updateUserData(form);
    setMessage(
      res.status === 200 ? "✅ Profile updated!" : "❌ Failed to update"
    );
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <Card className="max-w-7xl w-[80%] mx-10 mt-10 p-6">
      <CardContent className="space-y-4">
        <h2 className="text-xl font-bold mb-2">Update Profile</h2>

        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
          />
        </div>

        <Button className="w-full" onClick={handleSubmit}>
          Save Changes
        </Button>

        {message && <p className="text-sm mt-2 text-center">{message}</p>}
      </CardContent>
    </Card>
  );
}
