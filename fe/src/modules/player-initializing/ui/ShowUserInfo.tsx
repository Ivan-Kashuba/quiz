import { useNavigate } from 'react-router-dom';
import { usePlayerConsumer } from '@/app/providers/PlayerProvider/PlayerProvider.tsx';
import { useToast } from '@/shared/hooks/shadcn/use-toast.ts';
import clipboardCopy from 'clipboard-copy';
import { Button } from '@/ui/button.tsx';

export const ShowUserInfo = () => {
  const navigate = useNavigate();
  const { currentPlayer, setFirstTime } = usePlayerConsumer();
  const { toast } = useToast();

  const handleCopyCode = async () => {
    if (!currentPlayer?.code) return;

    try {
      await clipboardCopy(currentPlayer.code);
      toast({
        title: 'Copied to clipboard!',
      });
    } catch {
      toast({
        title: 'Failed to copy!',
        variant: 'destructive',
      });
    }
  };

  const onContinue = () => {
    navigate('/connecting-room');
    setFirstTime(false);
  };

  return (
    <div>
      <h2 className="text-2xl text-center mb-4">
        Now you can play with us! Write your code to have access to your{' '}
        <b>{currentPlayer?.username}</b> username
      </h2>
      <Button onClick={handleCopyCode} className="text-4xl m-auto flex">
        {currentPlayer?.code}
      </Button>

      <Button onClick={onContinue} className="m-auto mt-8 flex">
        Continue
      </Button>
    </div>
  );
};
