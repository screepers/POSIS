declare interface IPosisSegmentsExtension {
  // Returns undefined if segment isn't loaded,
  // else parsed JSON if contents is JSON, else string
  load(id: number): IPosisSegmentsValue | undefined;
  // marks segment for saving, implementations
  // may save immediately or wait until end of tick
  // subsequent load calls within the same tick should
  // return this value
  save(id: number, value: IPosisSegmentsValue): void;
  // Should add ID to active list
  activate(id: number): void;
}
