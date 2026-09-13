import metallicImage from "../assets/collections/metallic.png";
import italianImage from "../assets/collections/itallian.png";
import threeDImage from "../assets/collections/3D.png";
import industrialImage from "../assets/collections/industrial.png";

const collections = [
  {
    id: "metallic",
    number: "01",
    name: "Metallic",
    slug: "metallic",
    tagline: "Fluid designs. Bold expressions.",
    description:
      "A sophisticated range of metallic epoxy surfaces designed to create depth, movement and character.",
    image: metallicImage,
  },

  {
    id: "italian",
    number: "02",
    name: "Italian",
    slug: "italian",
    tagline: "Timeless elegance. Modern spaces.",
    description:
      "Elegant Italian-inspired surfaces combining refined movement with contemporary luxury.",
    image: italianImage,
  },

  {
    id: "3d",
    number: "03",
    name: "3D",
    slug: "3d",
    tagline: "Depth that transforms.",
    description:
      "Three-dimensional surface effects that create depth and visual movement.",
    image: threeDImage,
  },

  {
    id: "industrial",
    number: "04",
    name: "Industrial",
    slug: "industrial",
    tagline: "Strength meets sophistication.",
    description:
      "Bold industrial finishes built for contemporary commercial and architectural spaces.",
    image: industrialImage,
  },
];

export default collections;