export interface Member {
  name: string;
  role: string;
  image: string;
  linkedin: string;
}

export interface TeamSection {
  title: string;
  members: Member[];
}

export const teamData: TeamSection[] = [
  {
    title: "Principal",
    members: [
      {
        name: "Dr. G. T. Thampi",
        role: "Principal",
        image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Fgt_thampi.jpg?alt=media&token=a99a5fdc-3e17-41e9-8043-affe6fa00873",
        linkedin: "https://www.linkedin.com/in/gopakumaran-thampi-79680727?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
    ],
  },
  {
    title: "Professors Incharge",
    members: [
      {
        name: "Prof. Darakshan Khan",
        role: "Professor Incharge",
        image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Fdk_maam.jpg?alt=media&token=32d36076-687f-4dd7-beec-645a0035ef22",
        linkedin: "https://www.linkedin.com/in/darakshan-khan-2166132a4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
      {
        name: "Dr. Sachi Natu",
        role: "Professor Incharge",
        image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Fsachimam.png?alt=media&token=1f41d84a-0627-4373-b20e-c5424306fcb9",
        linkedin: "https://www.linkedin.com/in/dr-shachi-natu-b796892?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
    ],
  },
  {
    title: "Chairperson",
    members: [
      {
        name: "Fahed Khan",
        role: "Chairperson",
        image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Ffahed.png?alt=media&token=45721059-7939-4be2-acdf-a4c15150a30e",
        linkedin: "https://www.linkedin.com/in/fahed-khan-13b11025b",
      },
    ],
  },
  {
    title: "Vice Chairperson",
    members: [
      {
        name: "Atharva Khewle",
        role: "Vice Chairperson",
        image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Fatharva.png?alt=media&token=ababa798-5f3c-4e4e-bb17-c1a2b108f51b",
        linkedin: "https://www.linkedin.com/in/atharvakhewle",
      },
    ],
  },
  {
    title: "Web Team",
    members: [
      {
        name: "Ritojnan Mukherjee",
        role: "Web Team Head",
        image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Fritojnan.jpeg?alt=media&token=5c08bd18-b645-4175-992f-2c66f728f9e6",
        linkedin: "https://www.linkedin.com/in/ritojnanmukherjee/",
      },
      {
        name: "Anish Awasthi",
        role: "Web Developer",
        image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FAnish.jpeg?alt=media&token=aa0c7f5c-248b-4f32-94f2-f01f8d911326",
        linkedin: "https://linkedin.com/in/anish-awasthi-213106287",
      },
      {
        name: "Mayuresh Chavan",
        role: "Web Developer",
        image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FMayuresh.jpg?alt=media&token=c5668236-d83a-451e-a796-05248301795a",
        linkedin: "https://www.linkedin.com/in/mayuresh-chavan-04a3b5259/",
      },
      {
        name: "Juhi Deore",
        role: "Web Developer",
        image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FJuhi.jpg?alt=media&token=33b59920-a019-458e-a925-4cfda021d74a",
        linkedin: "https://www.linkedin.com/in/juhideore/",
      },
      {
        name: "Jash Rashne",
        role: "Web Developer",
        image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FJash.JPG?alt=media&token=9bdc90ec-805b-46af-a9ce-43d0a66b4b66",
        linkedin: "https://www.linkedin.com/in/jashrashne",
      },
    ],
  },
  {
    title: "Operations Team",
    members: [
      {
        name: "Zoya Hassan",
        role: "Operations Manager",
        image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FZoya.jpeg?alt=media&token=6854ba68-af9b-44c2-903f-61596e690252",
        linkedin: "https://www.linkedin.com/in/zoya-hassan-688470271/",
      },
      {
        name: "Herambh Vengurlekar",
        role: "Project Coordinator",
        image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Fheramb.JPG?alt=media&token=e2c743ca-e812-4a43-a4ec-4bef248aa604",
        linkedin: "http://www.linkedin.com/in/herambve",
      },
      {
        name: "Suhani Poptani",
        role: "Operations Analyst",
        image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FSuhani.jpeg?alt=media&token=eeccf450-3d90-4c01-bdd6-f19c5c6700fc",
        linkedin: "",
      },
    ],
  },
  {
    title: "App Development Team",
    members: [
      {
        name: "Zeeshan Sayed",
        role: "App Team Head",
        image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Fzeeshan.png?alt=media&token=4789696e-955a-4ba0-9738-eec09aebf1fc",
        linkedin: "https://www.linkedin.com/in/zeeshan-hyder-sayed-63324b292",
      },
      {
        name: "Aryan Pathak",
        role: "Mobile App Developer",
        image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FAryan.jpg?alt=media&token=c58aa850-6ff0-4597-8d50-886cd09ddf70",
        linkedin: "https://www.linkedin.com/in/aryan-pathak-67a39b290",
      },
      {
        name: "Shreya Bhatia",
        role: "UI/UX Designer",
        image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FShreya.jpg?alt=media&token=d5a5410a-6a13-4d3c-98cd-c757df659b4c",
        linkedin: "http://www.linkedin.com/in/shreya-bhatia-6364ab2bb",
      },
      {
        name: "Siddhi Mehta",
        role: "App Tester",
        image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FSiddhi.png?alt=media&token=5552fe08-ca67-4e88-840b-b305eefb6d1c",
        linkedin: "https://www.linkedin.com/in/siddhi-mehta-228048298/",
      },
    ],
  },
  {
    title: "Design Team",
    members: [
      {
        name: "Kashish Dodeja",
        role: "Graphic Designer",
        image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2Fkashish.JPG?alt=media&token=3e71f52b-b06f-4e65-89ba-d49569fd76d3",
        linkedin: "https://www.linkedin.com/in/kashishdodeja?trk=contact-info",
      },
      {
        name: "Malhaar Mirchandani",
        role: "UI/UX Designer",
        image: "https://firebasestorage.googleapis.com/v0/b/tsec-app.appspot.com/o/DevsMember%2F2024%2FMalhaar.jpg?alt=media&token=15ac7778-63a8-4529-85ff-13cc5916ba29",
        linkedin: "https://www.linkedin.com/in/malhaar-mirchandani-a8188b287",
      },
    ],
  },
];

