"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function UserSettingsPage() {
  const [user, setUser] = useState({
    name: "John Doe",
    id: "1 2345 6789",
    email: "john.doe@example.com",
    profilePicture: "/placeholder.svg?height=100&width=100",
  });

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (allowedTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUser((prev) => ({
            ...prev,
            profilePicture: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please select a valid image file (jpg, jpeg, or png)");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#f7cf1d]">
          User Settings
        </h1>
        <Card className="max-w-2xl mx-auto bg-gray-900 border-[#f7cf1d]">
          <CardHeader>
            <CardTitle className="text-[#f7cf1d]">
              Your Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.profilePicture} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="profile-picture" className="cursor-pointer">
                  <Button
                    variant="outline"
                    className="bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
                  >
                    Change Profile Picture
                  </Button>
                </Label>
                <Input
                  id="profile-picture"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-400">Name</Label>
                <p className="text-lg font-semibold text-white">{user.name}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-400">User ID</Label>
                <p className="text-lg font-semibold text-white">{user.id}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-sm text-gray-400">Email</Label>
                <p className="text-lg font-semibold text-white">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
