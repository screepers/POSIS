// Bundle for programs that are logically grouped
interface IPosisBundle {
	// name your processes' image names with initials preceding, like ANI/MyCoolPosisProgram (but the actual class name can be whatever you want)
	// if your bundle consists of several programs you can pretend that we have a VFS: "ANI/MyBundle/BundledProgram1"
	install(registerPosisProcess: (imageName: string, constructor: new () => IPosisProcess) => boolean): void;
}