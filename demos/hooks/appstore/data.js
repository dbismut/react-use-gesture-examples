import faker from 'faker'

window.faker = faker

const generateText = () =>
  Array(12)
    .fill(1)
    .map(faker.lorem.paragraphs)
    .join(' ')

export default [
  {
    img: faker.image.transport(),
    category: `Cocktail`,
    title: `Tales from the White Hart`,
    text: generateText(),
  },
  {
    img: faker.image.transport(),
    category: `Restaurant`,
    title: `Rick's Café`,
    text: generateText(),
  },
  {
    img: faker.image.transport(),
    category: `Café`,
    title: `Callahan's Crosstime Saloon`,
    text: generateText(),
  },
  {
    img: faker.image.transport(),
    category: `Snack`,
    title: `Iceberg Lounge`,
    text: generateText(),
  },
  {
    img: faker.image.transport(),
    category: `Bar`,
    title: `The Draco Tavern`,
    text: generateText(),
  },
  {
    img: faker.image.transport(),
    category: `Sea food`,
    title: `The Queen Victoria`,
    text: generateText(),
  },
  {
    img: faker.image.transport(),
    category: `Dancing`,
    title: `Bada Bing`,
    text: generateText(),
  },
  {
    img: faker.image.transport(),
    category: `Diner`,
    title: `Rovers Return Inn`,
    text: generateText(),
  },
  {
    img: faker.image.transport(),
    category: `Fast food`,
    title: `The Slaughtered Lamb`,
    text: generateText(),
  },
  {
    img: faker.image.transport(),
    category: `Lounge`,
    title: `Last Chance Saloon`,
    text: generateText(),
  },
]
