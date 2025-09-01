import SingleImageUploader from "@/components/SingleImageUploader"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function AddDivisionModal() {
    const [image, setImage] = useState<File | null>(null);

    const form = useForm({
        defaultValues: {
            name: "",
            description: "",
        }
    });

    const onSubmit = async (data) => {
        console.log(data);
        
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Division</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Division</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form id="add-division" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Division Type</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Division Type"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Description"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                    <SingleImageUploader onChange={setImage} />
                </Form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" form="add-division">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
