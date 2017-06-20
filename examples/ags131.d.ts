declare const ROLE_CUSTOM: string;

interface SpawnRoleOpts {
  body: string[];
}

interface Room {
  spawnRole(id: string, role: string, opts: SpawnRoleOpts, memory: any): void;
}

declare const _: any;

interface SpawnRegister {
    [s: string]: {
        room: string,
        body: string[],
        memory: any
    };
}

interface SpawnQueueItem {
    memory: {
        _id: string
    };
}


interface ProcessInfo {
  name: string;
  args: any[];
  id: PID;
  parentPID: PID;
}

interface IProcess {
  pinfo: ProcessInfo;
  mem: any;
  id: PID;
  run(): void;
}

interface ProcessScope {
  pinfo: ProcessInfo;
  memory: any;
  logger: ILogger;
}

type PID = number;

interface IKernel {
  process(id: PID): ProcessInfo;
  spawn(parent: PID, name: string, ...args: string[]): PID;
  kill(id: PID, signal: string): void;
  setMemory(id: PID, value: any): void;
  getWrapedProc(id: PID, cb: (proc: IProcess | IPosisProcess) => void): void;
  registerProc(name: string, constructor: new () => IPosisProcess): void;
}

interface ILogger {
    debug(message: string): void;
    info(message:  string): void;
    warn(message:  string): void;
    error(message: string): void;
}

declare const kernel: IKernel;

// HACK! 
declare function registerPosisProcess(imageName: string, constructor: new () => IPosisProcess): boolean;
declare function queryPosisInterface(interfaceId: string): IPosisExtension | undefined;
