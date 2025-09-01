import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { AddTourModal } from "@/components/modules/Admin/TourType/AddTourModal";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetTourTypeQuery, useRemoveTourTypeMutation } from "@/redux/features/Tour/tour.api";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AddTourType() {
    const { data } = useGetTourTypeQuery(undefined);
    const [removeTourType] = useRemoveTourTypeMutation();

    const handleRemoveTourType = async (tourId: string) => {
        const toastId = toast.loading("Removing...");

        try {
            const res = await removeTourType(tourId).unwrap();
            console.log(res);
            if (res.success) {
                toast.success("Tour Type Removed", { id: toastId })
            }

        } catch (err) {
            console.error(err);
        }

    }

    return (
        <div className="w-full max-w-7xl mx-auto px-5">
            <div className="flex justify-between my-8">
                <h1 className="text-2xl font-semibold">Tour Types</h1>
                <AddTourModal />
            </div>
            <div className="border-2 border-muted rounded-xl p-5">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Name</TableHead>

                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.data?.map((item: { _id: string, name: string }) => (
                            <TableRow>
                                <TableCell className="font-medium w-full">{item?.name}</TableCell>
                                <TableCell>
                                    <DeleteConfirmation onConfirm={() => handleRemoveTourType(item._id)} >
                                        <Button className="bg-red-400" size="sm"><Trash2 className="text-black" /></Button>
                                    </DeleteConfirmation>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}