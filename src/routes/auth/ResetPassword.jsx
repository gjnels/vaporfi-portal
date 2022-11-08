import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/FormInputs";
import { Link } from "../../components/ui/Links";
import { PageTitle } from "../../components/ui/PageTitle";
import { useSessionContext } from "../../contexts/sessionContext";
import supabase from "../../lib/supabaseClient";

export const ResetPassword = () => {
  const { session } = useSessionContext();
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);
    await supabase.auth.api.resetPasswordForEmail(email);
    setSubmitting(false);
    setMessage(
      "Check your email for a password recovery link.\nYou may need to check your spam folder."
    );
  };

  return (
    <>
      <PageTitle title="Reset Password" />
      <form
        className="mx-auto flex w-full max-w-lg flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <Input
          type="email"
          id="email"
          label="Email"
          required
          placeholder="Email"
          autoFocus
          title="Enter your email address"
          defaultValue={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
        />
        <Button type="submit" disabled={submitting || !email}>
          Send Recovery Email
        </Button>
        {!session && (
          <Link to="/login" className="self-center">
            Login
          </Link>
        )}
        <p className="whitespace-pre-wrap text-center">{message}</p>
      </form>
    </>
  );
};
