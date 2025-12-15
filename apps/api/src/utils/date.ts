import { ApiError } from "../types";

export function daysBetween(start: string, end: string) {
    const startD = new Date(start);
    const endD = new Date(end);
  
    if (isNaN(startD.getTime()) || isNaN(endD.getTime())) {
      throw new ApiError(400, "Invalid date value");
    }
  
    if (endD < startD) {
      throw new ApiError(400, "endDate must be >= startDate");
    }
  
    const diffMs = endD.getTime() - startD.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
    return diffDays;
}