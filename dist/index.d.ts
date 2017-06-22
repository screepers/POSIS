interface IPosisExtension {}
interface IPosisKernel extends IPosisExtension {
    startProcess(imageName: string, startContext: any): IPosisProcess | undefined;
    // killProcess also kills all children of this process
    // note to the wise: probably absorb any calls to this that would wipe out your entire process tree.
    killProcess(pid: PosisPID): void;
    getProcessById(pid: PosisPID): IPosisProcess | undefined;

    // passing undefined as parentId means "make me a root process"
    // i.e. one that will not be killed if another process is killed
    setParent(pid: PosisPID, parentId?: PosisPID): boolean;
}
interface IPosisLogger {
    // because sometimes you don't want to eval arguments to ignore them
    debug(message: (() => string) | string): void;
    info(message: (() => string) | string): void;
    warn(message: (() => string) | string): void;
    error(message: (() => string) | string): void;
}
interface IPosisProcess {
    memory: any; // private memory
    imageName: string; // image name (maps to constructor)
    id: PosisPID; // ID
    parentId: PosisPID; // Parent ID
    log: IPosisLogger; // Logger 
    run(): void; // main function
}
type PosisInterface = "baseKernel" | "spawn";

interface Global {
    // register this function before require()ing your POSIS program bundles; they can call this at the end of their source file to register themselves
    // name your processes' image names with initials preceding, like ANI/MyCoolPosisProgram (but the actual class name can be whatever you want)
    // if you have several programs that are logically grouped (a "bundle") you can pretend that we have a VFS: "ANI/MyBundle/BundledProgram1"
    registerPosisProcess(imageName: string, constructor: new () => IPosisProcess): boolean;
    // For querying extension interfaces (instead of tying ourselves to "levels")
    queryPosisInterface(interfaceId: PosisInterface): IPosisExtension | undefined;
}

type PosisPID = string | number;
declare const enum EPosisSpawnStatus {
  UNKNOWN = -2,
  ERROR = -1,
  QUEUED,
  SPAWNING,
  SPAWNED
}

// NOT FINAL, discussions still underway in slack #posis

// process calls spawnCreep, checks status, if not ERROR, poll 
// getStatus until status is SPAWNED (Handling ERROR if it happens),
// then call getCreep to get the creep itself

interface IPosisSpawnExtension {
    // Queues/Spawns the creep and returns an ID
    spawnCreep(rooms: string[], body: string[][], memory?: any, opts?: { priority?: number }): string;
    // Used to see if its been dropped from queue
    getStatus(id: string): {
      status: EPosisSpawnStatus
      message?:string
    }
    getCreep(id: string): Creep | undefined;
}