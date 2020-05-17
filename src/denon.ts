export type DenonEventType =
  | "start"
  | "reload"
  | "crash"
  | "success"
  | "exit";

export interface DenonEvent {
  type: DenonEventType;
}

export interface DenonReloadEvent extends DenonEvent {
  type: "reload";
  change: FileChange[];
}

export class Denon extends IterableIterator<DenonEvent> {
}
