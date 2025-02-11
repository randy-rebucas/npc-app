"use client";

import AboutUs from "@/components/root/home/AboutUs";
import Banner from "@/components/root/home/Banner";
import Brand from "@/components/root/home/Brand";
import Matching from "@/components/root/home/Matching";
import HowItWork from "@/components/root/home/HowItWork";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <Banner />
      <Brand />
      <AboutUs /> 
      <Matching /> 
      <HowItWork />
    </main>
  );
}
