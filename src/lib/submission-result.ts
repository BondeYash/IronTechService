/** A 200 response alone does not establish that the submission was delivered. */
export function submissionDelivered(result: unknown): boolean {
  return (
    typeof result === "object" &&
    result !== null &&
    "ok" in result &&
    result.ok === true &&
    "delivered" in result &&
    result.delivered === true
  );
}
