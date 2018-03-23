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
