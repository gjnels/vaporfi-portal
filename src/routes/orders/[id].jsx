import { useParams } from "react-router-dom";
import { Link } from "../../components/ui/Links";
import { PageTitle } from "../../components/ui/PageTitle";

export const Order = () => {
  const { id } = useParams();
  return (
    <>
      <PageTitle title="Purchase Order" />
      <Link to="..">Back to Orders</Link>
      <p>Order #{id}</p>
    </>
  );
};
