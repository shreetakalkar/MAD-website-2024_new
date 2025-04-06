
import { BatchElement } from "@/app/dashboard/@railway/downloads/page";
import ExcelJS from "exceljs";
import { Bold } from "lucide-react";
import { listOfPassNum } from "./listOfPassNum.utils"

// export const createExcelFile = async (
//   enquiries: BatchElement
// ): Promise<Blob | null> => {
//   console.log(enquiries);
//   try {
//     const workbook = new ExcelJS.Workbook();
//     const westernWorksheet = workbook.addWorksheet("Western");
//     const centralWorksheet = workbook.addWorksheet("Central");

//     // Define the columns for both worksheets
//     const columns = [
//       { header: "Sr no", key: "srno", width: 3.86 },
//       { header: "Certificate number", key: "passNum", width: 10.57 },
//       { header: "Name", key: "name", width: 26.43 },
//       { header: "M/F", key: "gender", width: 2.67 }, //2.57
//       { header: "Date of Birth", key: "dob", width: 9.57 },
//       { header: "From", key: "from", width: 10.86 },
//       { header: "To", key: "to", width: 10.86 },
//       { header: "Class I/II", key: "class", width: 6 },
//       { header: "Mode M / Q", key: "mode", width: 6.17 }, //6
//       { header: "Date of Issue", key: "lastPassIssued", width: 9.57 },
//       { header: "Address", key: "address", width: 38.57 },
//     ];

//     westernWorksheet.columns = columns;
//     centralWorksheet.columns = columns;

//     // Set row height and margins for both worksheets
//     [westernWorksheet, centralWorksheet].forEach((worksheet) => {
//       worksheet.properties.defaultRowHeight = 30;
//       worksheet.pageSetup.margins = {
//         top: 0.3,
//         left: 0.5,
//         right: 0.0,
//         bottom: 0.0,
//         header: 0.0,
//         footer: 0.0,
//       };

//       // Title row
//       worksheet.mergeCells("A1:K1");
//       worksheet.getCell("A1").value = "Thadomal Shahani Engineering College";
//       worksheet.getCell("A1").alignment = {
//         vertical: "middle",
//         horizontal: "center",
//       };
//       worksheet.getRow(1).height = 30;
//       worksheet.getCell("A1").font = { size: 20, bold: true };

//       // Subheading row
//       worksheet.mergeCells("A2:K2");
//       worksheet.getCell("A2").alignment = {
//         vertical: "middle",
//         horizontal: "center",
//       };
//       worksheet.getRow(2).height = 20;
//       worksheet.getCell("A2").font = { size: 14 };

//       worksheet.columns.forEach((column) => {
//         column.style = { font: { size: 12 } }; // Set default font size and alignment for all columns
//       });

//       worksheet.addRow(columns.map((col) => col.header));
//       // Apply wrapText only to the header row
//       worksheet.getRow(3).eachCell((cell) => {
//         cell.alignment = { wrapText: true, horizontal: "center" };
//       });
//       worksheet.getRow(3).commit();
//       worksheet.getRow(3).height = 45; //self
//     });

//     westernWorksheet.getCell("A2").value =
//       "Railway Concessions for Western Railway";
//     centralWorksheet.getCell("A2").value =
//       "Railway Concessions for Central Railway";

//     // Add the data rows to the appropriate worksheets
//     let westernIndex = 1;
//     let centralIndex = 1;

//     enquiries.westernEnquiries.forEach((enquiry, index) => {
//       const formatDate = (date: Date) => {
//         const d = new Date(date);
//         const year = d.getFullYear().toString().substr(-2); // Get last 2 digits of the year
//         const month = String(d.getMonth() + 1).padStart(2, "0");
//         const day = String(d.getDate()).padStart(2, "0");
//         return `${day}/${month}/${year}`;
//       };

//       const rowData = {
//         srno: index + 1,
//         passNum: enquiry.passNum,
//         name: `${enquiry.lastName} ${enquiry.firstName} ${enquiry.middleName}`,
//         gender: enquiry.gender === "Male" ? "M" : "F",
//         dob: formatDate(enquiry.dob.toDate()),
//         from: enquiry.from,
//         to: enquiry.to,
//         class: enquiry.class,
//         mode: enquiry.duration === "Monthly" ? "Mly" : "Qty",
//         lastPassIssued: enquiry.lastPassIssued
//           ? formatDate(enquiry.lastPassIssued.toDate())
//           : "",
//         address: enquiry.address,
//       };

//       westernWorksheet.addRow(rowData);
//       westernIndex++;
//     });

//     enquiries.centralEnquiries.forEach((enquiry, index) => {
//       const formatDate = (date: Date) => {
//         const d = new Date(date);
//         const year = d.getFullYear().toString().substr(-2); // Get last 2 digits of the year
//         const month = String(d.getMonth() + 1).padStart(2, "0");
//         const day = String(d.getDate()).padStart(2, "0");
//         return `${day}/${month}/${year}`;
//       };

