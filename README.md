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
    run(kernel: IPosisLevel1Kernel): void; // main function
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
interface IPosisLevel1Kernel {
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
