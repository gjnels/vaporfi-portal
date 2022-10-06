import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { PageTitle } from "../components/ui/PageTitle";
import { useSession } from "../contexts/sessionContext";
import { Input } from "../components/ui/FormInputs";
import { Button } from "../components/ui/Button";

export const Login = () => {
  const { session, signIn, loading } = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    setError(null);
    e.preventDefault();
    const error = await signIn(credentials);
    if (error) setError(error.error_description || error.message);
  };

  return session ? (
    <Navigate to={location.state?.prevLocation || "/"} replace={true} />
  ) : (
    <>
      <PageTitle title="Login" />
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-lg flex-col gap-4"
      >
        <Input
          type="email"
          required
          autoFocus
          placeholder="Email"
          disabled={loading}
          onChange={(e) =>
            setCredentials((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <Input
          type="password"
          required
          placeholder="Password"
          disabled={loading}
          onChange={(e) =>
            setCredentials((prev) => ({ ...prev, password: e.target.value }))
          }
        />
        {error && (
          <span className="self-center text-rose-500 dark:text-rose-400">
            {error}
          </span>
        )}
        <Button
          type="submit"
          disabled={loading || (!credentials.email && !credentials.password)}
        >
          Login
        </Button>
      </form>
    </>
  );
};
