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
    queryPosisInterface<T extends keyof IPosisInterfaces>(interfaceId: T): IPosisInterfaces[T] | undefined;
}
