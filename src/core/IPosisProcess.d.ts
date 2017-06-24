interface IPosisProcessContext {
    readonly memory: any; // private memory
    readonly imageName: string; // image name (maps to constructor)
    readonly id: PosisPID; // ID
    readonly parentId: PosisPID; // Parent ID
    readonly log: IPosisLogger; // Logger 
    queryPosisInterface<T extends keyof PosisInterfaces>(interfaceId: T): PosisInterfaces[T] | undefined;
}

interface IPosisProcess {
    // Main function, implement all process logic here. 
    // Bundle: Don't write to context object (including setting new props on it), host will likely freeze it anyway. 
    // Host: freeze the thing!
    constructor(context: IPosisProcessContext);

    run(): void; 
}
