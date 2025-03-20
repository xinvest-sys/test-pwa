import { Carousel } from '@mantine/carousel';
import { Image } from '@mantine/core';

type Props = {
  imageUrls: string[],
}

export default function HsiDerivativeCarousel(props: Props) {
  // {console.log('Rendering Carousel')}
  const slides = props.imageUrls.map((url) => (
    <Carousel.Slide key={url}>
      <Image src={url} alt='hsi derivative' />
    </Carousel.Slide>
  ));

  return (
    <Carousel mb={20} maw={640} withIndicators>
      {slides}
    </Carousel>
  );
}