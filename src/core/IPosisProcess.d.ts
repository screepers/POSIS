interface IPosisProcessContext {
    memory: any; // private memory
    imageName: string; // image name (maps to constructor)
    id: PosisPID; // ID
    parentId: PosisPID; // Parent ID
    log: IPosisLogger; // Logger 
    queryPosisInterface<T extends keyof PosisInterfaces>(interfaceId: T): PosisInterfaces[T] | undefined;
}

interface IPosisProcess {
    // Main function, implement all process logic here. 
    // Bundle: Don't write to context object, host will likely freeze it anyway. 
    // Host: freeze the thing!
    run(context: IPosisProcessContext): void; 
}
