'use client';
import Image from "next/image";
import S1_home from "./home_sections/S1_home";
import S2_home from "./home_sections/S2_home";
import S3_home from "./home_sections/S3_home";
import S4_home from "./home_sections/S4_home";
import S5_home from "./home_sections/S5_home";
import S6_home from "./home_sections/S6_home";
// import i18n from '../i18n/index';
export default function Home() {
  return (
    <>
    <S1_home/>
    <S2_home/>
    <S3_home/>
    <S4_home/>
    <S5_home/>
    <S6_home/>
    </>
  );
}
