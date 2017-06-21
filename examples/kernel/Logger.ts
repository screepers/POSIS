export class Logger implements IPosisLogger {
  private proc: IPosisProcess;
  constructor(proc: IPosisProcess) {
    this.proc = proc;
  }
  debug (message: (() => string) | string): void {
    console.log(`[${this.proc.id}] debug`, typeof message === "string" ? message : message());
  }
  info (message:  (() => string) | string): void {
    console.log(`[${this.proc.id}] info`, typeof message === "string" ? message : message());
  }
  warn (message:  (() => string) | string): void {
    console.log(`[${this.proc.id}] warn`, typeof message === "string" ? message : message());
  }
  error (message: (() => string) | string): void {
    console.log(`[${this.proc.id}] error`, typeof message === "string" ? message : message());
  }
}