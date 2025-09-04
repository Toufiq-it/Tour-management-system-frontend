import MultipleImageUploader from "@/components/MultipleImageUploader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FileMetadata } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import { useGetDivisionsQuery } from "@/redux/features/Division/division.api";
import { useAddTourMutation, useGetTourTypeQuery } from "@/redux/features/Tour/tour.api";
import type { IErrorResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, formatISO } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

// Zob schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  costFrom: z.string().min(1, "Cost is required"),
  startDate: z.date({ message: "Start date is required" }),
  endDate: z.date({ message: "End date is required" }),
  departureLocation: z.string().min(1, "Departure location is required"),
  arrivalLocation: z.string().min(1, "Arrival location is required"),
  included: z.array(z.object({ value: z.string() })),
  excluded: z.array(z.object({ value: z.string() })),
  amenities: z.array(z.object({ value: z.string() })),
  tourPlan: z.array(z.object({ value: z.string() })),
  maxGuest: z.string().min(1, "Max guest is required"),
  minAge: z.string().min(1, "Minimum age is required"),
  division: z.string().min(1, "Division is required"),
  tourType: z.string().min(1, "Tour type is required"),
});

export default function AddTour() {
  const [images, setImages] = useState<(File | FileMetadata)[] | []>([])
  const { data: tourTypeData, isLoading: tourTypeLoading } = useGetTourTypeQuery(undefined);
  const { data: divisionData, isLoading: divisionLoading } = useGetDivisionsQuery(undefined);
  const [addTour] = useAddTourMutation();

  const tourTypeOptions = tourTypeData?.data?.map((item: { _id: string, name: string }) => ({
    value: item._id,
    label: item.name,
  }));

  const divisionOptions = divisionData?.map((item: { _id: string, name: string }) => ({
    value: item._id,
    label: item.name,
  }));


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Kuakata Sea Beach Sunrise & Sunset Tour",
      description:
        "Visit Kuakata, the 'Daughter of the Sea', and enjoy the rare beauty of both sunrise and sunset at the same beach. Explore Buddhist temples and local fishing culture.",
      location: "Kuakata",
      costFrom: "13000",
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      departureLocation: "Barishal",
      arrivalLocation: "Kuakata",
      included: [
        { value: "Hotel accommodation" },
        { value: "Meals" },
        { value: "Transport (bus)" },
        { value: "Local guide" },
      ],
      excluded: [
        { value: "Personal expenses" },
        { value: "Travel insurance" },
      ],
      amenities: [
        { value: "Sea-view rooms" },
        { value: "Fresh seafood meals" },
        { value: "Cultural visits" },
      ],
      tourPlan: [
        { value: "Day 1: Arrival and sunset view" },
        { value: "Day 2: Sunrise and Buddhist temple visit" },
        { value: "Day 3: Explore local fishing villages and return" },
      ],
      maxGuest: "25",
      minAge: "5",
      division: "",
      tourType: "",
    },
  });

  const {
    fields: includedFields,
    append: appendIncluded,
    remove: removeIncluded,
  } = useFieldArray({
    control: form.control,
    name: "included",
  });

  const {
    fields: excludedFields,
    append: appendExcluded,
    remove: removeExcluded,
  } = useFieldArray({
    control: form.control,
    name: "excluded",
  });

  const {
    fields: amenitiesFields,
    append: appendAmenities,
    remove: removeAmenities,
  } = useFieldArray({
    control: form.control,
    name: "amenities",
  });

  const {
    fields: tourPlanFields,
    append: appendTourPlan,
    remove: removeTourPlan,
  } = useFieldArray({
    control: form.control,
    name: "tourPlan",
  });

  const handleSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading("Creating tour....");

    if (images.length === 0) {
      toast.error("Please add some images", { id: toastId });
      return;
    }

    const tourData = {
      ...data,
      costFrom: Number(data.costFrom),
      minAge: Number(data.minAge),
      maxGuest: Number(data.maxGuest),
      startDate: formatISO(data.startDate),
      endDate: formatISO(data.endDate),
      included:
        data.included[0].value === ""
          ? []
          : data.included.map((item: { value: string }) => item.value),
      excluded:
        data.included[0].value === ""
          ? []
          : data.excluded.map((item: { value: string }) => item.value),
      amenities:
        data.amenities[0].value === ""
          ? []
          : data.amenities.map((item: { value: string }) => item.value),
      tourPlan:
        data.tourPlan[0].value === ""
          ? []
          : data.tourPlan.map((item: { value: string }) => item.value),
    };


    const formData = new FormData();

    formData.append("data", JSON.stringify(tourData));
    images.forEach((image) => formData.append("files", image as File));

    try {
      const res = await addTour(formData).unwrap();

      if (res.success) {
        toast.success("Tour created", { id: toastId });
        form.reset();
      } else {
        toast.error("Something went wrong", { id: toastId });
      }

    } catch (err) {
      console.error(err);
      toast.error((err as IErrorResponse).message || "Something went wrong", {
        id: toastId,
      });
    }

  }

  return (
    <div className="w-full max-w-4xl mx-auto px-5 mt-16">
      <Card>
        <CardHeader>
          <CardTitle>Add New Tour</CardTitle>
          <CardDescription>Add a new tour to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id="add-tour-form"
              className="space-y-5"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tour Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* location and cost */}
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costFrom"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Cost</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* locations */}
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="departureLocation"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Departure Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="arrivalLocation"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Arrival Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* // division & tour type */}
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="division"
                  render={({ field }) => (
                    <FormItem className="flex-1 ">
                      <FormLabel>Division</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={divisionLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Division" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {divisionOptions?.map(
                            (item: { label: string; value: string }) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tourType"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Tour Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={tourTypeLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your Tour Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tourTypeOptions?.map(
                            (option: { value: string; label: string }) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* max guest minimum age */}
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="maxGuest"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Max Guest</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minAge"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Minimum Age</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* start and end date */}
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date(field.value)}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date <
                              new Date(
                                new Date().setDate(new Date().getDate() - 1)
                              )
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date(field.value)}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date <
                              new Date(
                                new Date().setDate(new Date().getDate() - 1)
                              )
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* description & multiupload image */}
              <div className="flex gap-5 items-stretch">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="h-[205px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex-1 mt-5">
                  <MultipleImageUploader onChange={setImages} />
                </div>
              </div>

              <div className="border-2 border-muted w-full "></div>

              {/* Included */}
              <div>
                <div className="flex justify-between">
                  <p className="font-semibold text-xl">Included</p>
                  <Button
                    type="button"
                    variant="outline"
                    className="!bg-green-700"
                    size="icon"
                    onClick={() => appendIncluded({ value: "" })}
                  >
                    <Plus />
                  </Button>
                </div>

                <div className="space-y-4 mt-4">
                  {includedFields.map((item, index) => (
                    <div className="flex gap-2" key={item.id}>
                      <FormField
                        control={form.control}
                        name={`included.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        onClick={() => removeIncluded(index)}
                        variant="destructive"
                        className="!bg-red-700"
                        size="icon"
                        type="button"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Excluded */}
              <div>
                <div className="flex justify-between">
                  <p className="font-semibold text-xl">Excluded</p>
                  <Button
                    type="button"
                    variant="outline"
                    className="!bg-green-700"
                    size="icon"
                    onClick={() => appendExcluded({ value: "" })}
                  >
                    <Plus />
                  </Button>
                </div>

                <div className="space-y-4 mt-4">
                  {excludedFields.map((item, index) => (
                    <div className="flex gap-2" key={item.id}>
                      <FormField
                        control={form.control}
                        name={`excluded.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        onClick={() => removeExcluded(index)}
                        variant="destructive"
                        className="!bg-red-700"
                        size="icon"
                        type="button"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <div className="flex justify-between">
                  <p className="font-semibold text-xl">Amenities</p>
                  <Button
                    type="button"
                    variant="outline"
                    className="!bg-green-700"
                    size="icon"
                    onClick={() => appendAmenities({ value: "" })}
                  >
                    <Plus />
                  </Button>
                </div>

                <div className="space-y-4 mt-4">
                  {amenitiesFields.map((item, index) => (
                    <div className="flex gap-2" key={item.id}>
                      <FormField
                        control={form.control}
                        name={`amenities.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        onClick={() => removeAmenities(index)}
                        variant="destructive"
                        className="!bg-red-700"
                        size="icon"
                        type="button"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tour Plan */}
              <div>
                <div className="flex justify-between">
                  <p className="font-semibold text-xl">Tour Plan</p>
                  <Button
                    type="button"
                    variant="outline"
                    className="!bg-green-700"
                    size="icon"
                    onClick={() => appendTourPlan({ value: "" })}
                  >
                    <Plus />
                  </Button>
                </div>

                <div className="space-y-4 mt-4">
                  {tourPlanFields.map((item, index) => (
                    <div className="flex gap-2" key={item.id}>
                      <FormField
                        control={form.control}
                        name={`tourPlan.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        onClick={() => removeTourPlan(index)}
                        variant="destructive"
                        className="!bg-red-700"
                        size="icon"
                        type="button"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" form="add-tour-form">
            Create Tour
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 