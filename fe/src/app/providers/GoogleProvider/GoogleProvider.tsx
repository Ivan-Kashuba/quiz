import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactNode } from 'react';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const GoogleProvider = ({ children }: { children: ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
};
