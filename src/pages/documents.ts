export const DOCUMENT_TYPES = [
  "byLaws",
  "minutes",
  "policies",
  "corporate",
] as const;

export const DOCUMENTS = {
  byLaws: [
    { name: "By-laws", id: "by-laws" },
    { name: "By-laws (v1.0)", id: "by-laws-v1.0" },
    { name: "By-laws (v1.1)", id: "by-laws-v1.1" },
  ],
  minutes: [
    {
      name: "First Members' Meeting May 7, 2022",
      id: "first-members-meeting-may-7-2022",
    },
    {
      name: "Directors' Meeting April 9, 2022",
      id: "directors-meeting-apr-9-2022",
    },
    {
      name: "First Directors' Meeting February 26, 2022",
      id: "first-directors-meeting-feb-26-2022",
    },
  ],
  policies: [
    {
      name: "Speedcubing Canada Reimbursement Policy",
      id: "reimbursement-policy",
    },
    {
      name: "Speedcubing Canada Reimbursement Policy (v1.0)",
      id: "reimbursement-policy-v1.0",
    },
  ],
  corporate: [
    {
      name: "Certificate of Incorporation",
      id: "certificate-of-incorporation",
    },
  ],
} as const;
