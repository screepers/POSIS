declare const enum EPosisSpawnStatus {
  UNKNOWN = -2,
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
    spawnCreep(rooms: string[], body: string[][], memory?: any, opts?: { priority?: number }): string;
    // Used to see if its been dropped from queue
    getStatus(id: string): {
      status: EPosisSpawnStatus
      message?:string
    }
    getCreep(id: string): Creep | undefined;
}