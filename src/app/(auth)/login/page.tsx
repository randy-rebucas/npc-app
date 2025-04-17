import { AuthActions } from '@/modules/auth/actions/auth';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
        <form className="mt-8 space-y-6">
          <button
            onClick={() => AuthActions.signIn()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
          >
            Sign in with Logto
          </button>
        </form>
      </div>
    </div>
  );
} 