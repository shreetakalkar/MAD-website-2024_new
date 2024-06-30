// SignIn.tsx
import React, { useState, useRef, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { db, auth } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from "./ui/use-toast";
import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const { toast } = useToast();
  const router = useRouter();
  const isMounted = useRef(true);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { user, setUser, setLoggedIn } = useUser();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    } else {
      const storedEmail = localStorage.getItem("rememberMeEmail");
      const storedPassword = localStorage.getItem("rememberMePassword");
      if (storedEmail && storedPassword) {
        setEmail(storedEmail);
        setPassword(storedPassword);
        setRememberMe(true);
      }
    }
    return () => {
      isMounted.current = false;
    };
  }, [user, router]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
  };

  const loginMsg = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const facultyRef = collection(db, "Faculty");
      const querySnapshot = await getDocs(facultyRef);

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (doc.id === user.uid) {
          setUser({
            name: data.name,
            email: data.email,
            type: data.type,
            uid : user.uid
          });
          setLoggedIn(true);
          if (rememberMe) {
            localStorage.setItem("rememberMeEmail", email);
            localStorage.setItem("rememberMePassword", password);
          } else {
            localStorage.removeItem("rememberMeEmail");
            localStorage.removeItem("rememberMePassword");
          }
          toast({
            title: "Sign In successful",
            description: "Redirecting to dashboard",
          });
          router.push("/dashboard");
        }
      });
    } catch (error) {
      console.error("Error signing in: ", error);
      toast({
        title: "Error signing in",
        description: "Please check your email and password",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Welcome to the TSEC WEBSITE</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-4">
            <div className="flex flex-col items-start space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="flex flex-col items-start space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={handleRememberMeChange}
              />
              <Label htmlFor="remember-me">Remember Me</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={loginMsg}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
