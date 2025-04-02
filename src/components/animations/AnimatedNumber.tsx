import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const AnimatedNumber = ({ start, end }: any) => {
  const { ref, inView } = useInView({ triggerOnce: true });
  
  return (
    <span ref={ref}>
      {inView && <CountUp start={start} end={end} duration={2} separator="," />}
    </span>
  );
};

export default AnimatedNumber;
