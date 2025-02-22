import { notFound } from "next/navigation";
import { ReactElement } from "react";
import { getShare } from "~/actions/get-share";
import { RecordShare } from "~/types/record-share";

const SharePage = async ({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<ReactElement> => {
    const { slug } = await params;
    let share: RecordShare | undefined;
    if (!slug || slug.length !== 16 || !(share = await getShare(slug))) {
        notFound();
    }
    console.log({ slug, share });

    return <main>SHARE {slug}</main>;
};
export default SharePage;
