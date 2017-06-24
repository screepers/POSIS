// Bundle for programs that are logically grouped
interface IPosisBundle {
	install(registry: IPosisProcessRegistry): void;

	rootImageName?: string;
	defaultStartContext?: any;
}
