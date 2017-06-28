// Bundle for programs that are logically grouped
interface IPosisBundle<IDefaultRootMemory> {
	// host will call that once, possibly outside of main loop, registers all bundle processes here
	install(registry: IPosisProcessRegistry): void;
	// image name of root process in the bundle, if any
	rootImageName?: string;
	// function returning default starting memory for root process, doubles as public parameter documentation
	makeDefaultRootMemory?: (override?: IDefaultRootMemory) => IDefaultRootMemory;
}
