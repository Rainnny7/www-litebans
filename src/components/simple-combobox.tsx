"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState, type ReactElement } from "react";
import { cn } from "~/common/utils";
import { Button } from "~/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "~/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover";

type ComboboxItem = { value: string; label: string };

type ComboboxProps = {
    className?: string;
    placeholder: string;
    items: ComboboxItem[];
    withSearch?: boolean;
    value: any;
    onChange: (value: any) => void;
};

const SimpleCombobox = ({
    className,
    placeholder,
    items,
    value,
    withSearch = true,
    onChange,
}: ComboboxProps): ReactElement => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div className="flex items-center">
            {/* Placeholder */}
            <p className="min-w-28 text-sm text-muted-foreground">
                {placeholder}
            </p>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn("w-48 h-8 justify-between", className)}
                    >
                        {value
                            ? items.find(
                                  (item: ComboboxItem) => item.value === value
                              )?.label
                            : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-0">
                    <Command>
                        {withSearch && (
                            <CommandInput placeholder={placeholder} />
                        )}
                        <CommandList>
                            <CommandEmpty>No items found.</CommandEmpty>
                            <CommandGroup>
                                {items.map((item: ComboboxItem) => (
                                    <CommandItem
                                        key={item.value}
                                        value={item.value}
                                        onSelect={(currentValue) => {
                                            onChange(currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === item.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {item.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};
export default SimpleCombobox;
