import type { Team } from '@/types';

const adjectives = [
  'Fizzy', 'Icy', 'Smooth', 'Frosty', 'Bubbly', 'Tangy', 'Golden', 'Velvety', 'Bold',
  'Chilled', 'Zesty', 'Creamy', 'Sweet', 'Bitter', 'Smoky', 'Sparkling', 'Rich',
  'Refreshing', 'Lush', 'Crisp', 'Mellow', 'Deep', 'Cool', 'Dark', 'Syrupy', 'Frothy'
];

const beverages = [
  'Latte', 'Espresso', 'Matcha', 'Mocha', 'Cappuccino', 'Smoothie', 'Milkshake',
  'Lemonade', 'Soda', 'IcedTea', 'HotChocolate', 'Cola', 'Frappe', 'Boba', 
  'Kombucha', 'Punch', 'Chai', 'Americano', 'Brew', 'Tonic', 'Macchiato',
  'BubbleTea', 'GreenTea', 'HerbalTea', 'ChocoShake', 'ThaiTea',
  'AppleJuice', 'OrangeJuice', 'BerryBlend', 'VanillaFrappe', 'PeachTea'
];

export default function generateUniqueTitle(teams: Team[]) {
  let title: string;
  do {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomBeverage = beverages[Math.floor(Math.random() * beverages.length)];
    title = `${randomAdjective}-${randomBeverage}`;
  } while (teams.some(x => x.title === title)); // Ensure uniqueness

  return title;
}

