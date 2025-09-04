import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetDivisionsQuery } from "@/redux/features/Division/division.api";
import { useGetTourTypeQuery } from "@/redux/features/Tour/tour.api";
import { useSearchParams } from "react-router";

export default function TourFilters() {

    const [searchParams, setSearchParams] = useSearchParams()

    const selectedDivision = searchParams.get("division") || undefined;
    const selectedTourType = searchParams.get("tourType") || undefined;

    const { data: divisionData, isLoading: divisionIsLoading } =
        useGetDivisionsQuery(undefined);

    const { data: tourTypeData, isLoading: tourTypeIsLoading } =
        useGetTourTypeQuery({ limit: 1000, fields: "_id,name" });

    const divisionOption = divisionData?.map(
        (item: { _id: string; name: string }) => ({
            label: item.name,
            value: item._id,
        })
    );

    const tourTypeOptions = tourTypeData?.data?.map(
        (item: { _id: string; name: string }) => ({
            label: item.name,
            value: item._id,
        })
    );

    const handleDivisionChange = (value:string) => {
        const param = new URLSearchParams(searchParams);
        param.set("division", value);
        setSearchParams(param);
    }
    
    const handleTourTypeChange = (value:string) => {
        const param = new URLSearchParams(searchParams);
        param.set("tourType", value);
        setSearchParams(param);
    }
    
    const handleClearFilter = () => { 
        const param = new URLSearchParams(searchParams);
        param.delete("division");
        param.delete("tourType");
        setSearchParams(param);
    }

    return (
        <div className="col-span-3 w-full h-[500px] border border-muted rounded-md p-5 space-y-4">
            <div className="flex justify-between items-center">
                <h1>Filters</h1>
                <Button size="sm" variant="outline"
                    onClick={handleClearFilter}
                >
                    Clear Filter
                </Button>
            </div>
            <div>
                <Label className="mb-2">Division to visit</Label>
                <Select
                    onValueChange={handleDivisionChange}
                    value={selectedDivision ? selectedDivision : ""}
                    disabled={divisionIsLoading}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Division" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Divisions</SelectLabel>
                            {divisionOption?.map((item: { value: string; label: string }) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label className="mb-2">Tour Type</Label>
                <Select
                    onValueChange={handleTourTypeChange}
                    value={selectedTourType ? selectedTourType : ""}
                    disabled={tourTypeIsLoading}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Tour Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Tour Type</SelectLabel>
                            {tourTypeOptions?.map(
                                (item: { value: string; label: string }) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                )
                            )}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}