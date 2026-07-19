import type { IncidentReport } from "@/types";
import { getIncidents as getSeedIncidents } from "@/services/stadium/data";

/**
 * Process-local incident store for volunteer → organizer demo loop.
 * Production would swap this for Firestore behind the same interface.
 */
const reportedIncidents: IncidentReport[] = [];

export function listIncidents(): IncidentReport[] {
  return [...getSeedIncidents(), ...reportedIncidents].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function addIncident(report: IncidentReport): IncidentReport {
  reportedIncidents.unshift(report);
  return report;
}

/** Test helper */
export function resetIncidentStore(): void {
  reportedIncidents.length = 0;
}
