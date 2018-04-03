declare interface IPosisSleepExtension {
    /**
     * puts currently running process to sleep for a given number of ticks
     * @param ticks number of ticks to sleep for
     */
    sleep(ticks: number): void;
}