//       const rowData = {
//         srno: index + 1,
//         passNum: enquiry.passNum,
//         name: `${enquiry.lastName} ${enquiry.firstName} ${enquiry.middleName}`,
//         gender: enquiry.gender === "Male" ? "M" : "F",
//         dob: formatDate(enquiry.dob.toDate()),
//         from: enquiry.from,
//         to: enquiry.to,
//         class: enquiry.class,
//         mode: enquiry.duration === "Monthly" ? "Mly" : "Qty",
//         lastPassIssued: enquiry.lastPassIssued
//           ? formatDate(enquiry.lastPassIssued.toDate())
//           : "",
//         address: enquiry.address,
//       };

//       centralWorksheet.addRow(rowData);
//       centralIndex++;
//     });

//     // enquiries.forEach((enquiry, index) => {
//     //   const formatDate = (date: Date) => {
//     //     const d = new Date(date);
//     //     const year = d.getFullYear().toString().substr(-2); // Get last 2 digits of the year
//     //     const month = String(d.getMonth() + 1).padStart(2, '0');
//     //     const day = String(d.getDate()).padStart(2, '0');
//     //     return `${day}/${month}/${year}`;
//     //   };

//     //   const rowData = {
//     //     srno: index + 1,
//     //     passNum: enquiry.passNum,
//     //     name: `${enquiry.lastName} ${enquiry.firstName} ${enquiry.middleName}`,
//     //     gender: enquiry.gender === 'Male' ? 'M' : 'F',
//     //     dob: formatDate(enquiry.dob.toDate()),
//     //     from: enquiry.from,
//     //     to: enquiry.to,
//     //     class: enquiry.class,
//     //     mode: enquiry.duration === 'Monthly' ? 'Mly' : 'Qty',
//     //     lastPassIssued: enquiry.lastPassIssued ? formatDate(enquiry.lastPassIssued.toDate()) : "",
//     //     address: enquiry.address,
//     //   };

//     //   const travelLane = enquiry.travelLane.toLowerCase();
//     //   if (travelLane === 'harbor' || travelLane === 'western' || travelLane === 'harbour') {
//     //     westernWorksheet.addRow(rowData);
//     //     westernIndex++;
//     //   } else {
//     //     centralWorksheet.addRow(rowData);
//     //     centralIndex++;
//     //   }
//     // });

//     const buffer = await workbook.xlsx.writeBuffer();
//     return new Blob([buffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//   } catch (error) {
//     console.error("Error creating Excel file:", error);
//     return null;
//   }
// };

