/** Bundle for programs that are logically grouped */
declare interface IPosisBundle<IDefaultRootMemory> {
    /** host will call that once, possibly outside of main loop, registers all bundle processes here */
    install(registry: IPosisProcessRegistry): void;
    /** image name of root process in the bundle, if any */
    rootImageName?: string;
    /** function returning default starting memory for root process, doubles as public parameter documentation */
    makeDefaultRootMemory?: (override?: IDefaultRootMemory) => IDefaultRootMemory;
}
declare interface IPosisExtension { }
declare interface IPosisInterfaces {
    baseKernel: IPosisKernel;
    spawn: IPosisSpawnExtension;
    sleep: IPosisSleepExtension;
    coop: IPosisCooperativeScheduling;
}
declare interface IPosisKernel extends IPosisExtension {

    /**
     * beings running a process
     * @param imageName registered image for the process constructor
     * @param startContext context for a process
     */
    startProcess(imageName: string, startContext: any): { pid: PosisPID; process: IPosisProcess } | undefined;

    /**
     * killProcess also kills all children of this process
     * note to the wise: probably absorb any calls to this that would wipe out your entire process tree.
     * @param pid
     */
    killProcess(pid: PosisPID): void;

    /**
     * gets the instance of a running process
     * @param pid
     * @returns process instance or undefined if the pid is invalid
     */
    getProcessById(pid: PosisPID): IPosisProcess | undefined;

    /**
     * passing undefined as parentId means "make me a root process"
     * i.e. one that will not be killed if another process is killed
     * @param pid
     * @param parentId
     * @returns `true` if process was successfully reparented
     */
    setParent(pid: PosisPID, parentId?: PosisPID): boolean;
}
declare interface IPosisLogger {
    // because sometimes you don't want to eval arguments to ignore them
    debug(message: (() => string) | string): void;
    info(message: (() => string) | string): void;
    warn(message: (() => string) | string): void;
    error(message: (() => string) | string): void;
}
declare interface IPosisProcess {
    /**
     * Main function, implement all process logic here.
     */
    run(): void;
}
/**
 * Bundle: Don't write to context object (including setting new props on it), host will likely freeze it anyway.
 * Host: freeze the thing!
 */
declare interface IPosisProcessConstructor {
    new(context: IPosisProcessContext): IPosisProcess;
}
declare interface IPosisProcessContext {
    /** private memory */
    readonly memory: any;
    /** image name (maps to constructor) */
    readonly imageName: string;
    /** ID */
    readonly id: PosisPID;
    /** Parent ID */
    readonly parentId: PosisPID;
    /** Logger */
    readonly log: IPosisLogger;
    queryPosisExtension<T extends keyof IPosisInterfaces>(extensionId: T): IPosisInterfaces[T] | undefined;
}
declare interface IPosisProcessRegistry {
    /**
     * name your processes' image names with initials preceding, like ANI/MyCoolPosisProgram (but the actual class name can be whatever you want)
     * if your bundle consists of several programs you can pretend that we have a VFS: "ANI/MyBundle/BundledProgram1"
     */
    register(imageName: string, constructor: IPosisProcessConstructor): boolean;
}
declare type PosisPID = string | number;
declare interface IPosisCooperativeScheduling {
    /** CPU used by process so far. Might include setup time kernel chooses to charge to the process. */
    readonly used: number;
    /** CPU budget scheduler allocated to this process. */
    readonly budget: number;
    /**
     * Process can wrap function and yield when it is ready to give up for the tick or can continue if CPU is available.
     * optionally yield a shutdown function to perform shutdown tasks like saving current state
     */
    wrap?(makeIterator: () => IterableIterator<void | (() => void)>): void;
}
declare interface IPosisSleepExtension {
    /**
     * puts currently running process to sleep for a given number of ticks
     * @param ticks number of ticks to sleep for
     */
    sleep(ticks: number): void;
}
declare const enum EPosisSpawnStatus {
    ERROR = -1,
    QUEUED,
    SPAWNING,
    SPAWNED
}
/*
 * NOT FINAL, discussions still underway in slack #posis
 *
 * process calls spawnCreep, checks status, if not ERROR, poll
 * getStatus until status is SPAWNED (Handling ERROR if it happens),
 * then call getCreep to get the creep itself
 */
declare interface IPosisSpawnExtension {
    /**
     * Queues/Spawns the requested creep
     * @param opts options for how and where to spawn the requested creep
     * @returns a unique id related to this specific creep request
     */
    spawnCreep(opts: IPosisSpawnOptions): string;
    /**
     * Used to see if its been dropped from queue
     * @param id an id returned by spawnCreep()
     */
    getStatus(id: string): {
        status: EPosisSpawnStatus
        message?: string
    };
    /**
     * Get the currently spawning creep
     * @param id an id returned by spawnCreep()
     * @returns Creep object or undefined if the creep does not exist yet
     */
    getCreep(id: string): Creep | undefined;
    /**
     * Cancel a previously ordered Creep (`spawnCreep`).
     * @param id an id returned by spawnCreep()
     * @returns `true` if it was cancelled successfully.
     */
    cancelCreep(id: string): boolean;
}
declare interface IPosisSpawnOptions {
    /**
     * names of rooms associated with the creep being spawned.
     * Must contain at least one room. Host should select spawner based on its own logic
     * May contain additional rooms as a hints to host. Host may ignore hints
     */
    rooms: string[];
    /**
     * body variants of the creep being spawned, at least one must be provided
     * host must guarantee that the spawning creep will have one of provided bodies
     * which body to spawn is up to host to select based on its own logic
     * body templates should be sorted in the order of diminishing desirability
     */
    body: string[][];
    /**
     * spawn priority in range -1000 (the highest) to 1000 (the lowest)
     * used as a hint for host's logic. Host may (but not guarantee) spawn creeps in priority order
     */
    priority?: number;
    /**
     * id of the process which is spawned creep associated to
     * Used as a hint for host's logic. Host may (but not guarantee) consider currently spawned creeps
     * detached, may (but not guarantee) remove scheduled creeps from queue on process termination
     */
    pid?: PosisPID;
}
