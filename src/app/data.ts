export interface Profile {
  name: string;
  title: string;
  bio: string;
  img?: string;
  slug: string;
}

export const profiles: Profile[] = [
  {
    name: "Winnie Adoma",
    title: "Founder",
    slug: "winnie",
    bio: "Visionary leader dedicated to empowering women in business and fostering spiritual growth across communities",
    img: "/winnie.svg",
  },
  {
    name: "Hellen Ojwang",
    title: "Esteemed Member",
    slug: "hellen",
    bio: "An accomplished professional whose grace, wisdom, and service inspire many to pursue their calling with integrity",
    img: "/hellen.svg",
  },
  {
    name: "Madam Harriet",
    title: "Community Champion",
    slug: "harriet",
    bio: "A beacon of hope and encouragement whose generosity and faith have transformed countless lives",
    img: "/harriet.svg",
  },
];