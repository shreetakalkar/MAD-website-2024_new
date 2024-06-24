import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { db, app } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Bounce, ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from 'next-themes';

const Login = ({ setLoggedIn, setUser, loggedIn }) => {

  const {theme} = useTheme();
  console.log(theme)
  const isMounted = useRef(true);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const loginMsg = async () => {
    const auth = getAuth(app);
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
          });
          setLoggedIn(true);
          console.log(doc.id)
          toast.success('Logged in successfully!', {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: `${theme=='light' ? "dark" : "light"}`,
            transition: Bounce,
            });
        }

      });
    } catch (error) {

      console.error("Error signing in: ", error);
      toast.error(`Auth Error!`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: `${theme=='light' ? "dark" : "light"}`,
        transition: Bounce,
        });
    }
  };

  return (
    <div className=''>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Welcome to the TSEC WEBSITE</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid w-full gap-4'>
            <div className="flex flex-col items-start space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={handleEmailChange} />
            </div>
            <div className="flex flex-col items-start space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={handlePasswordChange} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={loginMsg}>Login</Button>
        </CardFooter>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default Login;
