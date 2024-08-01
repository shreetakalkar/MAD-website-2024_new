const useBatchList = (div: string, branch: string) => {
  let batches: string[] = [];
  if (div == null) {
    return batches;
  }
  if (branch === "Comps") {
    for (let i = 1; i <= 4; i++) {
      batches.push(`${div}${i}`);
    }
  } else {
    for (let i = 1; i <= 3; i++) {
      batches.push(`${div}${i}`);
    }
  }
  return batches;
};

export default useBatchList;
