import { HiOutlineMapPin } from 'react-icons/hi2';
import Logo from '@/components/ui/Logo';
import FooterLinkColumn from './FooterLinkColumn';
import FooterSocialLinks from './FooterSocialLinks';

import {
  COMPANY_LINKS,
  COPYRIGHT_NOTICE,
  SHOP_LINKS,
  STORE_LOCATION,
} from './footerLinks';

const BRAND_DESCRIPTION =
  'Premium fashion jewellery crafted for the modern woman.';

export default function Footer() {
  return (
    <footer className="border-t border-[#E8E0D7] bg-bg">
      <div className="container-luxury">

        {/* =========================
            MAIN FOOTER
        ========================== */}
        <div
          className="
            grid
            grid-cols-1
            gap-8
            py-10

            sm:grid-cols-2
            sm:gap-x-10
            sm:gap-y-12
            sm:py-14

            lg:grid-cols-12
            lg:gap-x-12
            lg:gap-y-0
            lg:py-16
          "
        >
          {/* =========================
              BRAND
          ========================== */}
          <div className="sm:col-span-2 lg:col-span-5">
            <div className="max-w-md">
              <Logo className="h-10 w-auto" />

              <p
                className="
                  mt-5
                  max-w-[24rem]
                  text-[13px]
                  leading-6
                  tracking-[0.01em]
                  text-[#6F6259]
                  sm:text-sm
                "
              >
                {BRAND_DESCRIPTION}
              </p>

              {/* Location */}
              <div className="mt-6 flex items-start gap-3">
                <HiOutlineMapPin
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[19px] text-gold"
                />

                <p
                  className="
                    max-w-[22rem]
                    text-[13px]
                    leading-5
                    text-[#6F6259]
                    sm:text-sm
                  "
                >
                  {STORE_LOCATION}
                </p>
              </div>
            </div>
          </div>

          {/* =========================
              MOBILE SHOP + COMPANY
              SIDE BY SIDE
          ========================== */}
          <div
            className="
              grid
              grid-cols-2
              gap-6

              sm:col-span-2
              sm:grid-cols-2
              sm:gap-10

              lg:contents
            "
          >
            {/* Shop */}
            <FooterLinkColumn
              title="Shop"
              links={SHOP_LINKS}
              className="lg:col-span-2"
            />

            {/* Company */}
            <FooterLinkColumn
              title="Company"
              links={COMPANY_LINKS}
              className="lg:col-span-2"
            />
          </div>

          {/* =========================
              CONNECT
          ========================== */}
          <FooterSocialLinks
            className="
              sm:col-span-2
              lg:col-span-3
            "
          />
        </div>

        {/* =========================
            COPYRIGHT
        ========================== */}
        <div
          className="
            flex
            flex-col
            gap-3
            border-t
            border-[#E8E0D7]
            py-5

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p
            className="
              text-[10px]
              leading-5
              tracking-[0.04em]
              text-[#8A7D73]
              sm:text-[11px]
            "
          >
            {COPYRIGHT_NOTICE}
          </p>

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.16em]
              text-[#A09287]
              sm:text-[11px]
            "
          >
            Crafted with elegance
          </p>
        </div>
      </div>
    </footer>
  );
}
