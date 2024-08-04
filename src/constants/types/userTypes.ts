import { Timestamp } from "firebase/firestore";

export const userTypes = {
    ADMIN: "admin",
    HOD: "hod",
    COMMITTEE: "committee",
    STUDENT: "student",
    PRINCIPAL: "principal",
    RAILWAY: "railway",
    PROFESSOR: "professor",
  };


  export interface Enquiry {
    id: string;
    address: string;
    ageMonths: number;
    ageYears: number;
    branch: string;
    class: string;
    dob: Timestamp;
    duration: string;
    firstName: string;
    from: string;
    gender: string;
    gradyear: string;
    idCardURL: string;
    lastName: string;
    lastPassIssued: Timestamp;
    middleName: string;
    passNum: string;
    phoneNum: number;
    previousPassURL: string;
    status: string;
    statusMessage: string;
    to: string;
    travelLane: string;
  }