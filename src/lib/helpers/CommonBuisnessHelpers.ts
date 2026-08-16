/**
 * Business helpers that are not date-related.
 *
 * `selectFromTimeAndToTimeFromScheduleOrPackages` used to live here — it
 * resolved a schedule time by falling back through four nullable strings at
 * every read, and rendered a bare " - " when none of them parsed. That question
 * is answered once at write time now (see lib/helpers/scheduleInstants.ts), and
 * display goes through `formatIstRange`.
 */
export const phoneNumberParser = (contact: string | undefined) => {
  if (!contact) {
    return null;
  }

  const countryCodePrefix = "+91";

  if (!contact.startsWith("0", 0)) {
    const countryCodePrefix = "+91";
    const parsedPhoneNumber = countryCodePrefix + contact;
    return parsedPhoneNumber;
  }

  const removedZeroFromPhoneNumber = contact.slice(1);
  const parsedPhoneNumber = countryCodePrefix + removedZeroFromPhoneNumber;
  return parsedPhoneNumber;
};
