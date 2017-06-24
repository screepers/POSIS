// Root process expects to be started with 'startContext = { maxRunTime: N }'

interface POSISTest_BaseProcessMemory
{
	started?: number;
	lastTick?: number;
	supposedToBeDead?: boolean;

	// set by start context
	maxRunTime?: number;
}

class POSISTest_BaseProcess implements IPosisProcess
{
	public testName = "POSIS base:";
	public static ImageName = "POSISTest/PosisBaseTestProcess";

	private context: IPosisProcessContext;

	public get tmemory(): POSISTest_BaseProcessMemory
	{
		return this.context.memory as POSISTest_BaseProcessMemory;
	}

	public run(context: IPosisProcessContext): void
	{
		this.context = context;

		let fatal = false;

		if (context.log === undefined)
			throw Error(`${this.testName}: 'log' is not set`);

		if (context.memory === undefined)
		{
			context.log.error(`${this.testName}: 'memory' not set`);
			fatal = true;
		}

		context.log.error(`${this.testName}: starting basic diagnostics`);

		context.log.debug(`${this.testName}: debug message`);
		context.log.debug(() => `${this.testName}: deferred debug message`);
		context.log.info(`${this.testName}: info message`);
		context.log.info(() => `${this.testName}: deferred info message`);
		context.log.warn(`${this.testName}: warn message`);
		context.log.warn(() => `${this.testName}: deferred warn message`);
		context.log.error(`${this.testName}: error message`);
		context.log.error(() => `${this.testName}: deferred error message`);

		if (context.imageName === undefined)
			context.log.error(`${this.testName}: 'imageName' not set`);

		if (context.imageName !== POSISTest_BaseProcess.ImageName)
			context.log.error(`${this.testName}: 'imageName' not matching, expected: '${POSISTest_BaseProcess.ImageName}', actual '${context.imageName}'`);

		if (context.id === undefined)
			context.log.error(`${this.testName}: 'id' not set`);

		if (context.parentId === undefined)
			context.log.error(`${this.testName}: 'parentId' not set`);

		context.log.error(`${this.testName}: basic diagnostics completed`);

		const kernel = context.queryPosisInterface("baseKernel");

		if (!kernel)
		{
			context.log.error(`${this.testName}: baseKernel interface is undefined, seriously people!`);
			return;
		}

		if (fatal)
		{
			context.log.error(`${this.testName}: fatal errors, trying to exit`);
			kernel.killProcess(context.id);
			return;
		}

		if (this.tmemory.started === undefined)
		{
			this.tmemory.started = Game.time;
			this.tmemory.lastTick = Game.time;
		}

		if (this.tmemory.supposedToBeDead)
			context.log.error(`${this.testName}: can't exit`);

		context.log.info(`${this.testName}: started on ${this.tmemory.started}, running for ${Game.time - this.tmemory.started}`);

		if (this.tmemory.maxRunTime === undefined)
		{
			context.log.error(`${this.testName}: 'maxRunTime' is not set, arguments are not passed, or broken`);
			return;
		}

		if (Game.time - this.tmemory.started >= this.tmemory.maxRunTime!)
		{
			this.tmemory.supposedToBeDead = true;
			kernel.killProcess(context.id);
		}

		this.tmemory.lastTick = Game.time;
	}
}

// tslint:disable-next-line:max-classes-per-file
export const bundle: IPosisBundle =
{
	install(registry: IPosisProcessRegistry)
	{
		registry.register(POSISTest_BaseProcess.ImageName, POSISTest_BaseProcess);
	},
	rootImageName: POSISTest_BaseProcess.ImageName,
	defaultStartContext: { maxRunTime: 10 },
};
