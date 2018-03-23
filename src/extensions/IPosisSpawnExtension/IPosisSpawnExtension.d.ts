/*
 * NOT FINAL, discussions still underway in slack #posis
 *
 * process calls spawnCreep, checks status, if not ERROR, poll
 * getStatus until status is SPAWNED (Handling ERROR if it happens),
 * then call getCreep to get the creep itself
 */
declare interface IPosisSpawnExtension {
    /**
     * Queues/Spawns the requested creep
     * @param opts options for how and where to spawn the requested creep
     * @returns a unique id related to this specific creep request
     */
    spawnCreep(opts: IPosisSpawnOptions): string;
    /**
     * Used to see if its been dropped from queue
     * @param id an id returned by spawnCreep()
     */
    getStatus(id: string): {
        status: EPosisSpawnStatus
        message?: string
    };
    /**
     * Get the currently spawning creep
     * @param id an id returned by spawnCreep()
     * @returns Creep object or undefined if the creep does not exist yet
     */
    getCreep(id: string): Creep | undefined;
    /**
     * Cancel a previously ordered Creep (`spawnCreep`).
     * @param id an id returned by spawnCreep()
     * @returns `true` if it was cancelled successfully.
     */
    cancelCreep(id: string): boolean;
}
