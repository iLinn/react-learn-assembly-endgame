export function getFarewellText(languages: string[]): string {
  const language = languages?.length > 1 ? languages.join(' & ') : languages[0];

  const options = [
      `Farewell, ${language}`,
      `Adios, ${language}`,
      `R.I.P., ${language}`,
      `We'll miss you, ${language}`,
      `Oh no, not ${language}!`,
      `${language} bites the dust`,
      `Gone but not forgotten, ${language}`,
      `The end of ${language} as we know it`,
      `Off into the sunset, ${language}`,
      `${language}, it's been real`,
      `${language}, your watch has ended`,
      `${language} has left the building`
  ];

  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}