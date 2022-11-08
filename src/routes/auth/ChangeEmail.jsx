import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/FormInputs";
import { PageTitle } from "../../components/ui/PageTitle";
import { showToast } from "../../components/ui/Toast";
import { useSessionContext } from "../../contexts/sessionContext";
import supabase from "../../lib/supabaseClient";

export const ChangeEmail = () => {
  const { session } = useSessionContext();
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (email === session.user.email) {
      showToast(`No change detected. ${email} is your current email`, {
        type: "error",
      });
    } else {
      await supabase.auth.update({ email });
      showToast(
        `Check your inbox (or spam) for ${email} to confirm your new email`,
        { type: "success" }
      );
    }
    setSubmitting(false);
  };

  return !session ? (
    <div className="flex w-full flex-col items-center gap-4">
      <ErrorPage
        manualError={{ message: "No user found" }}
        customLink={
          <p>
            You must be logged in to change your email. Login{" "}
            <Link to="/login" replace={true}>
              here
            </Link>
          </p>
        }
      />
    </div>
  ) : (
    <>
      <PageTitle title="Change Email" />
      <form
        className="mx-auto flex w-full max-w-lg flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <Input
          type="email"
          name="newEmail"
          autoComplete="email"
          id="new-email"
          label="New Email"
          required
          disabled={submitting}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit">Send Email Link</Button>
      </form>
    </>
  );
};
