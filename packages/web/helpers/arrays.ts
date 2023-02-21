/**
 * Returns typed object keys
 * @param obj
 */
export const objectKeys = <Obj>(obj: Obj): (keyof Obj)[] => {
  return Object.keys(obj as object) as (keyof Obj)[];
};

export function arrayMerge<T>(array1: T[], array2: T[]): T[] {
  return ([] as T[]).concat(array1, array2);
}

export function fuzzyDeepSearch<T>(
  items: T[],
  key: keyof T,
  searchValue: string
) {
  if (searchValue === "") {
    return items;
  }
  const toReturn: T[] = [];
  items.forEach((item) => {
    const itemValue = item[key] as string;
    if (
      typeof itemValue === "string" &&
      itemValue.toLowerCase().includes(searchValue.toLocaleLowerCase())
    ) {
      toReturn.push(item);
    }
  });
  return toReturn;
}

export function fuzzyFlatSearch(items: string[], query: string) {
  if (query === "") {
    return items;
  }
  const toReturn: string[] = [];
  items.forEach((item) => {
    if (item.includes(query)) {
      toReturn.push(item);
    }
  });
  return toReturn;
}
