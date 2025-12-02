// hooks/useAuth.ts
import { useState } from 'react';
import { signIn } from 'next-auth/react';

interface UseAuthProps {
  redirectTo?: string;
}

export function useAuth({ redirectTo }: UseAuthProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (data: {
    email: string;
    password: string;
    name?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create account');
      }

      // After successful signup, sign the user in
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (redirectTo) {
        window.location.href = redirectTo;
      }

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const customSignin = async (data: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Authentication failed');
      }

      // Use NextAuth's signIn to establish the session
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (redirectTo) {
        window.location.href = redirectTo;
      }

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signup,
    signin: customSignin,
    isLoading,
    error,
  };
}