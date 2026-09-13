import luxuryResidence from "../assets/projects/luxury-residence.png";
import corporateOffice from "../assets/projects/coorporate-office.png";
import boutiqueHotel from "../assets/projects/boutique-hall.png";
import flagshipStore from "../assets/projects/flagship-store.png";

const projects = [
  {
    id: "luxury-residence",
    category: "Residential",
    name: "Luxury Residence",
    slug: "luxury-residence",
    description:
      "A refined residential space featuring premium epoxy surfaces.",
    image: luxuryResidence,
  },

  {
    id: "corporate-office",
    category: "Commercial",
    name: "Corporate Office",
    slug: "corporate-office",
    description:
      "Contemporary surfaces designed for a sophisticated corporate environment.",
    image: corporateOffice,
  },

  {
    id: "boutique-hall",
    category: "Hospitality",
    name: "Boutique Hotel",
    slug: "boutique-hotel",
    description:
      "Luxury flooring transforming hospitality spaces into memorable experiences.",
    image: boutiqueHotel,
  },

  {
    id: "flagship-store",
    category: "Retail",
    name: "Flagship Store",
    slug: "flagship-store",
    description:
      "A statement retail environment built around distinctive surfaces.",
    image: flagshipStore,
  },
];

export default projects;