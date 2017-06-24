// Bundle for programs that are logically grouped
interface IPosisBundle {
	install(registry: IPosisProcessRegistry): void;

	// image name of root process in the bundle, if any
	rootImageName?: string;
}
