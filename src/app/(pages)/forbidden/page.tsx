import type { ReactElement } from "react";

/**
 * The forbidden page.
 * This page is displayed when the user
 * is not authorized to access a resource.
 *
 * @returns the forbidden page
 */
const ForbiddenPage = (): ReactElement => <main>Forbidden</main>;
export default ForbiddenPage;