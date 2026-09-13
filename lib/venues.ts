export type VenuePreset = {
  id: string;
  name: string;
  ticket_link: string;
  maps_url: string;
};

export const VENUE_PRESETS: VenuePreset[] = [
  {
    id: "neushoorn",
    name: "Neushoorn",
    ticket_link: "https://www.neushoorn.nl/programma",
    maps_url:
      "https://www.google.com/maps/search/?api=1&query=Neushoorn%2C+Ruiterskwartier+41%2C+Leeuwarden",
  },
  {
    id: "ossekop",
    name: "Café de Ossekop",
    ticket_link: "https://www.ossekop.nl/",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Caf%C3%A9+de+Ossekop%2C+Leeuwarden",
  },
  {
    id: "club-t",
    name: "Club T",
    ticket_link: "https://www.instagram.com/",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Club+T%2C+Leeuwarden",
  },
  {
    id: "koperen-tuin",
    name: "De Koperen Tuin",
    ticket_link: "https://www.dekoperentuin.nl/",
    maps_url: "https://www.google.com/maps/search/?api=1&query=De+Koperen+Tuin%2C+Leeuwarden",
  },
  {
    id: "asteriks",
    name: "Podium Asteriks",
    ticket_link: "https://www.instagram.com/",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Podium+Asteriks%2C+Leeuwarden",
  },
];
