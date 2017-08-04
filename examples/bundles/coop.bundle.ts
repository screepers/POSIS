import shimCooperativeScheduling from '../shims/extensions/coop';

class PosisTest_CooperativeSchedulingProcess implements IPosisProcess {

    public static ImageName = "PosisTest/CooperativeSchedulingProcess";

    protected coop: IPosisCooperativeScheduling;

    public constructor(context: IPosisProcessContext) {
        this.coop = shimCooperativeScheduling(context.queryPosisInterface('coop'));
    }

    public run(): void {
        this.coop.wrap(function*() {
            // do expensive stuff
            yield; // give kernel option to cancel
            // do more stuff
            yield () => { // give kernel another option to cancel, this time with a shutdown function
                // save results
            };
            // and some pretty logging if you want to
        })
    }
}

export default {

    install(registry: IPosisProcessRegistry): void {
        registry.register(PosisTest_CooperativeSchedulingProcess.ImageName, PosisTest_CooperativeSchedulingProcess);
    },

    rootImageName: PosisTest_CooperativeSchedulingProcess.ImageName,

} as IPosisBundle<undefined>;
