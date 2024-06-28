"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; // Import the Switch component
import { db, app } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";
import { ModeToggle } from "@/components/modeToggle";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedRememberMe) {
      setEmail(savedEmail || "");
      setPassword(savedPassword || "");
      setRememberMe(savedRememberMe);
    }
  }, []);

  const handleSignIn = async () => {
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/dashboard",
      });

      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        localStorage.setItem("rememberMe", rememberMe);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        localStorage.removeItem("rememberMe");
      }

      toast({
        title: "Signed in",
        description: "Sign in successful",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Sign in failed",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between items-center">
              <span className="font-bold">Sign In</span>
              <span>
                <ModeToggle />
              </span>
            </div>
          </CardTitle>
          <CardDescription>Welcome to the TSEC WEBSITE</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-4">
            <div className="flex flex-col items-start space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                type="email"
                required
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-start space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
                value={password}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="rememberMe">Remember Me</Label>
              <Switch
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleSignIn}
            disabled={!email || !password}
          >
            Sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
