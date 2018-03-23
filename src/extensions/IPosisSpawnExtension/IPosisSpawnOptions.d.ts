declare interface IPosisSpawnOptions {
    /**
     * names of rooms associated with the creep being spawned.
     * Must contain at least one room. Host should select spawner based on its own logic
     * May contain additional rooms as a hints to host. Host may ignore hints
     */
    rooms: string[];
    /**
     * body variants of the creep being spawned, at least one must be provided
     * host must guarantee that the spawning creep will have one of provided bodies
     * which body to spawn is up to host to select based on its own logic
     * body templates should be sorted in the order of diminishing desirability
     */
    body: string[][];
    /**
     * spawn priority in range -1000 (the highest) to 1000 (the lowest)
     * used as a hint for host's logic. Host may (but not guarantee) spawn creeps in priority order
     */
    priority?: number;
    /**
     * id of the process which is spawned creep associated to
     * Used as a hint for host's logic. Host may (but not guarantee) consider currently spawned creeps
     * detached, may (but not guarantee) remove scheduled creeps from queue on process termination
     */
    pid?: PosisPID;
}
