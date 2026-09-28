import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const title = "Vamshi Krishna Durganala — Full Stack Developer";
const description =
  "Full stack developer in Charlotte, NC building secure, event-driven enterprise systems with Java, Spring Boot, Kafka, React and AWS.";

export const metadata: Metadata = {
  metadataBase: new URL("https://vamshi-17.github.io/vamshi-portfolio/"),
  title,
  description,
  keywords: [
    "Vamshi Krishna Durganala",
    "Full Stack Developer",
    "Java",
    "Spring Boot",
    "Kafka",
    "React",
    "TypeScript",
    "AWS",
    "Charlotte",
  ],
  authors: [{ name: "Vamshi Krishna Durganala" }],
  openGraph: { title, description, type: "website", locale: "en_US" },
  twitter: { card: "summary", title, description },
};

export const viewport: Viewport = {
  themeColor: "#07070b",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
