import { BookOpenIcon } from "lucide-react";
import { Link } from "next-view-transitions";
import { cloneElement, type ReactElement } from "react";
import { cn, numberWithCommas } from "~/common/utils";
import { PunishmentCategoryWithCount } from "~/components/navbar/navbar";
import {
    NavigationMenuContent,
    NavigationMenuLink,
    NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";

const CategoriesDropdown = ({
    categories,
}: {
    categories: PunishmentCategoryWithCount[];
}): ReactElement => (
    <>
        <NavigationMenuTrigger className="px-2.5 py-1 h-8 flex gap-2 items-center bg-muted/40 text-sm rounded-lg hover:bg-muted/20 focus:bg-muted/20">
            <BookOpenIcon className="hidden lg:flex size-3.5 text-muted-foreground" />
            Browse
        </NavigationMenuTrigger>
        <NavigationMenuContent className="!bg-opacity-100 !w-96 grid grid-cols-2 gap-3">
            {categories.map(({ category, count, error }) => (
                <NavigationMenuLink
                    key={category.type}
                    className="p-2.5 flex-row gap-2 items-center hover:bg-muted/45 cursor-default"
                    asChild
                >
                    <Link
                        href={`/records/${category.type}`}
                        prefetch={false}
                        draggable={false}
                    >
                        {/* Icon */}
                        {cloneElement(category.icon, {
                            className: "p-2 size-8 bg-muted rounded-lg",
                        })}

                        {/* Text */}
                        <div className="flex flex-col">
                            <div className="font-medium">
                                Browse {category.displayName}s
                            </div>
                            <p
                                className={cn(
                                    "text-xs text-muted-foreground",
                                    error && "text-destructive"
                                )}
                            >
                                {error ? "N/A" : numberWithCommas(count)}{" "}
                                records
                            </p>
                        </div>
                    </Link>
                </NavigationMenuLink>
            ))}
        </NavigationMenuContent>
    </>
);
export default CategoriesDropdown;
