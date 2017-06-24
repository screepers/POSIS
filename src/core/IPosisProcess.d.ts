interface IPosisProcessContext {
    memory: any; // private memory
    imageName: string; // image name (maps to constructor)
    id: PosisPID; // ID
    parentId: PosisPID; // Parent ID
    log: IPosisLogger; // Logger 
    queryPosisInterface<T extends keyof PosisInterfaces>(interfaceId: T): PosisInterfaces[T] | undefined;
}

interface IPosisProcess {
    run(context: IPosisProcessContext): void; // main function
}
