import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function Unauthorized() {
  return (
    <div>
      <h1>You can't authorized to see this Route</h1>
      <Button>
      <Link to="/" className="text">Go Back Home</Link>
      </Button>
    </div>
  );
}