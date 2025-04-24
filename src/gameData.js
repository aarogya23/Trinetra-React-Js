// gameData.js
import eafc from './assets/image/eafc.png';
import callofduty from './assets/image/modern1234.png';
import gta from './assets/image/gta5.png'
import screenshot1 from './assets/image/ea1.jpg';
import screenshot2 from './assets/image/ea2.jpg';
import screenshot3 from './assets/image/mo1.jpg';
import screenshot4 from './assets/image/mo2.jpg';
import pubg from './assets/image/pubg.png';
import screenshot5 from './assets/image/screenshotpubg.jpg';
import screenshot6 from './assets/image/screenshotpubg2.jpg';
import fifa14 from './assets/image/fifa 14.png';
import fifa15 from './assets/image/fifa15.jpg';
import fifa16 from './assets/image/fifa16.jpg';
import fifa18 from './assets/image/fifa 18.png';
import fifa17 from './assets/image/fifa17.png';
import deltaforce from './assets/image/deltaforce.jpg';
import dota2 from './assets/image/dota2.jpg';
import vdd from './assets/image/vdd.png';
import apex from './assets/image/apex.png';
const games = {
  spotlight: [
    { name: "EA FC 24", 
      price: "Rs2400", 
      image: eafc,
      developer: "Ea Sport",
      releaseDate: "November 9, 2024",
      about: "Ea fC 24 is a football game develop by ea sport that focuses on team-based tactical gameplay.",
      screenshot1 : screenshot1,
      screenshot2 :  screenshot2,
    },
    { name: "Call of Duty MW3",
      price: "Rs1999", 
      image: callofduty,
      developer: "Activision",
      releaseDate: "November 9, 2019",
      about: "Call of duty MW3 is story and online based game develop by ActiveVisison that focuses on story and tactical shooting gameplay.",
      screenshot1 : screenshot3,
      screenshot2 :  screenshot4, },
    { name: "Grand Theft Auto", 
      price: "Rs1000", 
      image: gta,
      developer: "Rockster Games",
      releaseDate: "December 9, 2013",
      about: "Call of duty MW3 is story and online based game develop by ActiveVisison that focuses on story and tactical shooting gameplay.", 
      screenshot1 : screenshot3,
      screenshot2 :  screenshot4,
    },
  ],
  free: [
    { name: "PUBG BATTLEGROUNDS",
      developer: "Tencent Games",
      releaseDate: "December 9, 2017",
      about: "Ea fC 24 is a football game develop by ea sport that focuses on team-based tactical gameplay.",
      image: pubg,
      screenshot1 : screenshot5,
      screenshot2 :  screenshot6, 
      price: "Free" },

    { 
      name: "Apex Legends", 
      image: apex, 
      about: "Ea fC 24 is a football game develop by ea sport that focuses on team-based tactical gameplay.",
      price: "Free",
      developer: "Respawn Entertainment",
      releaseDate: "December 9, 2021",
    },
    { name: "Valorant", image: vdd, price: "Free" },
    { name: "War Zone", image: "/path/to/warzone.png", price: "Free" },
    { name: "Counter Strike", image: "/path/to/couterstrike.jpg", price: "Free" },
    { name: "Delta Force", price: "Free", image: deltaforce },
    { name: "Dota 2", price: "Free", image: dota2 },

  ],
  fifa: [
    { name: "FIFA 14", price: "Rs1500", image: fifa14 },
    { name: "FIFA 15", price: "Rs1500", image: fifa15 },
    { name: "FIFA 16", price: "Rs1500", image: fifa16 },
    { name: "FIFA 17", price: "Rs1300", image: fifa17 },
    { name: "FIFA 18", price: "Rs1300", image: fifa18 },
  ],
};

export default games;
