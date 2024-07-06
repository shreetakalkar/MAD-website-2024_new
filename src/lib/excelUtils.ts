import ExcelJS from "exceljs";

export const createExcelFile = async (enquiries: any[]): Promise<Blob | null> => {
  console.log(enquiries); 
  try {
    const workbook = new ExcelJS.Workbook();
    const westernWorksheet = workbook.addWorksheet("Western");
    const centralWorksheet = workbook.addWorksheet("Central");

    // Define the columns for both worksheets
    const columns = [
      { header: "SRNO", key: "srno", width: 3.86 },
      { header: "PASSNO", key: "passNum", width: 10.57 },
      { header: "NAME", key: "name", width: 26.43 },
      { header: "M/F", key: "gender", width: 2.57 },
      { header: "DOB", key: "dob", width: 9.57 },
      { header: "FROM", key: "from", width: 10.86 },
      { header: "TO", key: "to", width: 10.86 },
      { header: "CLASS I/II", key: "class", width: 6 },
      { header: "MODE M/Q", key: "mode", width: 6 },
      { header: "DATE OF ISSUE", key: "lastPassIssued", width: 9.57 },
      { header: "Address", key: "address", width: 38.57 },
    ];

    westernWorksheet.columns = columns;
    centralWorksheet.columns = columns;

    // Set row height and margins for both worksheets
    [westernWorksheet, centralWorksheet].forEach((worksheet) => {
      worksheet.properties.defaultRowHeight = 30;
      worksheet.pageSetup.margins = {
        top: 0.3,
        left: 0.5,
        right: 0.0,
        bottom: 0.0,
        header: 0.0,
        footer: 0.0,
      };
      worksheet.mergeCells('A1:K1');
      worksheet.getCell('A1').value = 'Thadomal Shahani Engineering College';
      worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.getRow(1).height = 30;
      worksheet.getCell('A1').font = { size: 20, bold: true };
      worksheet.columns.forEach((column) => {
        column.style = { font: { size: 12 } };  // Set default font size for all columns
      });
    });

    // Add the data rows to the appropriate worksheets
    let harborIndex = 1;
    let centralIndex = 1;

    enquiries.forEach((enquiry, index) => {
      const rowData = {
        srno: index + 1,
        passNum: enquiry.passNum,
        name: `${enquiry.lastName} ${enquiry.firstName} ${enquiry.middleName}`,
        gender: enquiry.gender === 'Male' ? "M" : "F",
        dob: enquiry.dob.toDate().toLocaleDateString(),
        from: enquiry.from,
        to: enquiry.to,
        class: enquiry.class,
        mode: enquiry.duration,
        lastPassIssued: enquiry.lastPassIssued?.toDate().toLocaleDateString() ?? "",
        address: enquiry.address,
      };

      const travelLane = enquiry.travelLane.toLowerCase();
      if (travelLane === 'harbor' || travelLane === 'western' || travelLane === 'harbour') {
        westernWorksheet.addRow(rowData);
        harborIndex++;
      }
      else {
        centralWorksheet.addRow(rowData);
        centralIndex++;
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

  } catch (error) {
    console.error("Error creating Excel file:", error);
    return null;
  }
};

export const downloadExcelFile = (content: Blob, fileName: string): void => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(content);
  link.download = fileName;
  link.click();
};
