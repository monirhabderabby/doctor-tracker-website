import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import MotionProvider from "@/providers/motion-provider";
import LoginForm from "./_components/login-form";

const Page = () => {
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <MotionProvider>
        <Card className="w-full max-w-md md:shadow-lg shadow-none mt-5 md:mt-0">
          <CardHeader>
            <div className="flex flex-col justify-center items-center">
              <h1>Doctor Tracker</h1>
              <CardTitle>Sign in to your account to continue</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </MotionProvider>
    </div>
  );
};

export default Page;
