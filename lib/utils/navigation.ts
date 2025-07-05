/**
 * Utility functions for programmatic navigation
 */

/**
 * Navigate to the home page with the scan receipt tab active
 * @param router - Next.js router instance
 */
export const navigateToScanTab = (router: any) => {
  router.push("/?tab=scan");
};

/**
 * Navigate to the receipts list page
 * @param router - Next.js router instance
 */
export const navigateToReceiptList = (router: any) => {
  router.push("/receipt");
};

/**
 * Navigate to a specific receipt detail page
 * @param router - Next.js router instance
 * @param receiptId - The ID of the receipt to view
 */
export const navigateToReceiptDetail = (router: any, receiptId: string) => {
  router.push(`/receipt/${receiptId}`);
};
