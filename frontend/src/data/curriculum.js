// Academic curriculum data

const makeSubject = (name, code = "") => ({
  name,
  code,
  modules: [1, 2, 3, 4, 5].map((number) => ({
    number,
    title: `Module ${number}`,
  })),
});

const firstYear2022 = {
  1: [
    makeSubject("Mathematics-1 for CSE Stream", "BMATS101"),
    makeSubject("Applied Physics for CSE"),
  ],
  2: [
    makeSubject("Mathematics-2 for CSE Stream", "BMATS201"),
    makeSubject("Applied Chemistry for CSE"),
  ],
};

const commonCSESubjects2022 = {
  3: [
    makeSubject("Mathematics for CSE"),
    makeSubject("Operating System"),
  ],
  4: [
    makeSubject("ADA"),
    makeSubject("MC"),
  ],
  5: [
    makeSubject("CN"),
    makeSubject("SEPM"),
  ],
  6: [
    makeSubject("ML"),
    makeSubject("Cloud Computing"),
  ],
  7: [
    makeSubject("IOT"),
  ],
};

const curriculum = {
  "2022": {
    "First Year": firstYear2022,

    CSE: {
      3: [makeSubject("Mathematics for Computer Science","BCS301"),makeSubject("Digital Design & Computer Organization","BCS302"),makeSubject("Operating Systems","BCS303"),makeSubject("Data Structures and Applications","BCS304"),makeSubject("Object Oriented Programming with JAVA","BCS306-A"),makeSubject("Yoga","BYOK359"),makeSubject("Data Structures Lab","BCSL305"),makeSubject("Social Connect and Responsibility","BSCK307")],
      4: [makeSubject("Analysis & Design of Algorithms","BCS401"),makeSubject("Microcontrollers","BCS402"),makeSubject("Database Management Systems","BCS403"),makeSubject("Discrete Mathematical Structures","BCS405A"),makeSubject("Technical writing using latex","BCSL456D"),makeSubject("Biology for Computer Engineers","BBOC407"),makeSubject("Analysis & Design of Algorithms Lab","BCSL404"),makeSubject("Universal Human Values Course","BUHK408"),makeSubject("Universal Human Values Course","BUHK408"),makeSubject("NSS","BYOK459")],
      5: [makeSubject("Computer Networks","BCS502"),makeSubject("Software Engineering & Project Management","BCS501"),makeSubject("Theory of Computation","BCS503"),makeSubject("Unix System Programming","BCS515C"),makeSubject("Research Methodology and IPR","BRMK557"),makeSubject("Environmental Studies and E-waste Management","BCS508"),makeSubject("Web Technology Lab","BCSL504"),makeSubject("Yoga","BYOK559")],  
      6: [makeSubject("VLSI Design and Testing")],
      7: [makeSubject("Computer Networks and Protocols")],
    },

    AIML:{
      3: [makeSubject("Mathematics for Computer Science","BCS301"),makeSubject("Digital Design & Computer Organization","BCS302"),makeSubject("Operating Systems","BCS303"),makeSubject("Data Structures and Applications","BCS304"),makeSubject("Object Oriented Programming with JAVA","BCS306-A"),makeSubject("Yoga","BYOK359")],
      4: [makeSubject("Analysis & Design of Algorithms","BCS401"),makeSubject("Microcontrollers","BCS402"),makeSubject("Database Management Systems","BCS403"),makeSubject("Discrete Mathematical Structures","BCS405A"),makeSubject("Technical writing using latex","BCSL456D"),makeSubject("Biology for Computer Engineers","BBOC407"),makeSubject("Analysis & Design of Algorithms Lab","BCSL404"),makeSubject("Universal Human Values Course","BUHK408"),makeSubject("Universal Human Values Course","BUHK408"),makeSubject("NSS","BYOK459")],
      5: [makeSubject("Computer Networks","BCS502"),makeSubject("Software Engineering & Project Management","BCS501"),makeSubject("Theory of Computation","BCS503"),makeSubject("Unix System Programming","BCS515C"),makeSubject("Research Methodology and IPR","BRMK557"),makeSubject("Environmental Studies and E-waste Management","BCS508"),makeSubject("Data Visualization Lab","BAIL504"),makeSubject("Yoga","BYOK559")],  
      6: [makeSubject("VLSI Design and Testing")],
      7: [makeSubject("Computer Networks and Protocols")],
    },

    ECE: {
      3: [makeSubject("Digital System Design using Verilog")],
      4: [makeSubject("Principles of Communication Systems")],
      5: [makeSubject("Digital Signal Processing")],
      6: [makeSubject("VLSI Design and Testing")],
      7: [makeSubject("Computer Networks and Protocols")],
    },

    Civil: {
      3: [makeSubject("Engineering Survey")],
      4: [makeSubject("Fluid Mechanics and Hydraulics")],
      5: [makeSubject("Geotechnical Engineering")],
      6: [makeSubject("Irrigation Engineering and Hydraulic Structures")],
      7: [makeSubject("Design of Steel Structures")],
    },

    Mechanical: {
      3: [makeSubject("Material Science and Metallurgy")],
      4: [makeSubject("Fluid Mechanics")],
      5: [makeSubject("Turbomachines")],
      6: [makeSubject("Heat Transfer")],
      7: [makeSubject("Hydraulics and Pneumatics")],
    },
  },



  
  "2025": {
    "First Year": {
      1: [
        makeSubject("Differential Calculus and Linear Algebra: CV Stream"),
      ],
      2: [
        makeSubject("Quantum Physics and Applications (CSE Stream)"),
      ],
    },

    CSE: {
      3: [
        makeSubject("Differential Calculus and Linear Algebra: CV Stream"),
      ],
      4: [
        makeSubject("Quantum Physics and Applications (CSE Stream)"),
      ],
      5: [
        makeSubject("Differential Calculus and Linear Algebra: CV Stream"),
      ],
      6: [
        makeSubject("Quantum Physics and Applications (CSE Stream)"),
      ],
      7: [
        makeSubject("Differential Calculus and Linear Algebra: CV Stream"),
      ],
    },
  },
};

export const branches = [
  "First Year",
  "CSE",
  "AIML",
  "ECE",
  "Civil",
  "Mechanical",
];


export const getSubjects = (scheme, branch, semester) => {
  const branchMap = {
    "FIRST YEAR": "First Year",
    CSE: "CSE",
    AIML: "AIML",
    ECE: "ECE",
    CIVIL: "Civil",
    MECHANICAL: "Mechanical",
  };

  const normalizedBranch = branchMap[branch?.trim().toUpperCase()];

  if (!normalizedBranch || !curriculum[scheme]) {
    return [];
  }

  return curriculum[scheme][normalizedBranch]?.[Number(semester)] || [];
};


export default curriculum;