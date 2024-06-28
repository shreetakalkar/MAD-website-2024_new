const calculateAge = (dob) => {
  const dobDate = new Date(dob);
  const today = new Date();

  let ageYears = today.getFullYear() - dobDate.getFullYear();
  let ageMonths = today.getMonth() - dobDate.getMonth();

  if (ageMonths < 0) {
    ageYears--;
    ageMonths += 12;
  }
  // console.log(ageMonths, ageYears);
  return { ageYears, ageMonths };
};
export { calculateAge };
