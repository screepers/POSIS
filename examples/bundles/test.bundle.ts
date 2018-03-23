// Root process expects to be started with 'startContext = { maxRunTime: N }'

// tslint:disable-next-line:class-name
interface IPOSISTest_BaseProcessMemory {
    started?: number;
    lastTick?: number;
    supposedToBeDead?: boolean;

    // set by start context
    maxRunTime?: number;
}

// tslint:disable-next-line:class-name
class POSISTest_BaseProcess implements IPosisProcess {
    public testName = "POSIS base:";
    public static ImageName = "POSISTest/PosisBaseTestProcess";

    constructor(private context: IPosisProcessContext) {
    }

    public get tmemory(): IPOSISTest_BaseProcessMemory {
        return this.context.memory as IPOSISTest_BaseProcessMemory;
    }

    public run(): void {
        let fatal = false;

        if (this.context.log === undefined) {
            throw Error(`${this.testName}: 'log' is not set`);
        }

        if (this.context.memory === undefined) {
            this.context.log.error(`${this.testName}: 'memory' not set`);
            fatal = true;
        }

        this.context.log.error(`${this.testName}: starting basic diagnostics`);

        this.context.log.debug(`${this.testName}: debug message`);
        this.context.log.debug(() => `${this.testName}: deferred debug message`);
        this.context.log.info(`${this.testName}: info message`);
        this.context.log.info(() => `${this.testName}: deferred info message`);
        this.context.log.warn(`${this.testName}: warn message`);
        this.context.log.warn(() => `${this.testName}: deferred warn message`);
        this.context.log.error(`${this.testName}: error message`);
        this.context.log.error(() => `${this.testName}: deferred error message`);

        if (this.context.imageName === undefined) {
            this.context.log.error(`${this.testName}: 'imageName' not set`);
        }

        if (this.context.imageName !== POSISTest_BaseProcess.ImageName) {
            this.context.log.error(`${this.testName}: 'imageName' not matching, expected: '${POSISTest_BaseProcess.ImageName}', actual '${this.context.imageName}'`);
        }

        if (this.context.id === undefined) {
            this.context.log.error(`${this.testName}: 'id' not set`);
        }

        if (this.context.parentId === undefined) {
            this.context.log.error(`${this.testName}: 'parentId' not set`);
        }

        this.context.log.error(`${this.testName}: basic diagnostics completed`);

        const kernel = this.context.queryPosisInterface("baseKernel");

        if (!kernel) {
            this.context.log.error(`${this.testName}: baseKernel interface is undefined, seriously people!`);
            return;
        }

        if (fatal) {
            this.context.log.error(`${this.testName}: fatal errors, trying to exit`);
            kernel.killProcess(this.context.id);
            return;
        }

        if (this.tmemory.started === undefined) {
            this.tmemory.started = Game.time;
            this.tmemory.lastTick = Game.time;
        }

        if (this.tmemory.supposedToBeDead) {
            this.context.log.error(`${this.testName}: can't exit`);
        }

        this.context.log.info(`${this.testName}: started on ${this.tmemory.started}, running for ${Game.time - this.tmemory.started}`);

        if (this.tmemory.maxRunTime === undefined) {
            this.context.log.error(`${this.testName}: 'maxRunTime' is not set, arguments are not passed, or broken`);
            return;
        }

        if (Game.time - this.tmemory.started >= this.tmemory.maxRunTime!) {
            this.tmemory.supposedToBeDead = true;
            kernel.killProcess(this.context.id);
        }

        this.tmemory.lastTick = Game.time;
    }
}

// tslint:disable-next-line:max-classes-per-file
export const bundle: IPosisBundle<any> = {
    install(registry: IPosisProcessRegistry) {
        registry.register(POSISTest_BaseProcess.ImageName, POSISTest_BaseProcess);
    },
    rootImageName: POSISTest_BaseProcess.ImageName
};
