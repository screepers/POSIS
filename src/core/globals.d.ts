type PosisPID = string | number;

interface PosisInterfaces {
	baseKernel: IPosisKernel;
	spawn: IPosisSpawnExtension;
	sleep: IPosisSleepExtension;
	coop: IPosisCooperativeScheduling;
}
