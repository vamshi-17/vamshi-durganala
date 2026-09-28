import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
});
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

const title = "Vamshi Krishna Durganala — Full Stack Engineer";
const description =
  "Full stack engineer in Charlotte, NC building secure, event-driven systems with Java, Spring Boot, Kafka, React and AWS.";

export const metadata: Metadata = {
  metadataBase: new URL("https://vamshi-17.github.io/vamshi-portfolio/"),
  title,
  description,
  keywords: ["Vamshi Krishna Durganala", "Full Stack Engineer", "Java", "Spring Boot", "Kafka", "React", "AWS", "Charlotte"],
  authors: [{ name: "Vamshi Krishna Durganala" }],
  openGraph: { title, description, type: "website", locale: "en_US" },
  twitter: { card: "summary", title, description },
};

export const viewport: Viewport = {
  themeColor: "#0c0d0c",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${jetbrains.variable}`}>
      <body>
        <MotionProvider>
          <SmoothScroll />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
