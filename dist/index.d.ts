type PosisPID = string | number;

type PosisInterfaces = {
	baseKernel: IPosisKernel;
	spawn: IPosisSpawnExtension;
}
// Bundle for programs that are logically grouped
interface IPosisBundle<IDefaultRootMemory> {
	// host will call that once, possibly outside of main loop, registers all bundle processes here
	install(registry: IPosisProcessRegistry): void;
	// image name of root process in the bundle, if any
	rootImageName?: string;
	// function returning default starting memory for root process, doubles as public parameter documentation
	defaultRootMemory?: () => IDefaultRootMemory;
}
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
interface IPosisProcessContext {
    readonly memory: any; // private memory
    readonly imageName: string; // image name (maps to constructor)
    readonly id: PosisPID; // ID
    readonly parentId: PosisPID; // Parent ID
    readonly log: IPosisLogger; // Logger 
    queryPosisInterface<T extends keyof PosisInterfaces>(interfaceId: T): PosisInterfaces[T] | undefined;
}

// Bundle: Don't write to context object (including setting new props on it), host will likely freeze it anyway. 
// Host: freeze the thing!
interface PosisProcessConstructor {
    new (context: IPosisProcessContext): IPosisProcess;
}

interface IPosisProcess {
    // Main function, implement all process logic here. 
    run(): void; 
}
interface IPosisProcessRegistry {
	// name your processes' image names with initials preceding, like ANI/MyCoolPosisProgram (but the actual class name can be whatever you want)
	// if your bundle consists of several programs you can pretend that we have a VFS: "ANI/MyBundle/BundledProgram1"
	register(imageName: string, constructor: new (context: IPosisProcessContext) => IPosisProcess): boolean;
}
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
        message?: string
    }
    getCreep(id: string): Creep | undefined;
}