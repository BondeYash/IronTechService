export const process = [
  {
    step: "01",
    title: "Enquiry & takeoff",
    body: "You send the contract drawings, specification and schedule. We read the set, list what is missing, and confirm the scope before quoting.",
    output: "Scope confirmation",
  },
  {
    step: "02",
    title: "Detailing estimate",
    body: "Hours, tonnage and a delivery calendar priced against your fabrication sequence — not a flat rate that ignores how the job is built.",
    output: "Estimate & schedule",
  },
  {
    step: "03",
    title: "Advanced bill of material",
    body: "The ABM is issued first so mill orders and long-lead material can be placed while detailing continues.",
    output: "ABM for procurement",
  },
  {
    step: "04",
    title: "3D model in SDS/2",
    body: "The frame is modelled member by member with connections applied, so clashes and misfits surface on screen instead of in the yard.",
    output: "Checked 3D model",
  },
  {
    step: "05",
    title: "Connection design & RFIs",
    body: "Connections are designed or tracked against the engineer's schedule, and every open question goes out as a numbered RFI with a log.",
    output: "Calculations & RFI log",
  },
  {
    step: "06",
    title: "Shop & erection drawings",
    body: "Fabrication drawings, erection plans, bolt and joist lists, deck layouts and gather drawings — checked by a second detailer before release.",
    output: "Approval & final sets",
  },
  {
    step: "07",
    title: "Fabrication data",
    body: "CNC, DXF and KISS files, Tekla EPM status transfers, Fabtrol and EJE exports and material summaries, matched to your shop's equipment.",
    output: "Machine-ready files",
  },
] as const;
