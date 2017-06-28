declare const enum EPosisSpawnStatus {
    ERROR = -1,
    QUEUED,
    SPAWNING,
    SPAWNED
}

// NOT FINAL, discussions still underway in slack #posis

// process calls spawnCreep, checks status, if not ERROR, poll 
// getStatus until status is SPAWNED (Handling ERROR if it happens),
// then call getCreep to get the creep itself

interface IPosisSpawnExtension {
    // Queues/Spawns the creep and returns an ID
    spawnCreep(opts: { 
        //   - 'rooms' are names of rooms associated with the creep being spawned.
        //     Must contain at least one room. Host should select spawner based on its own logic
        //     May contain additional rooms as a hints to host. Host may ignore hints
        rooms: string[], 
        //   - 'body' are body variants of the creep being spawned, at least one must be provided
        //     Host must guarantee that the spawning creep will have one of provided bodies
        //     Which body to spawn is up to host to select based on its own logic
        //     Body templates should be sorted in the order of diminishing desirability
        body: string[][], 
        //   - 'priority' is spawn priority in range -1000 (the highest) to 1000 (the lowest)
        //     Used as a hint for host's logic. Host may (but not guarantee) spawn creeps in priority order
        priority?: number, 
        //   - 'pid' is id of the process which is spawned creep associated to
        //     Used as a hint for host's logic. Host may (but not guarantee) consider currently spawned creeps
        //     detached, may (but not guarantee) remove scheduled creeps from queue on process termination
        pid?: PosisPID }): string;
    // Used to see if its been dropped from queue
    getStatus(id: string): {
        status: EPosisSpawnStatus
        message?: string
    }
    getCreep(id: string): Creep | undefined;
}
