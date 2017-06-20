import { IPosisProcess } from "./IPosisProcess";
export interface IPosisKernel {
    startProcess(parent: IPosisProcess, imageName: string, startContext: any): IPosisProcess | undefined;
    // killProcess also kills all children of this process
    // note to the wise: probably absorb any calls to this that would wipe out your entire process tree.
    killProcess(pid: string): void;
    getProcessById(pid: string): IPosisProcess | undefined;

    // passing undefined as parentId means "make me a root process"
    // i.e. one that will not be killed if another process is killed
    setParent(pid: string, parentId?: string): boolean;   
}