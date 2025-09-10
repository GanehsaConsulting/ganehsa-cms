import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wrapper } from "@/components/wrapper";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react";

export default function ArticlePage() {
    return (
        <Wrapper>
            <div className="flex items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-4 w-full">
                    <div className="flex items-center gap-2">
                        <Input
                            className="w-full"
                            placeholder="Cari judul..."
                        />
                        <Button>
                            Cari
                        </Button>
                    </div>
                    <div>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Fruits</SelectLabel>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="blueberry">Blueberry</SelectItem>
                                    <SelectItem value="grapes">Grapes</SelectItem>
                                    <SelectItem value="pineapple">Pineapple</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="">
                    <Button>
                        <Plus />
                        Artikel Baru
                    </Button>
                </div>
            </div>


        </Wrapper>
    )
}