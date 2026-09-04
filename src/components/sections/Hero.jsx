// import { motion, useScroll, useTransform } from 'framer-motion';
// import { useRef } from 'react';
// import { HiOutlineArrowRight } from 'react-icons/hi2';
// import GoldButton from '@/components/buttons/GoldButton';
// import GoldParticles from '@/components/animations/GoldParticles';

// export default function Hero() {
//   const ref = useRef(null);
//   const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
//   const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
//   const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
//   const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

//   return (
//     <section ref={ref} className="relative flex h-[100svh] min-h-135 w-full items-center overflow-hidden bg-brown sm:min-h-160">
//       <motion.div
//   className="absolute inset-0"
//   style={{ y: imageY }}
//   initial={{ scale: 1.15 }}
//   animate={{ scale: 1 }}
//   transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
// >
//   <img
//     src="/images/bg.jpeg"
//     alt="Khayaal Jewels bridal collection"
//     className="h-full w-full object-cover"
//     fetchPriority="high"
//   />

// </motion.div>

//       <GoldParticles />

//       <motion.div
//         style={{ y: contentY, opacity: contentOpacity }}
//         className="container-luxury relative z-10"
//       >
//         <motion.p
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
//           className="eyebrow !text-gold-hover"
//         >
//           THE KHAYAAL COLLECTIONS
//         </motion.p>

//         <div className="mt-4 overflow-hidden">
//           <motion.h1
//             initial={{ y: '100%' }}
//             animate={{ y: '0%' }}
//             transition={{ duration: 1, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
//             className="max-w-2xl font-heading text-5xl leading-[1.1] text-white sm:text-6xl lg:text-7xl"
//           >
//             Jewellery That Becomes Part Of Your Story
//           </motion.h1>
//         </div>

//         <motion.p
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 1.5 }}
//           className="mt-6 max-w-md text-base text-white/75"
//         >
//           Find jewellery that feels uniquely yours—beautifully designed for every celebration & everyday moments alike.

//         </motion.p>

//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 1.75 }}
//           className="mt-10 flex flex-wrap items-center gap-4"
//         >
//           <GoldButton to="/shop" icon={HiOutlineArrowRight}>
//             Shop The Edit
//           </GoldButton>
//           <GoldButton to="/about" variant="outline" className="!text-white border-white/50 hover:!text-brown">
//             Our Story
//           </GoldButton>
//         </motion.div>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 2, duration: 1 }}
//         className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70"
//       >
//         <div className="flex flex-col items-center gap-2">
//           <span className="text-[10px] tracking-[0.35em] uppercase">Scroll</span>
//           <motion.span
//             animate={{ y: [0, 8, 0] }}
//             transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
//             className="h-8 w-px bg-white/50"
//           />
//         </div>
//       </motion.div>
//     </section>
//   );
// }



import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import GoldButton from '@/components/buttons/GoldButton';
import GoldParticles from '@/components/animations/GoldParticles';

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative flex h-[100svh] min-h-135 w-full items-center overflow-hidden bg-brown sm:min-h-160">
      {/* <motion.div
        className="absolute inset-0"
        style={{ y: imageY }}
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src="/images/BG1.jpeg"
          alt="Khayaal Jewels bridal collection"
          className="h-full w-full object-cover"
          fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-brown via-brown/40 to-brown/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-brown/70 via-brown/10 to-transparent" />
      </motion.div> */}

      <div className="absolute inset-0">
  <img
    src="/images/BG1.jpeg"
    alt="Khayaal Jewels bridal collection"
    className="h-full w-full object-cover"
    fetchPriority="high"
  />
</div>

      <GoldParticles />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-luxury relative z-10"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="eyebrow !text-gold-hover"
        >
          THE KHAYAAL COLLECTIONS
        </motion.p>

        <div className="mt-4 overflow-hidden">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 1, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl font-heading text-5xl leading-[1.1] text-white sm:text-6xl lg:text-7xl"
          >
            Jewellery That Becomes Part Of Your Story
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-6 max-w-md text-base text-white/75"
        >
          Find jewellery that feels uniquely yours—beautifully designed for every celebration & everyday moments alike.

        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.75 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <GoldButton to="/shop" icon={HiOutlineArrowRight}>
            Shop The Edit
          </GoldButton>
          <GoldButton to="/about" variant="outline" className="!text-white border-white/50 hover:!text-brown">
            Our Story
          </GoldButton>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.35em] uppercase">Scroll</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="h-8 w-px bg-white/50"
          />
        </div>
      </motion.div>
    </section>
  );
}