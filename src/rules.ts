export let essler = (await fetch("/static/essler.yaml")).text;

export let frege = `
- rule:
    antecedent:
      - (A -> B)
      - (A)
    consequent: (B)
  name: MP \n \

- rule:
    antecedent:
      - (A)
    consequent: (AvB)
  name: vE

- rule:
    antecedent:
      - (A)
      - (B)
    consequent: (A^B)
  name: ^E
`;

export let gentzen = `
- rule:
    antecedent:
      - (A -> B)
      - (A)
    consequent: (B)
  name: MP \n \

- rule:
    antecedent:
      - (A)
    consequent: (AvB)
  name: vE

- rule:
    antecedent:
      - (A)
      - (B)
    consequent: (A^B)
  name: ^E
`;
