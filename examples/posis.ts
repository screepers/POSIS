// 


class SpawnExtension implements IPosisExtension, IPosisSpawnExtension {
    private register: SpawnRegister = {};
    spawnCreep(sourceRoom: string, targetRoom: string, body: string[], memory: any): string {
        let room: Room = Game.rooms[sourceRoom];
        let id: string = RandomIDGenerator();
        memory._id = id;
        this.register[id] = { room: sourceRoom, body, memory };
        room.spawnRole(id, ROLE_CUSTOM, { body: body }, memory);
        return id;
    }
    // Dirty hacky examples below....
    isValid(id: string): boolean {
        if (!this.register[id]) return false;
        let room: Room = Game.rooms[this.register[id].room];
        return !!room.memory.spawnQueue.find((item: SpawnQueueItem) => item.memory._id === id);
    }
    hasSpawned(id: string): boolean {
        return !!this.getCreep(id);
    }
    getCreep(id: string): Creep | undefined {
        return _.find(Game.creeps, (c: Creep) => c.memory._id === id) || undefined;
    }
}

export class PosisLogger {
    private logger: ILogger;
    constructor(logger: ILogger) {
        this.logger = logger;
    }
    debug(message: (() => string) | string): void {
        if (typeof message !== "string")
            message = message();
        return this.logger.debug(message);
    }
    info(message:  (() => string) | string): void {
        if (typeof message !== "string")
            message = message();
        return this.logger.info(message);
    }
    warn(message:  (() => string) | string): void {
        if (typeof message !== "string")
            message = message();
        return this.logger.warn(message);
    }
    error(message: (() => string) | string): void {
        if (typeof message !== "string")
            message = message();
        return this.logger.error(message);
    }
}

export abstract class PosisBaseProcess implements IPosisProcess {
    public scope: ProcessScope;
    private logger: IPosisLogger;
    get memory(): any {
        return this.scope.memory;
    }
    get imageName(): string {
        return this.scope.pinfo.name;
    }
    get id(): PosisPID {
        return this.scope.pinfo.id;
    }
    get parentId(): PosisPID {
        return this.scope.pinfo.id;
    }
    get log(): IPosisLogger {
        if (!this.logger) this.logger = new PosisLogger(this.scope.logger);
        return this.logger;
    }
    abstract run(): void;
}

function RandomIDGenerator(): string {
    return Math.random().toString().slice(2);
}

class PosisKernel implements IPosisKernel, IPosisExtension {
    private kernel: IKernel;
    constructor(kernel: IKernel) {
        this.kernel = kernel;
    }
    startProcess(parent: IPosisProcess, imageName: string, startContext: any): IPosisProcess | undefined {
        let id = this.kernel.spawn(parent.id as PID, imageName);
        return this.getProcessById(id);
    }
    killProcess(pid: PosisPID): void {
        if (pid < 2) return; // Avoid killing kernel and init
        this.kernel.kill(pid as PID, "SIGKILL");
    }
    getProcessById(pid: PosisPID): IPosisProcess | undefined {
        let proc: IPosisProcess;
        this.kernel.getWrapedProc(pid as PID, (p: IProcess | IPosisProcess) => {
            proc = p as IPosisProcess;
        });
        return proc;
    }
    setParent(pid: PosisPID, parentId?: PosisPID): boolean {
        let pinfo = this.kernel.process(pid as PID);
        if (!pinfo) return false;
        pinfo.parentPID = parentId as PID || 0;
        return true;
    }
}

// Runtime stuff
let pkernel: any = new PosisKernel(kernel);
let spawnExtension: any = new SpawnExtension();

// For querying extension interfaces (instead of tying ourselves to "levels")
global.queryPosisInterface = function<TQI extends IPosisExtension>(interfaceId: string): IPosisExtension & TQI | undefined {
    if (interfaceId === "baseKernel") return pkernel;
    if (interfaceId === "spawn-v1") return spawnExtension;
    return;
};
global.registerPosisProcess = function(imageName: string, constructor: any): boolean {
    kernel.registerProc(imageName, constructor);
    return true;
};
