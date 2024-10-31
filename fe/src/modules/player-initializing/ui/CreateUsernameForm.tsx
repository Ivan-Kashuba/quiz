import { useToast } from '@/shared/hooks/shadcn/use-toast.ts';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { usePlayerConsumer } from '@/app/providers/PlayerProvider/PlayerProvider.tsx';
import { http } from '@/shared/lib/axios/http.ts';
import { TUser } from '@/entities/User/types/user.ts';
import { Input } from '@/ui/input.tsx';
import { FormError } from '@/ui/form-error.tsx';
import { Button } from '@/ui/button.tsx';

type TInitializeUserForm = {
  username: string;
};

export const CreateUsernameForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TInitializeUserForm>();

  const { setCurrentPlayer, setFirstTime } = usePlayerConsumer();

  const onCreateUser = async (values: TInitializeUserForm) => {
    try {
      const { data } = await http.post<TUser>('users', {
        username: values.username,
      });

      setCurrentPlayer(data);
      setFirstTime(true);

      toast({ title: `Welcome ${data.username}` });
    } catch (err: any) {
      if (err.response.data.statusCode === 409) {
        toast({
          variant: 'destructive',
          title: 'Username is already in use',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
        });
      }
    }
  };

  const onAuthorizationNavigate = () => {
    navigate('/authorize');
  };

  return (
    <div>
      <h2 className="text-2xl text-center my-4">
        To start playing create a nickname
      </h2>

      <form onSubmit={handleSubmit(onCreateUser)} className="w-[400px]">
        <Input
          id="username"
          placeholder="Username"
          {...register('username', {
            required: 'Username is required',
            validate: (value) => value.trim() !== '' || 'Username is required',
          })}
        />
        <FormError errors={errors} name={'username'} />

        <Button
          size="sm"
          variant="link"
          className="flex ml-auto"
          onClick={onAuthorizationNavigate}
        >
          Already have an username with code?
        </Button>

        <Button className="mt-3 w-full" disabled={isSubmitting} type="submit">
          Next
        </Button>
      </form>
    </div>
  );
};
