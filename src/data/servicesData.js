import massage1 from "../assets/massage1.png";
import massage2 from "../assets/massage2.png";
import massage3 from "../assets/massage3.png";
import massage4 from "../assets/massage5.png";
import kid from "../assets/Kid.png";
import vip from "../assets/vip.png";
import hair from "../assets/hair.png";
import candle from "../assets/candle.png";
import beard from "../assets/beard.png";


export const servicesData = {
  specialServices: {
    title: "Special Service",
    emoji: "💈",
    description: "Experience Luxury: Brighten up your special day with our exclusive VIP haircut service for grooms who deserve nothing but the best.",
    services: [
      {
        id: 1,
        nameKey: "services.groomsmaidName",
        price: "€59.99",
        image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&h=350&fit=crop",
        descriptionKey: "services.groomsmaidDesc"
      },
      {
        id: 2,
        nameKey: "services.groomClassicName",
        price: "€74.99",
        image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&h=350&fit=crop",
        descriptionKey: "services.groomClassicDesc"
      },
      {
        id: 3,
        nameKey: "services.groomPlusName",
        price: "€134.99",
        image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=350&fit=crop",
        descriptionKey: "services.groomPlusDesc"
      }
    ]
  },

  bodyMassage: {
    title: "Body Massage And Other Treatments",
    emoji: "💆‍♂️",
    description: "We also perform sports massages, deep tissue massages, head massage, pedicure, manicure, mini body hair washing massage, full body massage.",
    services: [
      {
        id: 4,
        nameKey: "services.facialName",
        price: "€9.99",
        image: massage1,
        descriptionKey: "services.facialDesc"
      },
      {
        id: 5,
        nameKey: "services.facialXName",
        price: "€14.99",
        image: massage2,
        descriptionKey: "services.facialXDesc"
      },
      {
        id: 6,
        nameKey: "services.massageName",
        price: "€14.99",
        image: massage3,
        descriptionKey: "services.massageDesc"
      },
      {
        id: 7,
        nameKey: "services.miniBodyMassageName",
        price: "€11.99",
        image: massage4,
        descriptionKey: "services.miniBodyMassageDesc"
      }
    ]
  },

  beardServices: {
    title: "Beard, Wax, Shaving Services",
    emoji: "🧔‍♂️",
    description: "Not only do we offer amazing haircuts and hair colors, but we also make sure that your beard, eyebrows, and neck are neat.",
    services: [
      {
        id: 8,
        nameKey: "services.beardDryShaveName",
        price: "€39.99",
        image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&h=350&fit=crop",
        descriptionKey: "services.beardDryShaveDesc"
      },
      {
        id: 9,
        nameKey: "services.earCandleWaxName",
        price: "€11.99",
        image: candle,
        descriptionKey: "services.earCandleWaxDesc"
      },
      {
        id: 10,
        nameKey: "services.beardProName",
        price: "€34.99",
        image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=500&h=350&fit=crop",
        descriptionKey: "services.beardProDesc"
      },
      {
        id: 11,
        nameKey: "services.beardName",
        price: "€24.99",
        image: beard,
        descriptionKey: "services.beardDesc"
      }
    ]
  },

  hairdressing: {
    title: "Hairdressing And Hair Coloring Services",
    emoji: "✂️",
    description: "We offer a variety of haircuts, bleaches and styles, professional haircuts and hair care products, one-tone hair color, highlighting tonic and corrective color.",
    services: [
      {
        id: 12,
        nameKey: "services.kidsHaircutName",
        price: "€24.99",
        image: kid,
        descriptionKey: "services.kidsHaircutDesc"
      },
      {
        id: 13,
        nameKey: "services.legendsVIPName",
        price: "€199.99",
        image: vip,
        descriptionKey: "services.legendsVIPDesc"
      },
      {
        id: 14,
        nameKey: "services.headShavingName",
        price: "€29.99",
        image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&h=350&fit=crop",
        descriptionKey: "services.headShavingDesc"
      },
      {
        id: 15,
        nameKey: "services.haircutProMaxxName",
        price: "€49.99",
        image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&h=350&fit=crop",
        descriptionKey: "services.haircutProMaxxDesc"
      },
      {
        id: 16,
        nameKey: "services.haircutProName",
        price: "€34.99",
        image: hair,
        descriptionKey: "services.haircutProDesc"
      },
      {
        id: 17,
        nameKey: "services.haircutName",
        price: "€24.99",
        image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&h=350&fit=crop",
        descriptionKey: "services.haircutDesc"
      }
    ]
  }
};
