export function getEvents(
  event: string,
): "schedule.create" | "schedule.exists" | 'UNKNOWN' {
  if (event === "schedule.create") {
    return "schedule.create";
  }
  if (event === "schedule.exists") {
    return "schedule.create";
  }
  return "UNKNOWN"
}

export function getDescription() {
  return "Online Payment";
}

export function getFatalityCount() {}
