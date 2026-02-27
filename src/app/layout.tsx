import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "./components/HeaderNew";
import Footer from "./components/Footer";
import AuthProvider from "./providers/AuthProvider";
import { LikeProvider } from "./providers/LikeContext";
import ClientOnly from "./components/ClientOnly";
import Script from "next/script";

export const metadata: Metadata = {
  title: "GodlyWomen - Celebrating Faithful Lives",
  description: "Discover inspiring stories of godly women throughout history",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Script
          id="hydration-fix"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Override the Element.prototype.setAttribute to prevent bis_skin_checked
                const originalSetAttribute = Element.prototype.setAttribute;
                Element.prototype.setAttribute = function(name, value) {
                  if (name === 'bis_skin_checked') return;
                  return originalSetAttribute.call(this, name, value);
                };

                // Create a MutationObserver to clean up any existing attributes
                function cleanup() {
                  document.querySelectorAll('[bis_skin_checked]').forEach(el => {
                    el.removeAttribute('bis_skin_checked');
                  });
                }

                // Clean up immediately
                cleanup();

                // Setup observer for dynamic changes
                const observer = new MutationObserver((mutations) => {
                  let needsCleanup = false;
                  mutations.forEach(mutation => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
                      needsCleanup = true;
                    }
                  });
                  if (needsCleanup) cleanup();
                });

                // Start observing
                observer.observe(document.body, {
                  attributes: true,
                  childList: true,
                  subtree: true,
                  attributeFilter: ['bis_skin_checked']
                });

                // Also clean up when new nodes are added
                const originalAppendChild = Element.prototype.appendChild;
                Element.prototype.appendChild = function(node) {
                  const result = originalAppendChild.call(this, node);
                  cleanup();
                  return result;
                };
              })();
            `
          }}
        />
        <AuthProvider>
          <LikeProvider>
            <ClientOnly className="min-h-screen flex flex-col bg-white">
              <Header />
              <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                  {children}
                </div>
              </main>
              <Footer />
            </ClientOnly>
          </LikeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
