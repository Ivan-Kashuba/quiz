import { useToast } from '@/shared/hooks/shadcn/use-toast.ts';
import { useForm } from 'react-hook-form';
import { usePlayerConsumer } from '@/app/providers/PlayerProvider/PlayerProvider.tsx';
import { http } from '@/shared/lib/axios/http.ts';
import { TUser } from '@/entities/User/types/user.ts';
import { Input } from '@/ui/input.tsx';
import { FormError } from '@/ui/form-error.tsx';
import { Button } from '@/ui/button.tsx';
import { useNavigate } from 'react-router-dom';

type TAuthorizeUserForm = {
  username: string;
  code: string;
};

export const AuthorizationPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TAuthorizeUserForm>();

  const { setCurrentPlayer, setFirstTime } = usePlayerConsumer();

  const onAuthorizeUser = async (values: TAuthorizeUserForm) => {
    try {
      const { data } = await http.post<TUser>('users/check', {
        username: values.username,
        code: values.code,
      });

      setCurrentPlayer(data);
      setFirstTime(false);

      toast({ title: `Welcome back ${data.username} !` });
      navigate('/connecting-room');
    } catch (err: any) {
      if (err.response.data.statusCode === 401) {
        toast({
          variant: 'destructive',
          title: 'Check credentials and try again',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
        });
      }
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center">
      <h2 className="text-2xl text-center my-4">
        Play with existing username and code
      </h2>

      <form onSubmit={handleSubmit(onAuthorizeUser)} className="w-[400px] ">
        <div className="mb-6">
          <Input
            id="username"
            {...register('username', {
              required: 'Username is required',
              validate: (value) =>
                value.trim() !== '' || 'Username is required',
            })}
            placeholder="Username"
          />
          <FormError errors={errors} name={'username'} />
        </div>

        <Input
          id="code"
          {...register('code', {
            required: 'Code is required',
            validate: (value) => value.trim() !== '' || 'Username is required',
          })}
          placeholder="Code"
        />
        <FormError errors={errors} name={'code'} />

        <Button
          type="button"
          size="sm"
          variant="link"
          className="flex ml-auto"
          onClick={() => navigate('/')}
        >
          Don't have account ?
        </Button>

        <Button className="mt-6 w-full" disabled={isSubmitting} type="submit">
          Next
        </Button>
      </form>
    </div>
  );
};
