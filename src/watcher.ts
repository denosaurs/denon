/** The type of file change */
export type FileEvent = "any" | "access" | "create" | "modify" | "remove";

/** A file that has been changed in any way */
export interface FileChange {
  /** The path of the changed file */
  path: string;
  /** The type of change that occurred */
  event: FileEvent;
}

export abstract class Watcher extends AsyncIterable<FileChange[]> {
}
