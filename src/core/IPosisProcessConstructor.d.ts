/**
 * Bundle: Don't write to context object (including setting new props on it), host will likely freeze it anyway.
 * Host: freeze the thing!
 */
declare interface IPosisProcessConstructor {
    new(context: IPosisProcessContext): IPosisProcess;
}