export const createExcelFile = async (
  batch: BatchElement
): Promise<Blob | null> => {
  // console.log(batch);
  try {

    let allPassNumInRange = listOfPassNum(batch.fileName)

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet();

    // Define the columns for the worksheet
    const columns = [
      { header: "Sr no", key: "srno", width: 4.725 },
      { header: "Certificate number", key: "passNum", width: 13.2 },
      { header: "Name", key: "name", width: 32.9125 },
      { header: "M/F", key: "gender", width: 3.2 },
      { header: "Date of Birth", key: "dob", width: 11.95 },
      { header: "From", key: "from", width: 13.475 },
      { header: "To", key: "to", width: 13.475 },
      { header: "Class I/II", key: "class", width: 7.3625 },
      { header: "Mode M / Q", key: "mode", width: 7.3625 },
      { header: "Date of Issue", key: "lastPassIssued", width: 11.95 },
      { header: "Address", key: "address", width: 48.2 },
    ];

    worksheet.columns = columns;

    // Set row height and margins
    worksheet.properties.defaultRowHeight = 39.375;
    worksheet.pageSetup.margins = {
      top: 0.3,
      left: 0.5,
      right: 0.0,
      bottom: 0.0,
      header: 0.0,
      footer: 0.0,
    };

    // Title row
    worksheet.mergeCells("A1:K1");
    worksheet.getCell("A1").value = "Thadomal Shahani Engineering College";
    worksheet.getCell("A1").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getRow(1).height = 32.25;
    worksheet.getCell("A1").font = { size: 20, bold: true };

    // Subheading row
    worksheet.mergeCells("A2:K2");
    worksheet.getCell(
      "A2"
    ).value = `Railway Concession for ${batch.lane} Railway`;
    worksheet.getCell("A2").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getRow(2).height = 22.5;
    worksheet.getCell("A2").font = { size: 14, bold: true };
    
    const applyBorders = (row: ExcelJS.Row) => {
      row.eachCell((cell: ExcelJS.Cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    };
    applyBorders(worksheet.getRow(1));
    applyBorders(worksheet.getRow(2));

    worksheet.columns.forEach((column) => {
      column.style = { font: { size: 12 } };
    });


    // Add the header row and apply bold font style
    const headerRow = worksheet.addRow(columns.map((col) => col.header));
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, size: 12 };
      cell.alignment = { wrapText: true, vertical:"middle", horizontal: "center" };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
    headerRow.height = 36;
    
    // Add the data rows to the worksheet
    batch.enquiries.forEach((enquiry, index) => {

      const toDate = (value: string | { toDate: () => Date }) => {
        return typeof value === "string" ? new Date(value) : value.toDate();
      };

      const formatDate = (date: Date) => {
        const d = new Date(date);
        const year = d.getFullYear().toString().substr(-2);
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${day}/${month}/${year}`;
      };



      // Insert the "Thadomal Shahani Engineering College" row after every 20 entries
      if (index > 0 && index % 20 === 0) {
        const row = worksheet.addRow([]);
        worksheet.mergeCells(`A${row.number}:K${row.number}`);
        worksheet.getCell(`A${row.number}`).value = "Thadomal Shahani Engineering College";
        worksheet.getCell(`A${row.number}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        worksheet.getRow(row.number).height = 32.25;
        worksheet.getCell(`A${row.number}`).font = { size: 20, bold: true };

        // Subheading row
        worksheet.mergeCells(`A${row.number+1}:K${row.number+1}`);
        worksheet.getCell(
          `A${row.number+1}`
        ).value = `Railway Concession for ${batch.lane} Railway`;
        worksheet.getCell(`A${row.number+1}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        worksheet.getRow(2).height = 22.5;
        worksheet.getCell(`A${row.number+1}`).font = { size: 14, bold: true };

        const applyBorders = (row: ExcelJS.Row) => {
          row.eachCell((cell: ExcelJS.Cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });
        };
        applyBorders(worksheet.getRow(row.number));
        applyBorders(worksheet.getRow(row.number+1));

      }

      if (enquiry.status === 'cancelled') {
        const row = worksheet.addRow({
          srno: index + 1,
          passNum: enquiry.passNum,
          name: '',
          gender: '',
          dob: '',
          from: '',
          to: '',
          class: '',
          mode: '',
          lastPassIssued: '',
          address: '',
        });
        worksheet.mergeCells(`C${row.number}:K${row.number}`);
        worksheet.getCell(`C${row.number}`).value = '----------------------------------------------------------------------------------------------------C-A-N-C-E-L-L-E-D----------------------------------------------------------------------------------------------------';
        worksheet.getRow(row.number).alignment = { horizontal: 'center', vertical: 'middle'};
        worksheet.getRow(row.number).height = 39.375;

        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });

        // Removing PassNum which are found in db so that end me sir ko jo pass nhi mile nhi we can offer that.
        if ((allPassNumInRange.indexOf(enquiry.passNum))!== -1){
          allPassNumInRange.splice((allPassNumInRange.indexOf(enquiry.passNum)),1)
        } 

      } else {
        const rowData = {
          srno: index + 1,
          passNum: enquiry.passNum,
          name: `${enquiry.lastName.toUpperCase()} ${enquiry.firstName.toUpperCase()} ${enquiry.middleName.toUpperCase()}`,
          gender: enquiry.gender === "Male" ? "M" : "F",
          dob: formatDate(toDate(enquiry.dob)),
          from: enquiry.from.toUpperCase(),
          to: enquiry.to.toUpperCase(),
          class: enquiry.class,
          mode: enquiry.duration === "Monthly" ? "Mly" : "Qty",
          lastPassIssued: enquiry.lastPassIssued
            ? formatDate(toDate(enquiry.lastPassIssued))
            : "",
          address: enquiry.address.toUpperCase(),
        };
        const row = worksheet.addRow(rowData);

        // Removing PassNum which are found in db so that end me sir ko jo pass nhi mile nhi we can offer that.
        if ((allPassNumInRange.indexOf(enquiry.passNum))!== -1){
          allPassNumInRange.splice((allPassNumInRange.indexOf(enquiry.passNum)),1)
        } 

        // Default Worksheet Styling
        worksheet.getRow(row.number).alignment = { horizontal: 'center', vertical: "top", wrapText: true};

        // Styliing for Name and Address
        worksheet.getCell(`C${row.number}`).alignment = { horizontal: 'left', vertical: "top", wrapText: true };
        worksheet.getCell(`K${row.number}`).alignment = { horizontal: 'left', vertical: 'top', wrapText: true };

        worksheet.getRow(row.number).height = 39.375;

        // Address Font Size
        worksheet.getCell(`K${row.number}`).font = { size: 10 };

        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }
    });

    // Store the Lapata Pass Numbers
    const array = allPassNumInRange.join(", ");
    const newRow = worksheet.addRow([]);
    newRow.getCell("A").value = array;

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
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