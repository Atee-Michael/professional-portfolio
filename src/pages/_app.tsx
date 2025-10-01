import type { AppProps } from "next/app";
import Head from "next/head";
import { ConfigProvider, theme as antdTheme } from "antd";
import "@/styles/globals.css";
import "@/styles/theme.css";
import SiteLayout from "@/components/SiteLayout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>Michael Atee | Cybersecurity · Cloud · Frontend</title>
      </Head>

      <ConfigProvider
        theme={{
          algorithm: antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: "#D4A017",        // mustard
            colorBgBase: "#0B3D2E",         // forest
            colorTextBase: "#F5F5F5",
            colorLink: "#D4A017",
            borderRadius: 12,
            fontFamily: "Poppins, Segoe UI, Roboto, sans-serif",
          },
          components: {
            Layout: { headerBg: "rgba(0,0,0,0.5)", bodyBg: "#0B3D2E", footerBg: "#02243a" },
            Card: { colorBgContainer: "#003366", colorBorderSecondary: "#556B2F" },
            Button: { colorPrimary: "#D4A017", colorPrimaryHover: "#e0b126" },
            Menu: { itemColor: "rgba(245,245,245,0.85)", itemHoverColor: "#D4A017", itemSelectedColor: "#D4A017" },
          },
        }}
      >
        <SiteLayout>
          <Component {...pageProps} />
        </SiteLayout>
      </ConfigProvider>
    </>
  );
}
