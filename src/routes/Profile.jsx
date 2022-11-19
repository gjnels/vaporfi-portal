import { PageTitle } from "../components/ui/PageTitle";
import { Spinner } from "../components/ui/Spinner";
import { Input, Select } from "../components/ui/FormInputs";
import { Button } from "../components/ui/Button";
import { capitalize } from "../lib/strings";
import { useEffect } from "react";
import { showToast } from "../components/ui/Toast";
import { Link } from "../components/ui/Links";
import { useForm } from "../hooks/useForm";
import { useAuthContext } from "../contexts/authContext";
import { useSupabaseTable } from "../hooks/useSupabaseTable";
import { Navigate, useLocation } from "react-router-dom";

export function Profile() {
  const {
    profile,
    loading: profileLoading,
    updateProfile,
    canAccess,
  } = useAuthContext();
  const { data: roles, loading: rolesLoading } = useSupabaseTable("roles");
  const { data: locations, loading: locationsLoading } =
    useSupabaseTable("locations");
  const [formData, handleChange, setFormData] = useForm(profile);

  const location = useLocation();

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  async function handleSubmit(e) {
    e.preventDefault();

    const data = { ...formData };

    // Make sure the role and location are the foreign key IDs, not the foreign key values
    data.role = data.role?.id ?? data.role;
    data.location = data.location?.id ?? data.location;

    const error = await updateProfile(data);
    if (error) {
      showToast("Error updating profile.", { type: "error" });
    } else {
      showToast("Profile updated.", { type: "success" });
    }
  }

  const loading = profileLoading || rolesLoading || locationsLoading;

  return (
    <>
      <PageTitle title="My Profile" />
      <div className="flex justify-center">
        {loading ? (
          <Spinner />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-xl flex-col gap-4"
          >
            <Input
              id="email"
              label="Email"
              type="email"
              disabled={true}
              defaultValue={formData.email}
            />
            <Input
              id="name"
              label="Name"
              name="name"
              disabled={profile.role.name === "store"}
              value={formData.name}
              onChange={handleChange}
            />
            <Select
              id="role"
              label="Role"
              name="role"
              required={true}
              disabled={!canAccess(3)}
              notSelectedValue="Choose a role"
              value={formData.role.id}
              onChange={(e) => {
                setFormData((current) => ({
                  ...current,
                  role: roles.find((role) => role.id == e.target.value) ?? "",
                }));
              }}
              options={roles
                .filter((role) =>
                  role.name === "owner" ? canAccess("owner") : true
                )
                .map((role) => ({
                  id: role.id,
                  value: role.id,
                  label: capitalize(role.name),
                }))}
            />
            <Select
              id="location"
              label="Location"
              required={true}
              disabled={!canAccess(3)}
              notSelectedValue="Choose a location"
              value={formData.location.id}
              onChange={(e) => {
                setFormData((current) => ({
                  ...current,
                  location:
                    locations.find(
                      (location) => location.id == e.target.value
                    ) ?? "",
                }));
              }}
              options={locations.map((location) => ({
                id: location.id,
                value: location.id,
                label: capitalize(location.name),
              }))}
            />
            <Button
              type="submit"
              className="mt-2"
              disabled={loading || profile.role.name === "store"}
            >
              Update Details
            </Button>
            <Link
              className="self-center"
              to="/set-password"
              state={{ prevLocation: location.pathname }}
            >
              Change My Password
            </Link>
          </form>
        )}
      </div>
    </>
  );
}
