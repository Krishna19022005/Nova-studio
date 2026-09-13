import image3D1 from "../assets/products/3D1.png";
import image3D2 from "../assets/products/3D2.png";

import industrial1 from "../assets/products/Industrial1.png";
import industrial2 from "../assets/products/Industrial2.png";
import industrial3 from "../assets/products/Industrial3.png";

import itallic1 from "../assets/products/Itallic1.png";
import itallic2 from "../assets/products/Itallic2.png";
import itallic3 from "../assets/products/Itallic3.png";

import metallic1 from "../assets/products/metallic1.png";
import metallic2 from "../assets/products/metallic2.png";
import metallic3 from "../assets/products/metallic3.png";
import metallic4 from "../assets/products/metallic4.png";

const products = [

  /* =========================================================
     3D COLLECTION
  ========================================================= */

  {
    id: "dimension-flow",
    collection: "3d",
    name: "Dimension Flow",
    code: "3D-001",
    slug: "dimension-flow",

    subtitle: "Depth. Movement. Visual impact.",

    description:
      "A dimensional surface designed to create depth and movement, bringing a dramatic architectural character to contemporary spaces.",

    image: image3D1,
    gallery: [image3D1],

    specs: {
      colour: "Customizable",
      finish: "Gloss / Satin",
      texture: "3D Textured Surface",
      application:
        "Residential | Commercial | Hospitality | Retail",
      thickness: "3mm – 8mm (Customizable)",
      maintenance: "Low Maintenance, Easy to Clean",
      customization:
        "Available (Colour, Texture, Pattern)",
    },

    finish: "Gloss",
    colour: "Custom",
    space: "Residential",
  },

  {
    id: "abstract-depth",
    collection: "3d",
    name: "Abstract Depth",
    code: "3D-002",
    slug: "abstract-depth",

    subtitle: "Sculpted surfaces. Modern expression.",

    description:
      "A sculptural 3D finish combining texture, shadow and form to create a distinctive surface experience.",

    image: image3D2,
    gallery: [image3D2],

    specs: {
      colour: "Customizable",
      finish: "Matte / Satin",
      texture: "Sculpted 3D Pattern",
      application:
        "Commercial | Hospitality | Retail",
      thickness: "3mm – 8mm",
      maintenance: "Low Maintenance",
      customization:
        "Available (Colour, Pattern, Texture)",
    },

    finish: "Matte",
    colour: "Custom",
    space: "Commercial",
  },


  /* =========================================================
     INDUSTRIAL COLLECTION
  ========================================================= */

  {
    id: "urban-forge",
    collection: "industrial",
    name: "Urban Forge",
    code: "IND-001",
    slug: "urban-forge",

    subtitle: "Raw character. Refined performance.",

    description:
      "A strong industrial surface inspired by concrete, metal and architectural structures, designed for bold contemporary environments.",

    image: industrial1,
    gallery: [industrial1],

    specs: {
      colour: "Charcoal / Grey",
      finish: "Matte",
      texture: "Raw Industrial",
      application:
        "Commercial | Retail | Office",
      thickness: "3mm – 6mm",
      maintenance: "Low Maintenance",
      customization:
        "Available (Colour, Texture)",
    },

    finish: "Matte",
    colour: "Grey",
    space: "Commercial",
  },

  {
    id: "concrete-line",
    collection: "industrial",
    name: "Concrete Line",
    code: "IND-002",
    slug: "concrete-line",

    subtitle: "Minimal structure. Industrial soul.",

    description:
      "A sophisticated industrial finish inspired by architectural concrete, creating a clean and powerful visual foundation.",

    image: industrial2,
    gallery: [industrial2],

    specs: {
      colour: "Concrete Grey",
      finish: "Matte",
      texture: "Concrete Effect",
      application:
        "Office | Retail | Commercial | Residential",
      thickness: "3mm – 6mm",
      maintenance: "Easy to Clean",
      customization:
        "Available (Tone, Texture)",
    },

    finish: "Matte",
    colour: "Grey",
    space: "Office",
  },

  {
    id: "iron-grid",
    collection: "industrial",
    name: "Iron Grid",
    code: "IND-003",
    slug: "iron-grid",

    subtitle: "Structured. Bold. Architectural.",

    description:
      "A darker industrial surface combining metallic depth and structured movement for modern commercial spaces.",

    image: industrial3,
    gallery: [industrial3],

    specs: {
      colour: "Dark Grey / Charcoal",
      finish: "Satin",
      texture: "Industrial Mineral",
      application:
        "Commercial | Retail | Hospitality",
      thickness: "3mm – 6mm",
      maintenance: "Low Maintenance",
      customization:
        "Available",
    },

    finish: "Satin",
    colour: "Charcoal",
    space: "Retail",
  },


  /* =========================================================
     ITALLIC COLLECTION
  ========================================================= */

  {
    id: "venetian-mist",
    collection: "italian",
    name: "Venetian Mist",
    code: "IT-001",
    slug: "venetian-mist",

    subtitle: "Italian elegance. Soft movement.",

    description:
      "A refined Italian-inspired surface featuring subtle tonal variation and elegant movement for sophisticated interiors.",

    image: itallic1,
    gallery: [itallic1],

    specs: {
      colour: "Warm Ivory",
      finish: "Satin",
      texture: "Soft Mineral",
      application:
        "Residential | Hospitality | Retail",
      thickness: "2mm – 5mm",
      maintenance: "Low Maintenance",
      customization:
        "Available (Colour, Finish)",
    },

    finish: "Satin",
    colour: "Ivory",
    space: "Residential",
  },

  {
    id: "marble-atelier",
    collection: "italian",
    name: "Marble Atelier",
    code: "IT-002",
    slug: "marble-atelier",

    subtitle: "Classic stone. Contemporary refinement.",

    description:
      "Inspired by the timeless character of Italian stone, Marble Atelier creates a refined and luxurious surface language.",

    image: itallic2,
    gallery: [itallic2],

    specs: {
      colour: "Cream / Natural Stone",
      finish: "High Gloss",
      texture: "Marble Veining",
      application:
        "Residential | Hospitality | Luxury Retail",
      thickness: "2mm – 5mm",
      maintenance: "Easy to Clean",
      customization:
        "Available (Veining, Colour, Finish)",
    },

    finish: "Gloss",
    colour: "Cream",
    space: "Hospitality",
  },

  {
    id: "tuscan-stone",
    collection: "italian",
    name: "Tuscan Stone",
    code: "IT-003",
    slug: "tuscan-stone",

    subtitle: "Warm tones. Timeless character.",

    description:
      "A warm Italian-inspired finish balancing natural texture and sophisticated tonal depth for enduring spaces.",

    image: itallic3,
    gallery: [itallic3],

    specs: {
      colour: "Beige / Sand",
      finish: "Matte / Satin",
      texture: "Natural Stone",
      application:
        "Residential | Hospitality | Commercial",
      thickness: "2mm – 5mm",
      maintenance: "Low Maintenance",
      customization:
        "Available",
    },

    finish: "Satin",
    colour: "Beige",
    space: "Hospitality",
  },


  /* =========================================================
     METALLIC COLLECTION
  ========================================================= */

  {
    id: "obsidian-veil",
    collection: "metallic",
    name: "Obsidian Veil",
    code: "MC-001",
    slug: "obsidian-veil",

    subtitle: "Liquid movement. Timeless impact.",

    description:
      "A bold fusion of depth and elegance, Obsidian Veil captures the mystique of natural stone with the fluidity of epoxy, creating a surface that transforms any space into a statement.",

    image: metallic1,
    gallery: [metallic1],

    specs: {
      colour: "Black / Bronze",
      finish: "High Gloss / Matte (Customizable)",
      texture: "Fluid, Natural Veining",
      application:
        "Residential | Commercial | Hospitality | Retail",
      thickness: "2mm – 5mm (Customizable)",
      maintenance: "Low Maintenance, Easy to Clean",
      customization:
        "Available (Colour, Finish, Pattern)",
    },

    finish: "Gloss",
    colour: "Black",
    space: "Residential",
  },

  {
    id: "bronze-flux",
    collection: "metallic",
    name: "Bronze Flux",
    code: "MC-002",
    slug: "bronze-flux",

    subtitle: "Warm depth. Refined movement.",

    description:
      "A rich metallic surface combining warm bronze movement with a sophisticated architectural character.",

    image: metallic2,
    gallery: [metallic2],

    specs: {
      colour: "Bronze",
      finish: "High Gloss / Matte (Customizable)",
      texture: "Metallic Movement",
      application:
        "Residential | Commercial | Hospitality",
      thickness: "2mm – 5mm (Customizable)",
      maintenance: "Low Maintenance, Easy to Clean",
      customization:
        "Available (Colour, Finish, Pattern)",
    },

    finish: "Gloss",
    colour: "Bronze",
    space: "Commercial",
  },

  {
    id: "champagne-mist",
    collection: "metallic",
    name: "Champagne Mist",
    code: "MC-003",
    slug: "champagne-mist",

    subtitle: "Soft luminosity. Quiet elegance.",

    description:
      "A refined champagne-toned surface designed to bring a soft sense of movement and understated luxury to interiors.",

    image: metallic3,
    gallery: [metallic3],

    specs: {
      colour: "Champagne",
      finish: "Satin / Matte",
      texture: "Soft Mineral Movement",
      application:
        "Residential | Hospitality",
      thickness: "2mm – 5mm (Customizable)",
      maintenance: "Low Maintenance, Easy to Clean",
      customization:
        "Available (Colour, Finish, Pattern)",
    },

    finish: "Satin",
    colour: "Champagne",
    space: "Residential",
  },

  {
    id: "shadow-river",
    collection: "metallic",
    name: "Shadow River",
    code: "MC-004",
    slug: "shadow-river",

    subtitle: "Dark movement. Modern expression.",

    description:
      "A deep charcoal surface with subtle flowing movement for sophisticated contemporary environments.",

    image: metallic4,
    gallery: [metallic4],

    specs: {
      colour: "Charcoal",
      finish: "Matte",
      texture: "Deep Mineral Movement",
      application:
        "Commercial | Retail",
      thickness: "2mm – 5mm",
      maintenance: "Low Maintenance, Easy to Clean",
      customization: "Available",
    },

    finish: "Matte",
    colour: "Charcoal",
    space: "Commercial",
  },
];

export default products;