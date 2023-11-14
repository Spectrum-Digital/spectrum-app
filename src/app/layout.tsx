import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { ServerThemeProvider } from '@wits/next-themes'

import Nav from '@/components/common/Nav'
import Footer from '@/components/common/Footer'
import Providers from '@/components/common/Providers'
import { AppConfig } from '@/utils/app-config'

export const metadata: Metadata = {
  // These tags are automatically injected by NextJS
  // <meta charSet='UTF-8' key='charset' />
  // <meta name='viewport' content='width=device-width,initial-scale=1' key='viewport' />
  title: AppConfig.title,
  description: AppConfig.description,
  openGraph: {
    title: AppConfig.title,
    description: AppConfig.description,
    url: AppConfig.url,
    locale: AppConfig.locale,
    siteName: AppConfig.site_name,
  },
}

const DMSans = DM_Sans({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ServerThemeProvider attribute='class'>
      <html lang={AppConfig.locale} className={DMSans.variable}>
        <body className='my-16 overflow-y-hidden'>
          <Providers>
            <Nav />
            <main className='flex overflow-y-scroll absolute w-full px-auto z-0 top-16 bottom-16 mb-6'>{children}</main>
            <Footer />
          </Providers>
          {/* Optional: inject static radial background here */}
          {/* <div className='absolute top-0 left-0 h-screen w-screen bg-radial-light dark:bg-radial-dark z-0' /> */}
        </body>
      </html>
    </ServerThemeProvider>
  )
}
