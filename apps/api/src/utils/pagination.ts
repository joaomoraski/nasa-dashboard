export function pickApproach(neo: any) {
    const arr = neo.close_approach_data ?? [];
    return arr.find((a: { orbiting_body: string; }) => a.orbiting_body === "Earth") ?? arr[0] ?? null;
}

export function toRow(neo: any, date: string) {
    const approach = pickApproach(neo);
  
    return {
      id: neo.id,
      name: neo.name,
      date, // from the map key (e.g. "2025-12-16")
  
      hazardous: neo.is_potentially_hazardous_asteroid,
      sentry: neo.is_sentry_object,
  
      // pick meters (easy to show)
      diameterMinM: neo.estimated_diameter?.meters?.estimated_diameter_min ?? null,
      diameterMaxM: neo.estimated_diameter?.meters?.estimated_diameter_max ?? null,
  
      // approach can be null
      missKm: approach?.miss_distance?.kilometers ? Number(approach.miss_distance.kilometers) : null,
      velKph: approach?.relative_velocity?.kilometers_per_hour ? Number(approach.relative_velocity.kilometers_per_hour) : null,
  
      approachDateFull: approach?.close_approach_date_full ?? null,
    };
}