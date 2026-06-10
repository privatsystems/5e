import Header from "@/components/header";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Init from "@/components/init";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className='container'>
      <Init />
      <Header />
      <Component {...pageProps} />
    </div>
  )
}
