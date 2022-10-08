import { useSupabaseContext } from "../contexts/supabaseContext";
import { PageTitle } from "../components/ui/PageTitle";
import { Spinner } from "../components/ui/Spinner";
import { Input, Select } from "../components/ui/FormInputs";
import { Button } from "../components/ui/Button";
import { capitalize } from "../lib/strings";
import { useState } from "react";
import { useAccess } from "../hooks/useAccess";
import { showToast } from "../components/ui/Toast";

export const Profile = () => {
  const { profile, roles, locations, loading, updateRow } =
    useSupabaseContext();
  const { accessByLevel } = useAccess();
  const [formData, setFormData] = useState({
    ...profile,
    role: profile?.role?.id,
    location: profile?.location?.id,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const error = await updateRow("profiles", formData);
    if (error) {
      console.log(error);
      showToast(JSON.stringify(error), { type: "error" });
    }
    showToast("Profile updated.", { type: "success" });
  };

  return (
    <>
      <PageTitle title="My Profile" />
      <div className="flex justify-center">
        {!profile && loading ? (
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
              // inlineElement={
              //   <Button variant="small secondary">Change Email</Button>
              // }
            />
            <Input
              id="name"
              label="Name"
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }));
              }}
            />
            <Select
              id="role"
              label="Role"
              required={true}
              disabled={!accessByLevel(3)}
              notSelectedValue="Choose a role"
              value={formData.role}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, role: +e.target.value }));
              }}
              options={roles.map((role) => ({
                id: role.id,
                value: role.id,
                label: capitalize(role.name),
              }))}
            />
            <Select
              id="location"
              label="Location"
              required={true}
              disabled={!accessByLevel(3)}
              notSelectedValue="Choose a location"
              value={formData.location}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, location: +e.target.value }));
              }}
              options={locations.map((location) => ({
                id: location.id,
                value: location.id,
                label: capitalize(location.name),
              }))}
            />
            <Button type="submit" className="mt-2">
              Update Details
            </Button>
          </form>
        )}
      </div>
    </>
  );
};
