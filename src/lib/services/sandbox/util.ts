export type SandboxLog = {
  method: string;
  data: any;
}

export const SandboxStatus = {
  Parsing: 0,
  Running: 1,

  Idle: 2
}