import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { http } from '@/shared/lib/axios/http.ts';
import { useForm } from 'react-hook-form';
import { LocalStorageKey } from '@/shared/lib/localstorage';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/shared/hooks/shadcn/use-toast.ts';

interface LoginForm {
  username: string;
  password: string;
}

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const { toast } = useToast();
  const navigate = useNavigate();

  const onLogin = async ({ username, password }: LoginForm) => {
    try {
      const { data } = await http.post('sa/auth/login', { username, password });

      localStorage.setItem(LocalStorageKey.accessToken, data.accessToken);
      navigate('/secure');
    } catch {
      toast({
        variant: 'destructive',
        title: 'Check credentials and try again',
      });
    }
  };

  return (
    <div className="w-screen h-screen  flex items-center justify-center">
      <form onSubmit={handleSubmit(onLogin)}>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Allow admin to moderate questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...register('username', {
                    required: 'Username is required',
                  })}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button disabled={isSubmitting} type="submit">
              Login
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
