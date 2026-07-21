import { motion } from 'framer-motion';
import { HiCheck } from 'react-icons/hi2';

const STEPS = [
  { key: 'info', label: 'Customer Info' },
  { key: 'review', label: 'Order Review' },
];

export default function CheckoutSteps({ current }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center justify-center gap-4">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step.key} className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <motion.span
                animate={{
                  backgroundColor: done || active ? '#3E2C23' : '#FFFFFF',
                  borderColor: done || active ? '#3E2C23' : '#ECE7E2',
                  color: done || active ? '#FFFFFF' : '#2E2E2E',
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium"
              >
                {done ? <HiCheck /> : i + 1}
              </motion.span>
              <span className={`text-sm font-medium ${active ? 'text-brown' : 'text-text/50'}`}>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && <span className="h-px w-10 bg-border sm:w-16" />}
          </div>
        );
      })}
    </div>
  );
}
