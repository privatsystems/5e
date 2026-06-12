import { FC, useState, useEffect, useCallback } from "react";
import { fetchHomeData } from "../lib/fetch/fetchHomeData";
import { ContactData, fetchFooterData } from "../lib/fetch/fetchFooterData";
import { PaginatedResponse, LayoutData, ImageProject, Column } from "../types/home";
import Image from "next/image";
import LigneScroll from "@/components/home/lignescroll";
import recognizeSrcType from "@/util/recognizeSrcType";
import PlayerItem from "@/components/videos/PlayerItem";
import CarouselMiniWrapper from "@/components/home/carouselMini/carouselMiniWrapper";
import Footer from "@/components/footer";
import { useGeneralStore } from "@/lib/stores/useGeneralStore";
import FooterMobile from "@/components/footer/footerMobile";
import Link from "next/link";
import Transition from "@/components/transition";
import { ImageProps } from "@/types/general";
import IntroSequence from "@/components/home/introSequence";
import { useIntroStore } from "@/lib/stores/useIntroStore";
import { motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";

type Props = {
  initialData: PaginatedResponse;
  footerData: ContactData;
};

export const Home: FC<Props> = ({ initialData, footerData }) => {
  const data = initialData;
  const loading = false;
  const { setShowLogo, showLogo, showNav, setShowNav, once } = useIntroStore();
  const { isMob } = useGeneralStore();

  const [showIntro, setShowIntro] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const oldB = localStorage.getItem("newVisitedPage");
    const newB = router.asPath;
    if (oldB !== newB) {
      localStorage.setItem("lastVisitedPage", oldB || "/");
      localStorage.setItem("newVisitedPage", router.asPath);
    }
  }, []);

  // Ce useEffect s'assure que localStorage est consulté uniquement côté client
  useEffect(() => {
    const introDuration = 30 * 60 * 1000; // 30 minutes
    const lastIntroTime = localStorage.getItem("introTimestamp");
    const currentTime = Date.now();

    // Si lastIntroTime est défini et la durée est encore valide, on ne montre pas l'intro
    if (lastIntroTime && currentTime - parseInt(lastIntroTime) <= introDuration) {
      setShowIntro(false);
    } else {
      setShowIntro(true);
    }
  }, []);

  const showLogoFunc = useCallback(() => {
    if (!showLogo) setShowLogo(true);
  }, [showLogo, setShowLogo])
  const hideLogoFunc = useCallback(() => {
    if (showLogo) setShowLogo(false);
  }, [showLogo, setShowLogo])

  const showNavFunc = useCallback(() => {
    if (!showNav) setTimeout(() => { setShowNav(true) }, 600); // Ajout d'un délai pour éviter les problèmes de transition
  }, [showNav, setShowNav])
  const hideNavFunc = useCallback(() => {
    if (showNav) setShowNav(false); // Ajout d'un délai pour éviter les problèmes de transition
  }, [showNav, setShowNav])

  useEffect(() => {
    if (!showIntro) {

      showLogoFunc();
      showNavFunc();

    } else {

      hideLogoFunc();
      hideNavFunc();

    }
  }, [showIntro, hideLogoFunc, showLogoFunc, hideNavFunc, showNavFunc, showLogo, showNav]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem("introTimestamp", Date.now().toString()); // Stocke le timestamp à la fin de l’intro
  };

  if (showIntro && !once) {
    return <IntroSequence images={isMob ? data.intro_images_mob : data.intro_images} onComplete={handleIntroComplete} />;
  }

  return (<>
    <Head>
      <title>{`${footerData.seo.title} | ${footerData.seo.tagline}`}</title>
      <meta name="description" content={`${footerData.seo.description}`} />
      <meta key="og_title" property="og:title" content={`${footerData.seo.title} | ${footerData.seo.tagline}`} />
      <meta key="og_description" property="og:description" content={`${footerData.seo.description}`} />
      {footerData.seo.image && <meta key="og_image" property="og:image" content={`${footerData.seo.image}`} />}
    </Head>
    <Transition>
      <motion.section
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          duration: 2,
        }}
        className="home"
      >
        <LigneScroll />
        <div className="grid">
          {data.data.map((column: LayoutData, index: number) => (
            <div className={`column grid-${column.column.length}`} key={index}>
              {column.column.map((item: Column, i: number) => (
                <div className={`grid-item ${item.item.length === 0 ? 'empty' : ''}`} key={`column-${i}`}>
                  {item.item.map((proj: ImageProject, j: number) => (
                    <div key={`${j}-${proj.project?.id}`}>
                      {proj.project?.slug ?
                        <Link href={`/references/${proj.project?.slug}`} className="grid-item_wrapper">
                          <div className={`images-wrapper ${proj.thumbnail_type}`}>
                            {proj.thumbnails.map((thumb: ImageProps, k: number) => (
                              <div className="image-wrapper" key={`${k}-${thumb.url}`}>
                                {recognizeSrcType(thumb.url) === 'image' && (
                                  <Image
                                    src={thumb.url}
                                    alt={proj.project?.title || ''}
                                    width={thumb.width}
                                    height={thumb.height}
                                    sizes={column.column.length === 3 && !isMob ? '100vw' : '100vw'}
                                  />
                                )}
                                {recognizeSrcType(thumb.url) === 'video' && <PlayerItem data-url={thumb.url} mux={thumb?.mux} index={index} mini={true} />}
                              </div>
                            ))}
                          </div>
                          {proj.project?.client ? <h3>{proj.project.client.title}</h3> : ''}
                          {proj.project?.photographer ? <p>{proj.project.photographer.title}</p> : ''}
                        </Link>
                        :
                        <div className="grid-item_wrapper">
                          <div className={`images-wrapper ${proj.thumbnail_type}`}>
                            {proj.thumbnails.map((thumb: ImageProps, k: number) => (
                              <div className="image-wrapper" key={`${k}-${thumb.url}`}>
                                {recognizeSrcType(thumb.url) === 'image' && (
                                  <Image
                                    src={thumb.url}
                                    alt={proj.project?.title || ''}
                                    width={thumb.width}
                                    height={thumb.height}
                                    sizes={column.column.length === 3 && !isMob ? '100vw' : '100vw'}
                                  />
                                )}
                                {recognizeSrcType(thumb.url) === 'video' && <PlayerItem data-url={thumb.url} mux={thumb?.mux} index={index} mini={true} />}
                              </div>
                            ))}
                          </div>
                          <h3>{proj.project?.title}</h3>
                          {proj.project?.photographer ? <p>{proj.project.photographer.title}</p> : ''}
                        </div>
                      }
                      {proj.project?.slug && proj.project?.image_count > 0 && (
                        <CarouselMiniWrapper
                          count={proj.project.image_count}
                          title={proj.project.title || ''}
                          slug={proj.project.slug}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
          {loading && <p>Chargement...</p>}
        </div>
      </motion.section>
      {isMob ? <FooterMobile footerData={footerData} /> : <Footer footerData={footerData} />}
    </Transition >
  </>
  );
};

export const getServerSideProps = async () => {
  try {
    const initialData = await fetchHomeData(1, 100);
    const footerData = await fetchFooterData();
    return {
      props: { initialData, footerData }
    };
  } catch (error) {
    console.error("getServerSideProps error:", error);
    return {
      props: {
        initialData: null,
        footerData: null,
        error: error instanceof Error ? error.message : "Erreur inconnue"
      }
    };
  }
};
