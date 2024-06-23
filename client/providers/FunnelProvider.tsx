import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';

interface FunnelContextProps {
  step: string;
  setStep: (step: string) => void;
  toNext: () => void;
  toPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  toFirst: () => void;
  toLast: () => void;
}

const FunnelContext = createContext<FunnelContextProps | undefined>(undefined);

export const useFunnel = () => {
  const context = useContext(FunnelContext);
  if (!context) {
    throw new Error('useFunnel must be used within a FunnelProvider');
  }
  return context;
};

export const FunnelProvider = <T extends readonly string[]>({
  steps,
  children,
}: {
  steps: string[];
  children: ReactNode;
}) => {
  const [step, setStep] = useState<T[number]>(steps[0]);
  const currentIdx = steps.indexOf(step);

  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < steps.length - 1;

  const toPrev = useCallback(() => {
    if (!hasPrev) return;
    setStep(steps[currentIdx - 1]);
  }, [currentIdx, hasPrev, steps]);

  const toNext = useCallback(() => {
    if (!hasNext) return;
    setStep(steps[currentIdx + 1]);
  }, [currentIdx, hasNext, steps]);

  const toFirst = useCallback(() => {
    setStep(steps[0]);
  }, [steps]);

  const toLast = useCallback(() => {
    setStep(steps[steps.length - 1]);
  }, [steps]);

  return (
    <FunnelContext.Provider
      value={{
        step,
        setStep,
        toNext,
        toPrev,
        hasNext,
        hasPrev,
        toFirst,
        toLast,
      }}
    >
      {children}
    </FunnelContext.Provider>
  );
};
