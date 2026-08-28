"use client";

import { useEffect, useState } from "react";
import IncidentCard from "./IncidentCard";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";

interface Incident {
  id: string;
  title: string;
  description?: string;
  severity: string;
  status: string;
  createdAt: string;
}

interface IncidentListProps {
  onSelect: (incidentId: string) => void;
}

export default function IncidentList({
  onSelect,
}: IncidentListProps) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadIncidents() {
      try {
        const response = await fetch("/api/incidents");

        if (!response.ok) {
          throw new Error("Failed to load incidents");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message);
        }

        setIncidents(result.data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    loadIncidents();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-red-400">
        <h3 className="font-semibold">
          Unable to load incidents
        </h3>

        <p className="mt-1 text-sm text-red-400/70">
          {error}
        </p>
      </div>
    );
  }

  if (incidents.length === 0) {
    return (
      <EmptyState
        title="No incidents found"
        description="There are currently no incidents available."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {incidents.map((incident) => (
        <IncidentCard
          key={incident.id}
          incident={incident}
          onClick={() => onSelect(incident.id)}
        />
      ))}
    </div>
  );
}