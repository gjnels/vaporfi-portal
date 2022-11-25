import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/authContext";
import { PageTitle } from "../../components/ui/PageTitle";
import { Input } from "../../components/ui/FormInputs";
import { Button } from "../../components/ui/Button";
import { Link } from "../../components/ui/Links";
import { useForm } from "../../hooks/useForm";

export function Login() {
  const { session, signIn, loading } = useAuthContext();
  const [credentials, handleChange] = useForm({ email: "", password: "" });
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const error = await signIn(credentials);
      if (error) throw error;
      navigate(location.state?.prevLocation ?? "/", { replace: true });
    } catch (error) {
      console.error(error);
      setError(error.error_description || error.message);
    }
  }

  return session ? (
    <Navigate to={location.state?.prevLocation ?? "/"} replace />
  ) : (
    <>
      <PageTitle title="Login to Your Account" />
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-lg flex-col gap-4"
      >
        <Input
          type="email"
          name="email"
          placeholder="Email"
          required
          autoFocus
          autoComplete="email"
          disabled={loading}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          required
          autoComplete="current-password"
          disabled={loading}
          onChange={handleChange}
        />
        {error && <span className="self-center text-rose-400">{error}</span>}
        <Button
          type="submit"
          disabled={loading || !credentials.email || !credentials.password}
        >
          Login
        </Button>
        <Link to="/forgot-password" className="self-center">
          Forgot your password?
        </Link>
      </form>
    </>
  );
}
