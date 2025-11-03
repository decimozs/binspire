export const themes = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
] as const;

export const fonts = [
  { label: "Manrope", value: "manrope" },
  { label: "Inter", value: "inter" },
  { label: "Roboto", value: "roboto" },
  { label: "Montserrat", value: "montserrat" },
] as const;

import {
  Car,
  Bike,
  Bus,
  Footprints,
  Ship,
  Plane,
  Mountain,
  Route,
} from "lucide-react";

export const NAVIGATION_PROFILES = {
  "driving-car": {
    label: "Driving (Car)",
    icon: Car,
  },
  "driving-hgv": {
    label: "Heavy Vehicle",
    icon: Bus,
  },
  "cycling-regular": {
    label: "Cycling",
    icon: Bike,
  },
  "cycling-road": {
    label: "Road Cycling",
    icon: Bike,
  },
  "cycling-mountain": {
    label: "Mountain Biking",
    icon: Mountain,
  },
  "cycling-electric": {
    label: "E-Bike",
    icon: Bike,
  },
  "foot-walking": {
    label: "Walking",
    icon: Footprints,
  },
  "foot-hiking": {
    label: "Hiking",
    icon: Footprints,
  },
  "driving-electric": {
    label: "Electric Car",
    icon: Car,
  },
  "driving-bus": {
    label: "Bus",
    icon: Bus,
  },
  "driving-truck": {
    label: "Truck",
    icon: Bus,
  },
  ferry: {
    label: "Ferry",
    icon: Ship,
  },
  flight: {
    label: "Flight",
    icon: Plane,
  },
  default: {
    label: "Unknown Route",
    icon: Route,
  },
} as const;

export type NavigationProfileKey = keyof typeof NAVIGATION_PROFILES;
