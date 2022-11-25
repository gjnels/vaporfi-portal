import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/FormInputs";
import { Link } from "../../components/ui/Links";
import { PageTitle } from "../../components/ui/PageTitle";
import { Spinner } from "../../components/ui/Spinner";
import { useAuthContext } from "../../contexts/authContext";
import { useSupabaseContext } from "../../contexts/supabaseContext";
import { capitalize } from "../../lib/strings";
import { useForm } from "../../hooks/useForm";
import supabase from "../../lib/supabaseClient";
import { showToast } from "../../components/ui/Toast";

export function Users() {
  const {
    profiles: { data: users, loading, update },
  } = useSupabaseContext();
  const { profile: currentProfile } = useAuthContext();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filteredUsers = useMemo(() => {
    const filtered = users
      .filter((user) => {
        return user.role.name !== "owner" || currentProfile.id !== user.id;
      })
      .sort((a, b) => {
        return a.email > b.email ? 1 : -1;
      });
    const q = query.toLocaleLowerCase();
    if (q === "") {
      return filtered;
    }

    return filtered.filter((user) => {
      return (
        user.role.name !== "owner" &&
        (user.name?.toLowerCase()?.includes(q) ||
          user.email?.includes(q) ||
          user.role?.name?.toLowerCase()?.includes(q) ||
          user.location?.name?.toLowerCase()?.includes(q))
      );
    });
  }, [query, users]);

  async function disableUser(user) {
    const { id, disabled } = user;
    try {
      const { error } = await update(id, { disabled: !disabled });
      if (error) throw error;
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteUser(user) {
    if (
      !confirm(
        "Are you sure you want to delete this user? This cannot be undone.\n\nEmail: " +
          user.email
      )
    ) {
      return;
    }

    try {
      const res = await fetch("/api/deleteUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id: user.id }),
      });
      const { error } = await res.json();
      if (error) throw error;
    } catch (error) {
      showToast("Error deleting user.", { type: "error" });
    }
  }

  return (
    <>
      <PageTitle title="Users" />
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex gap-8">
          <Button
            variant="secondary small"
            className="shrink-0"
            onClick={() => navigate("new")}
          >
            Invite New User
          </Button>
          <Input
            type="search"
            autoFocus
            placeholder="Search users..."
            className="w-full"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {loading ? (
          <Spinner />
        ) : filteredUsers.length === 0 ? (
          <p>No users{query !== "" && " match search"}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-500 text-left text-base lg:text-lg">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Location</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-500 focus-within:bg-gray-700 hover:bg-gray-700"
                  >
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{capitalize(user.role.name)}</td>
                    <td className="px-4 py-2">{user.location.name}</td>
                    <td className="flex justify-center gap-4 px-4 py-2">
                      <Button
                        variant="small"
                        onClick={() => navigate(`${user.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="small danger"
                        onClick={() => deleteUser(user)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="small secondary"
                        onClick={() => disableUser(user)}
                      >
                        {user.disabled ? "Enable" : "Disable"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export function CreateUser() {
  const navigate = useNavigate();
  const [formData, handleChange] = useForm({ email: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/inviteUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(formData),
      });
      const { error } = await res.json();
      if (error) throw error;
      navigate("..");
    } catch (error) {
      setError(error?.message ?? "Error creating user.");
    }
  }

  return (
    <div>
      <PageTitle title="Invite New User" />
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-lg flex-col gap-6"
      >
        <Input
          id="email"
          label="Email"
          type="email"
          name="email"
          placeholder="Email"
          required
          autoFocus
          onChange={handleChange}
        />

        {error && <p className="self-center text-rose-400">{error}</p>}

        <div className="flex gap-4 self-center">
          <Button type="submit">Invite</Button>
          <Button variant="secondary" onClick={() => navigate("..")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export function EditUser() {
  const { id } = useParams();
  const {
    profiles: { data: profiles, loading, update },
  } = useSupabaseContext();
  const navigate = useNavigate();

  const user = profiles.find((p) => p.id == id);

  async function onSubmit(userData) {
    // Since email and id cannot be updated through the profiles table, remove them from the updates
    const { email, id, ...updates } = userData;

    // If the email has been changed, update the user in the auth table to change their email
    if (email !== user.email) {
      console.log("email changed!");
      // Update email
      try {
        const response = await fetch("/api/updateUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ id, updates: { email } }),
        });
        const { error } = await response.json();
        if (error) throw error;
      } catch (error) {
        return { step: "email", error };
      }
    }

    // Make sure location and role hold the foreign key id, not the foreign table data
    updates.location = updates.location?.id ?? updates.location;
    updates.role = updates.role?.id ?? updates.role;

    try {
      const { error } = await update(id, updates);
      if (error) throw error;
      navigate("..");
      return { success: true };
    } catch (error) {
      return { step: "profile", error };
    }
  }

  return (
    <div>
      <PageTitle title="Edit User" />
      {loading ? <Spinner /> : <UserForm user={user} onSubmit={onSubmit} />}
    </div>
  );
}

function UserForm({ user, onSubmit }) {
  const [formData, handleChange, setFormData] = useForm(user);
  const {
    roles: { data: roles },
    locations: { data: locations },
  } = useSupabaseContext();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const { step, error } = await onSubmit(formData);
    if (error) {
      switch (step) {
        case "email":
          setError(
            error.message?.includes("duplicate key")
              ? "Email already in use."
              : "Error updating email."
          );
          break;
        case "profile":
          setError("Error updating profile.");
          break;
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-lg flex-col gap-6"
    >
      <Input
        id="email"
        name="email"
        label="Email"
        type="email"
        required
        value={formData.email ?? ""}
        onChange={handleChange}
      />

      <Input
        id="name"
        name="name"
        label="Name"
        value={formData.name ?? ""}
        onChange={handleChange}
      />

      <Select
        id="role"
        label="Role"
        name="role"
        required={true}
        notSelectedValue="Choose a role"
        value={formData.role.id}
        onChange={(e) => {
          setFormData((current) => ({
            ...current,
            role: roles.find((role) => role.id == e.target.value) ?? "",
          }));
        }}
        options={roles
          .filter((role) => role.name !== "owner")
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
        notSelectedValue="Choose a location"
        value={formData.location.id}
        onChange={(e) => {
          setFormData((current) => ({
            ...current,
            location:
              locations.find((location) => location.id == e.target.value) ?? "",
          }));
        }}
        options={locations.map((location) => ({
          id: location.id,
          value: location.id,
          label: capitalize(location.name),
        }))}
      />

      {error && <p className="self-center text-rose-400">{error}</p>}

      <div className="flex gap-4 self-center">
        <Button type="submit">Update</Button>
        <Button variant="secondary" onClick={() => navigate("..")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
