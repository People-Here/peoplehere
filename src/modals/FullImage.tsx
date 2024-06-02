import { IonIcon, IonText } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';

import CloseIcon from '../assets/svgs/close-white.svg';

type Props = {
  images: string[];
  setShow: (show: boolean) => void;
};

const FullImage = ({ images, setShow }: Props) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const slides = carousel.querySelectorAll('img');
    const slidesArray = Array.from(slides);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // eslint-disable-next-line no-undef
            setCurrentIndex(slidesArray.indexOf(entry.target as HTMLImageElement));
          }
        });
      },
      { root: carousel, threshold: 0.5 },
    );
    slides.forEach((slide) => observer.observe(slide));

    return () => slides.forEach((slide) => observer.unobserve(slide));
  }, []);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black">
      <div className="fixed left-0 right-0 flex items-center justify-center top-6 h-14">
        <IonText className="text-white font-headline3">
          {currentIndex + 1} / {images.length}
        </IonText>

        <IonIcon
          icon={CloseIcon}
          className="absolute right-4 svg-lg"
          onClick={() => setShow(false)}
        />
      </div>

      <div
        ref={carouselRef}
        className="flex overflow-x-scroll snap-x snap-mandatory no-scrollbar w-full max-h-[80%]"
      >
        {images.map((image) => (
          <img
            key={image}
            src={image}
            className="object-contain w-full snap-center shrink-0"
            alt="full screen image"
          />
        ))}
      </div>
    </div>
  );
};

export default FullImage;
