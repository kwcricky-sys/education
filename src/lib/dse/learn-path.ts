/** Unlock logic shared by the English and ECON learn paths. */
export type PathUnit = { id: number; title: string; prerequisites: number[] };

export function isUnitUnlocked(unit: PathUnit, completed: number[]): boolean {
  return unit.prerequisites.every((p) => completed.includes(p));
}

/** Units that were locked before `passedId` was completed and are open now. */
export function unitsUnlockedBy<U extends PathUnit>(
  units: U[],
  completedBefore: number[],
  passedId: number,
): U[] {
  const after = completedBefore.includes(passedId)
    ? completedBefore
    : [...completedBefore, passedId];
  return units.filter(
    (u) =>
      !after.includes(u.id) &&
      !isUnitUnlocked(u, completedBefore) &&
      isUnitUnlocked(u, after),
  );
}

/** First open unit the learner has not passed yet. */
export function nextOpenUnit<U extends PathUnit>(
  units: U[],
  completed: number[],
): U | undefined {
  return units.find((u) => !completed.includes(u.id) && isUnitUnlocked(u, completed));
}

export function missingPrerequisites<U extends PathUnit>(
  units: U[],
  unit: U,
  completed: number[],
): U[] {
  return unit.prerequisites
    .filter((p) => !completed.includes(p))
    .map((p) => units.find((u) => u.id === p))
    .filter((u): u is U => u !== undefined);
}
