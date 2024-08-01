import useGradYear from "@/constants/gradYearList";

const useDivisionList = (branch: string, currentYear: string) => {
    
  const gradYearList = useGradYear();
  const selectedGradYear = gradYearList.find(
    (item) => item.year === currentYear
  )?.gradYear;
  
  const divisionListFunction = (branch: string, selectedGradYear: string): string[] => {
    let divisionList: string[] = [];

    if (currentYear == "FE") {
        divisionList = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
      }
    
      else if (branch == "Comps") {
        divisionList = ["C1", "C2", "C3"];
      }
    
      else if (branch == "Chem") {
        divisionList = ["K"];
      }
    
      else if (currentYear == "SE") {
        if (branch == "It" || branch == "Aids") {
          divisionList = ["S1", "S2"];
        } else {
          divisionList = ["A"];
        }
      }
    
      else if (currentYear == "TE") {
        if (branch == "It" || branch == "Aids") {
          divisionList = ["T1", "T2"];
        } else {
          divisionList = ["A"];
        }
      }
    
      else if (currentYear == "BE") {
        if (branch == "It" || (branch == "Aids" && selectedGradYear!= "2024")) {
          divisionList = ["B1", "B2"];
        } else {
          divisionList = ["A"];
        }
      }

      return divisionList;
  };

  return  divisionListFunction(branch, selectedGradYear);
};

export default useDivisionList;
