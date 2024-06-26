import { useState, useEffect } from "react";

const useGradYear = () => {
  const [gradYearList, setGradYearList] = useState<any[]>([]);

  const generateGradYear = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-based index

    let feGradYear = currentYear + 4;
    if (currentMonth < 6) {
      feGradYear = currentYear + 3;
    }

    const years = [
      { id: 1, year: "FE", gradYear: feGradYear },
      { id: 2, year: "SE", gradYear: feGradYear - 1 },
      { id: 3, year: "TE", gradYear: feGradYear - 2 },
      { id: 4, year: "BE", gradYear: feGradYear - 3 },
    ];

    setGradYearList(years);
  };

  useEffect(() => {
    generateGradYear();
  }, []);

  return gradYearList;
};

export default useGradYear;
