type PosisInterface = "baseKernel" | "spawn";

interface Global {
    // register this function before require()ing your POSIS program bundles; they can call this at the end of their source file to register themselves
    // name your processes' image names with initials preceding, like ANI/MyCoolPosisProgram (but the actual class name can be whatever you want)
    // if you have several programs that are logically grouped (a "bundle") you can pretend that we have a VFS: "ANI/MyBundle/BundledProgram1"
    registerPosisProcess(imageName: string, constructor: new () => IPosisProcess): boolean;
    // For querying extension interfaces (instead of tying ourselves to "levels")
    queryPosisInterface(interfaceId: PosisInterface): IPosisExtension | undefined;
}

type PosisPID = string | number;
