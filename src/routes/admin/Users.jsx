import { useParams } from "react-router-dom";
import { Link } from "../../components/ui/Links";
import { PageTitle } from "../../components/ui/PageTitle";
import { Spinner } from "../../components/ui/Spinner";
import { useSupabaseContext } from "../../contexts/supabaseContext";

export function Users() {
  const { profiles } = useSupabaseContext();

  return (
    <>
      <PageTitle title="Users" />
      {profiles.loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-4">
          {profiles.data.map((profile) => (
            <div key={`profile:${profile.id}`}>
              <p>{profile.name}</p>
              <p>{profile.email}</p>
              <p>{profile.role.name}</p>
              <p>{profile.location.name}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function CreateUser() {
  return <div>Create User</div>;
}

export function EditUser() {
  const { id } = useParams();

  return (
    <div>
      Edit User <p>{id}</p>
    </div>
  );
}
