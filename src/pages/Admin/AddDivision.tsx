import { AddDivisionModal } from "@/components/modules/Admin/Division/AddDivisionModal";
import { useGetDivisionsQuery } from "@/redux/features/Division/division.api";

export default function AddDivision() {
  const {data} = useGetDivisionsQuery(undefined);
  console.log(data);
  
  return (
    <div>
      <AddDivisionModal />
      <h1>This is AddDivision Component</h1>
    </div>
  );
}