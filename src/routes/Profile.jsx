import { useSupabaseContext } from "../contexts/supabaseContext";
import { PageTitle } from "../components/ui/PageTitle";
import { Spinner } from "../components/ui/Spinner";
import { Input, Select } from "../components/ui/FormInputs";
import { Button } from "../components/ui/Button";
import { capitalize } from "../lib/strings";
import { useState } from "react";

export const Profile = () => {
  const { profile, roles, locations, loading } = useSupabaseContext();

  const [formData, setFormData] = useState(profile);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

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
              inlineElement={
                <Button variant="small secondary">Change Email</Button>
              }
            />
            <Input id="name" label="Name" defaultValue={formData.name} />
            <Select
              id="role"
              label="Role"
              required={true}
              disabled={profile.role.name !== "admin"}
              defaultValue={formData.role.id}
              notSelectedValue="Choose a role"
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
              disabled={profile.role.name !== "admin"}
              defaultValue={formData.location.id}
              notSelectedValue="Choose a location"
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
