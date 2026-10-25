// Academic curriculum data

const makeSubject = (name, code = "") => ({
  name,
  code,
  modules: [1, 2, 3, 4, 5].map((number) => ({
    number,
    title: `Module ${number}`,
  })),
});

const firstYear2018 = {
  1: [
    makeSubject("Mathematics-1 for CSE Stream", "BMATS101"),
    makeSubject("Applied Physics for CSE"),
  ],
  2: [
    makeSubject("Mathematics-2 for CSE Stream", "BMATS101"),
    makeSubject("Applied Chemistry for CSE"),
  ],
};

const commonCSESubjects2018 = {
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
  "2018": {
    "First Year": firstYear2018,

    CSE: commonCSESubjects2018,

    AIML: commonCSESubjects2018,

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

export default curriculum;