import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/FormInputs";
import { PageTitle } from "../../components/ui/PageTitle";
import { Spinner } from "../../components/ui/Spinner";
import { showToast } from "../../components/ui/Toast";
import { Toggle } from "../../components/ui/Toggle";
import { useAuthContext } from "../../contexts/authContext";
import { useForm } from "../../hooks/useForm";
import supabase from "../../lib/supabaseClient";

export function SetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading } = useAuthContext();

  const [formData, handleChange] = useForm({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setFormError("");
    const { newPassword, confirmNewPassword } = formData;
    if (newPassword !== confirmNewPassword) {
      setFormError("Passwords must match");
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword,
        data: { newUser: null },
      });

      if (error) throw error;

      showToast("Password updated", { type: "success" });
      navigate(location.state?.prevLocation ?? "/", { replace: true });
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return loading ? (
    <Spinner />
  ) : session === null ? (
    <Navigate to="/login" replace state={{ prevLocation: location.pathname }} />
  ) : (
    <>
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
          defaultValue={session.user.email}
          title="Current email address"
          placeholder="email"
          className="hidden"
          aria-hidden="true"
          disabled={true}
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
          onChange={handleChange}
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
          onChange={handleChange}
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
          disabled={
            !formData.newPassword || !formData.confirmNewPassword || submitting
          }
        >
          Set New Password
        </Button>
      </form>
    </>
  );
}
