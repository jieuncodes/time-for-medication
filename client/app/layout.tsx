import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full h-full">
      <body className="w-full h-full flex align-middle justify-center">
        <div className="flex flex-row items-center">
          <div className="w-80 mr-36">
            Aliquip labore dolore et exercitation magna aute laborum incididunt
            adipisicing voluptate reprehenderit magna labore.
          </div>
          <div className="mockup-phone">
            <div className="camera z-30"></div>
            <div className="display">
              <div className="artboard phone-4 bg-white">
                <div className="w-full relative h-full overflow-y-scroll flex-col items-center">
                  {children}
                  <Toaster
                    richColors
                    className="absolute z-0 "
                    position="bottom-center"
                    expand={true}
                    visibleToasts={2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
