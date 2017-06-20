import { IPosisLogger } from "./IPosisLogger";
export interface IPosisProcess {
    memory: any; // private memory
    imageName: string; // image name (maps to constructor)
    id: string; // ID
    parentId: string; // Parent ID
    log: IPosisLogger; // Logger 
    run(): void; // main function
}