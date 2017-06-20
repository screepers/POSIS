# POSIS
Portable Operating System Interface for Screeps
 
# Current Draft

Live editing [here](https://hackmd.io/GwBhBNgdgJgQwLQEYCcoEBYDMAjAxgnOOIjABwQBmMK4IGIZQA==)

- Needs namespacing
- Needs entry point (to get constructor registry and root process to start)

- POSIS program registry:
```typescript=
declare var global {
    // register this function before require()ing your POSIS program bundles; they can call this at the end of their source file to register themselves
    // name your processes' image names with initials preceding, like ANI/MyCoolPosisProgram (but the actual class name can be whatever you want)
    // if you have several programs that are logically grouped (a "bundle") you can pretend that we have a VFS: "ANI/MyBundle/BundledProgram1"
    registerPosisProcess(imageName: string, constructor: any);
}
```

```typescript=
interface IPosisProcess {
    memory: any; // private memory
    imageName: string; // image name (maps to constructor)
    id: string; // ID
    parentId: string; // Parent ID
    log: IPosisLogger; // Logger 
    run(kernel: IPosisKernel): void; // main function
    exit(): void; // Exit
}
```

```typescript=
interface IPosisLogger {
    // because sometimes you don't want to eval arguments to ignore them
    debug(message: () => string): void;
    info(message: () => string): void;
    warn(message: () => string): void;
    error(message: () => string): void;
}
```

```typescript=
interface IPosisKernel {
    startProcess(parent: IProcess, imageName: string, startContext: any): IProcess;
    // killProcess also kills all children of this process
    // note to the wise: probably absorb any calls to this that would wipe out your entire process tree.
    killProcess(pid: string);
    getProcessById(pid: string): IProcess | undefined;
    // request independence from own parent
    detach(pid: string): boolean;
    // Probably we should remove detach() and move detaching to setParent(thisid, undefined)
    setParent(pid: string, parentId: string): boolean;
    // For querying extension interfaces (instead of tying ourselves to "levels")
    // todo: typing magic so we can have more interface signatures - On it (Prime)
    // assuming: interface IPosisExtension extends IPosisLevel1Kernel { }
    queryPosisInterface<
        TQI extends IPosisExtension
    >(
        interfaceId: string
    ): TQI | undefined;
}
```

- Example global/kernel extension interface
```typescript=
// this is not a good path cache extension interface.
interface IPosisPathCacheExtension : IPosisExtension {
    getNextMoveInPath(p: Path, pos: RoomPosition): number;
}

let pathCache = kernel.QueryPosisInterface<IPosisPathCacheExtension>("path-cache-v1");
if (pathCache) {
    // do stuff with getNextMoveInPath...
} else {
    // fall back to vanilla moveTo
}
```

- Example process extension interface
```typescript=
interface IPosisProcessSleepExtension : IPosisProcess {
    sleep(ticks = 1);
}

function hasSleepExtension(process: IPosisProcess): process is IPosisProcessSleepExtension {
    return (process.sleep !== undefined);
}

if (hasSleepExtension(this)) {
    this.sleep(1);
}
```

- Basic example process
```typescript=
// ags.example.js
class ExampleProcess implements IPosisProcess {
    run(){
        let kernel = queryPosisInterface('baseKernel') // 'baseKernel_level1'?
        let child = kernel.startProcess(this.id, 'AGS/AnotherProcess',{ 
            msg: 'Hello World!'
        })
        kernel.detach(child.id)
        this.exit() // Removed exit code
    }
}
class AnotherProcess implements IPosisProcess {
    run(){
        let kernel = queryPosisInterface('baseKernel') // 'baseKernel_level1'?
        let parent = kernel.getProcessById(this.parentId)
        this.log.info('TICK!', Game.time, this.memory.msg)
    }
}
class YetAnotherProcess implements IPosisProcess {
    run(){
        let IPC = queryPosisInterface('ipc')
        if(!IPC) return this.exit()
        IPC.call(0, 'someMethod or whatever')
    }
}
registerPosisProcess('AGS/ExampleProcess', ExampleProcess)
registerPosisProcess('AGS/AnotherProcess', AnotherProcess)
registerPosisProcess('AGS/YetAnotherProcess', YetAnotherProcess)


// In kernel or some other location for loading processes
require('ags.example.js')
```


- Spawn Extension
```typescript=
// Needs review
interface IPosisSpawnExtension {
    // Queues/Spawns the creep and returns an ID
    spawnCreep(sourceRoom: string, targetRoom: string, body: string[], memory: any): string 
    // Used to see if its been dropped from queue
    isValid(id: string): bool 
    hasSpawned(id: string): bool
    getCreep(id: string): Creep | undefined
}
```

```typescript=
// An implementation of the above based on my (ags) codebase, feel free to ignore....
class SpawnExtension implements IPosisSpawnExtension {
    constructor(){
     // Implementation specific setup
     this.register = {}
    }
    spawnCreep(sourceRoom: string, targetRoom: string, body: string[], memory: any): string {
        let room = Game.rooms[sourceRoom]
        let id = RandomIDGenerator() // Magic
        memory._id = id
        this.register[id] = { room: sourceRoom, body, memory }
        room.spawnRole(id, ROLE_CUSTOM, { body: body }, memory)
        return id;
    }
    // Dirty hacky examples below....
    isValid(id): bool {
        if(!this.register[id]) return false
        let room = Game.rooms[this.register[id].room]
        return !!room.memory.spawnQueue.find(item=>item.memory._id == id)
    }
    hasSpawned(id: string): bool {
        return !!this.getCreep(id)
    }
    getCreep(id: string): Creep | undefined {
        return _.find(Game.creeps, c=>c.memory._id == id) || undefined
    }
}
```