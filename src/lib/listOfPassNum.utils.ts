export function listOfPassNum(rangeString: String) {
    const [startStr, endStr] = rangeString.split('-');
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);
  
    if (isNaN(start) || isNaN(end) || start > end) {
      throw new Error('Invalid range string');
    }
  
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i.toString().padStart(startStr.length, '0'));
    }
  
    return result;
}