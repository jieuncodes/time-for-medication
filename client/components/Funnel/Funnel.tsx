import React, { useLayoutEffect } from 'react';

interface FunnelProps<T extends readonly string[]> {
  step: T[number];
  children: React.ReactNode;
}

const Funnel = <T extends readonly string[]>({
  step,
  children,
}: FunnelProps<T>) => {
  const validChildren = React.Children.toArray(children)
    .filter(React.isValidElement)
    .filter((child) => child.type === Step) as React.ReactElement<
    StepProps<T>
  >[];

  const currentStep = validChildren.find((child) => child.props.name === step);

  if (!currentStep) {
    throw new Error(
      `Funnel의 children 중에서 ${step} 스텝이 존재하지 않습니다.`
    );
  }

  return <>{currentStep}</>;
};

export default Funnel;

interface StepProps<T extends readonly string[]> {
  name: T[number];
  onEnter?: () => void;
  children: React.ReactNode;
}

export const Step = <T extends readonly string[]>({
  children,
  onEnter,
}: StepProps<T>) => {
  useLayoutEffect(() => {
    if (onEnter) {
      onEnter();
    }
  }, []);

  return <>{children}</>;
};
