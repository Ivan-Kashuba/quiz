import { GoogleLogin } from '@react-oauth/google';
import { useToast } from '@/shared/hooks/shadcn/use-toast.ts';
import { http } from '@/shared/lib/axios/http.ts';
import { useNavigate } from 'react-router-dom';
import { usePlayerConsumer } from '@/app/providers/PlayerProvider/PlayerProvider.tsx';
import { TUser } from '@/entities/User/types/user.ts';

export const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { setCurrentPlayer, setFirstTime } = usePlayerConsumer();
  const { toast } = useToast();

  return (
    <GoogleLogin
      size="large"
      width="500px"
      onSuccess={async (credentialResponse) => {
        const googleToken = credentialResponse.credential;

        const response = await http.post<TUser>(`auth/google`, {
          token: googleToken,
        });

        setCurrentPlayer(response.data);
        setFirstTime(false);

        navigate('/connecting-room');
      }}
      onError={() => {
        toast({
          variant: 'destructive',
          title:
            'Login with Google failed, try again later or use another authentication method',
        });
      }}
    />
  );
};
