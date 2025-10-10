import type { AppProps } from "next/app";
import Head from "next/head";
import { ConfigProvider, theme as antdTheme } from "antd";
import { SessionProvider } from "next-auth/react";
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

      <SessionProvider>
      <ConfigProvider
        theme={{
          algorithm: antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: "var(--primary)",
            colorBgBase: "var(--background)",
            colorTextBase: "var(--foreground)",
            colorLink: "var(--primary)",
            borderRadius: 10,
            fontFamily: "Segoe UI, Roboto, sans-serif",
          },
          components: {
            Layout: {
              headerBg: "rgba(3, 2, 19, 0.08)",
              bodyBg: "var(--background)",
              footerBg: "rgba(3, 2, 19, 0.06)",
            },
            Card: {
              colorBgContainer: "var(--card)",
              colorBorderSecondary: "var(--border)",
              borderRadiusLG: 10,
            },
            Button: {
              colorPrimary: "var(--primary)",
              colorPrimaryHover: "var(--primary)",
              borderRadius: 10,
            },
            Menu: {
              itemColor: "var(--foreground)",
              itemHoverColor: "var(--primary)",
              itemSelectedColor: "var(--primary)",
            },
          },
        }}
      >
        <SiteLayout>
          <Component {...pageProps} />
        </SiteLayout>
      </ConfigProvider>
      </SessionProvider>
    </>
  );
}
