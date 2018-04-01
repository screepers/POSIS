declare interface IPosisCooperativeScheduling {
    /** CPU used by process so far. Might include setup time kernel chooses to charge to the process. */
    readonly used: number;
    /** CPU budget scheduler allocated to this process. */
    readonly budget: number;
    /**
     * Process can wrap function and yield when it is ready to give up for the tick or can continue if CPU is available.
     * optionally yield a shutdown function to perform shutdown tasks like saving current state
     */
    wrap?(makeIterator: () => IterableIterator<void | (() => void)>): void;
}
