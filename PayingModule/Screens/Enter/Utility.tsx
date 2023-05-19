// utility.ts
export function calculateDriverLFee(
  liftingtotal: number,
  eftposlifting: number,
  liftingdriver: number,
  numberofmanuallifting: number,
  totalmeter: number,
  hours: number,
) {
  let a = numberofmanuallifting;
  let b = eftposlifting / liftingtotal;
  let c = liftingdriver;
  let driverLFee = (a + b) * c;

  let fare: number;
  if (hours > 0) {
    fare = totalmeter / hours;
  } else {
    fare = 0;
  }

  return {
    driverLFee,
    fare,
  };
}

// utility.ts
export function calculatePaidKm(
  paidkm1: number,
  paidkm2: number,
  totalmeter: number,
  drivercommrate: number,
  companycommrate: number,
  resultkm: number,
  cpk: number,
) {
  let resultPaidKm = paidkm2 - paidkm1;
  let commissionDriver = totalmeter * (drivercommrate / 100);
  let commissionGtn = totalmeter * (companycommrate / 100);
  let newCpk: number;

  if (resultkm > 0) {
    newCpk = totalmeter / resultkm;
  } else {
    newCpk = cpk;
  }

  return {
    resultPaidKm,
    commissionDriver,
    commissionGtn,
    newCpk,
  };
}

// utility.ts
export function calculateGtnLFee(
  numberofmanuallifting: number,
  eftposlifting: number,
  liftingtotal: number,
  liftingcompany: number,
): number {
  let a = numberofmanuallifting;
  let b = eftposlifting / liftingtotal;
  let c = liftingcompany;
  let newGtnLFee: number;

  if (liftingtotal > 0) {
    newGtnLFee = (a + b) * c;
  } else {
    newGtnLFee = 0;
  }

  return newGtnLFee;
}

export function calculateNumberofChairs(
  numberofmanuallifting: number,
  eftposlifting: number,
  liftingtotal: number,
  liftingcompany: number,
): [number, number] {
  let a = numberofmanuallifting;
  let b = eftposlifting / liftingtotal;
  let numberOfChairs: number;
  let gtnLFee: number;

  if (liftingtotal > 0) {
    numberOfChairs = a + b;
  } else {
    numberOfChairs = 0;
  }

  gtnLFee = calculateGtnLFee(
    numberofmanuallifting,
    eftposlifting,
    liftingtotal,
    liftingcompany,
  );
  return [numberOfChairs, gtnLFee];
}
