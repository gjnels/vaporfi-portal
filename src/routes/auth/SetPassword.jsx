import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthRedirect } from "../../components/AuthRedirect";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/FormInputs";
import { Link } from "../../components/ui/Links";
import { PageTitle } from "../../components/ui/PageTitle";
import { showToast } from "../../components/ui/Toast";
import { Toggle } from "../../components/ui/Toggle";
import supabase from "../../lib/supabaseClient";

export const SetPassword = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    if (password !== confirmPassword) {
      setFormError("Passwords must match");
      return;
    }
    const { error } = await supabase.auth.update({ password });
    if (error) {
      setFormError(error.message);
      setSubmitting(false);
      return;
    } else {
      showToast("Password updated", { type: "success" });
      navigate("/", { replace: true });
    }
  };

  return (
    <AuthRedirect
      redirectTo="/set-password"
      hashString="type=recovery"
      errorLink={
        <p>
          Go back to{" "}
          <Link to="/reset-password" replace={true}>
            Reset Password Page
          </Link>
        </p>
      }
      checkForUser={true}
      noUserLink={
        <>
          <p>
            You must be logged in to change your password. Login{" "}
            <Link to="/login" replace={true}>
              here
            </Link>{" "}
          </p>
          <p>
            If you forgot your password, reset it{" "}
            <Link to="/reset-password" replace={true}>
              here
            </Link>
          </p>
        </>
      }
    >
      <PageTitle title="Set Password" />
      <form
        className="mx-auto flex w-full max-w-lg flex-col gap-4"
        onSubmit={handleSubmit}
      >
        {/* hidden email input for use with password managers */}
        <Input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          defaultValue={supabase.auth.user().email}
          title="Current email address"
          placeholder="email"
          className="hidden"
          aria-hidden="true"
          disabled="true"
        />

        <Input
          type={showPasswords ? "text" : "password"}
          id="new-password"
          label="New Password"
          name="newPassword"
          placeholder="New Password"
          autoComplete="new-password"
          required
          minLength={8}
          autoFocus
          title="Enter a new password at least 8 characters long"
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitting}
        />
        <Input
          type={showPasswords ? "text" : "password"}
          id="confirm-new-password"
          label="Confirm New Password"
          name="confirmNewPassword"
          placeholder="Confirm New Password"
          autoComplete="new-password"
          required
          minLength={8}
          title="Confirm your new password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={submitting}
        />
        <Toggle
          title="Show Password"
          enabled={showPasswords}
          onChange={() => setShowPasswords((prev) => !prev)}
          divClassName="flex-row-reverse justify-end"
        />
        <p className="text-center text-base font-bold text-rose-400 lg:text-lg">
          {formError}
        </p>
        <Button
          type="submit"
          disabled={!password || !confirmPassword || submitting}
        >
          Set New Password
        </Button>
      </form>
    </AuthRedirect>
  );
};
