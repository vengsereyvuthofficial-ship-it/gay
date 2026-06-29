export interface ScanResult {
  title: string;
  category: "gay" | "straight" | "bi" | "fabulous" | "error";
  percentageGay: number;
  percentageStraight: number;
  verdict: string;
  stereotypes: string[];
  patronMeme: string;
  advice: string;
  badgeColor: string;
  glowColor: string;
}

export interface StatusLog {
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "scan";
}
