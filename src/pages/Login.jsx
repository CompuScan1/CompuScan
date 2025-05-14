import LoginForm from '../components/LoginForm';

export default function Login() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
        <LoginForm />
      </div>
    </div>
  );
} 