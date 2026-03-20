"use client";
import { HeroParallax } from "./hero-parallax.js";
import { products } from "../data/products.js";

export function HeroParallaxDemo() {
  return <HeroParallax products={products} />;
}
