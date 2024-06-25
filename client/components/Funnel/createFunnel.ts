import useFunnel from '@/hooks/useFunnel';
import Funnel, { Step } from './Funnel';

// steps의 순서를 자동으로 제네릭에 의해 관리되도록 하는 함수
const createFunnel = <T extends readonly string[]>(steps: T) => ({
  Funnel: Funnel<T>,
  Step: Step<T>,
  useFunnel: () => useFunnel<T>(steps),
});

export default createFunnel;
