import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi2';

const FAQS = [
  {
    q: 'Is this jewellery hypoallergenic?',
    a: 'Our pieces are plated to minimize skin reactions, but as with all fashion jewellery, we recommend avoiding prolonged contact with sensitive or broken skin.',
  },
  {
    q: 'Will the plating fade over time?',
    a: 'With proper care (avoiding water, perfume, and sweat), the plating typically lasts 12–18 months of regular wear before any visible fading.',
  },
  {
    q: 'How do I know my ring size?',
    a: 'Check our Size Guide page for a printable ring sizer and a conversion chart from string measurements to Indian ring sizes.',
  },
  {
    q: 'Can I return this if it doesn’t fit or match?',
    a: 'Yes — unused items in original packaging can be returned within the return window shown on this page. Visit Track Order or contact us to start a return.',
  },
];

function Accordion({ items, renderTitle, renderContent }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y divide-border">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="flex w-full items-center justify-between py-4 text-left"
          >
            <span className="font-heading text-sm text-brown">{renderTitle(item)}</span>
            <motion.span animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <HiChevronDown className="text-brown/50" />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pb-4 text-sm leading-relaxed text-text/70">{renderContent(item)}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function SpecRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 text-sm last:border-b-0">
      <span className="text-text/50">{label}</span>
      <span className="font-medium text-brown">{value}</span>
    </div>
  );
}

const TABS = ['Description', 'Specifications', 'Care Guide', 'Shipping', 'Returns', 'Reviews', 'FAQs'];

export default function InfoTabs({ product }) {
  const [active, setActive] = useState('Description');

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              active === tab ? 'border-gold text-brown' : 'border-transparent text-text/50 hover:text-brown'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="py-8">
        {active === 'Description' && (
          <div>
            <p className="text-sm leading-relaxed text-text/70">{product.description}</p>
            <ul className="mt-5 space-y-2 text-sm text-text/70">
              <li>• Premium {product.specs.metal.toLowerCase()} finish with hand-set {product.stone.toLowerCase()} stones</li>
              <li>• Part of the {product.collection?.name} collection</li>
              <li>• Designed for {product.occasion.replace(/-/g, ' ')} wear</li>
              <li>• Comes with Khayaal Jewels signature gift box &amp; authenticity card</li>
            </ul>
          </div>
        )}

        {/* {active === 'Specifications' && (
          <div>
            <SpecRow label="Metal" value={product.specs.metal} />
            <SpecRow label="Stone" value={product.specs.stone} />
            <SpecRow label="Finish" value={product.specs.finish} />
            <SpecRow label="Weight" value={product.specs.weight} />
            <SpecRow label="Dimensions" value={product.specs.dimensions} />
            <SpecRow label="Occasion" value={product.specs.occasion.replace(/-/g, ' ')} />
            <SpecRow label="Package Includes" value={product.specs.packageIncludes} />
            <SpecRow label="Warranty" value={product.specs.warranty} />
            <SpecRow label="Country of Origin" value={product.specs.countryOfOrigin} />
          </div>
        )} */}

        {active === 'Care Guide' && (
          <p className="text-sm leading-relaxed text-text/70">{product.careInstructions}</p>
        )}

        {active === 'Shipping' && (
          <div className="space-y-3 text-sm leading-relaxed text-text/70">
            <p>Orders are dispatched within 1–2 business days and typically arrive in {product.deliveryDays} days.</p>
            <p>{product.codAvailable ? 'Cash on Delivery is available for this product.' : 'This product ships prepaid only.'}</p>
            <p>Every order is packed in tamper-proof, gift-ready packaging.</p>
          </div>
        )}

        {active === 'Returns' && (
          <div className="space-y-3 text-sm leading-relaxed text-text/70">
            <p>Easy returns within {product.returnDays} days of delivery, provided the item is unused and in its original packaging.</p>
            <p>Refunds are processed within 5–7 business days of us receiving the returned item.</p>
            <p>To start a return, visit the Track Order page or contact us on WhatsApp.</p>
          </div>
        )}

        {active === 'Reviews' && (
          <div className="text-sm text-text/70">
            <p>
              This product has {product.reviewCount} reviews with an average rating of {product.rating} / 5.
            </p>
            <a href="#reviews" className="mt-2 inline-block font-medium text-gold underline-offset-4 hover:underline">
              Jump to full reviews ↓
            </a>
          </div>
        )}

        {active === 'FAQs' && (
          <Accordion items={FAQS} renderTitle={(item) => item.q} renderContent={(item) => item.a} />
        )}
      </div>
    </div>
  );
}
