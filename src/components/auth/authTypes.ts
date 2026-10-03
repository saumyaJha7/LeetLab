export type AuthMessage = {
  type: "error" | "success";
  text: string;
} | null;
