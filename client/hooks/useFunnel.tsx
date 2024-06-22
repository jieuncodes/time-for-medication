import deepEqual from 'fast-deep-equal';
import { useRouter } from 'next/router.js';
import React, {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useSessionStorage from './useSessionStorage';
import { useQuery } from 'react-query';
import { QS } from '../lib/query-string/queryString';
import {
  FunnelProps,
  Funnel,
  StepsType,
  StepProps,
  Step,
} from '../components/Funnel';
import { assert } from '../lib/assert';

interface SetStepOptions {
  stepChangeType?: 'push' | 'replace';
  preserveQuery?: boolean;
  query?: Record<string, any>;
}

type RouteFunnelProps<Steps extends StepsType> = Omit<
  FunnelProps<Steps>,
  'steps' | 'step'
>;

type FunnelComponent<Steps extends StepsType> = ((
  props: RouteFunnelProps<Steps>
) => JSX.Element) & {
  Step: (props: StepProps<Steps>) => JSX.Element;
};

const DEFAULT_STEP_QUERY_KEY = 'funnel-step';

export const useFunnel = <Steps extends StepsType>(
  steps: Steps,
  options?: {
    /**
     * 이 query key는 현재 스텝을 query string에 저장하기 위해 사용됩니다.
     * @default 'funnel-step'
     */
    stepQueryKey?: string;
    initialStep?: Steps[number];
    onStepChange?: (name: Steps[number]) => void;
  }
): readonly [
  FunnelComponent<Steps>,
  (step: Steps[number], options?: SetStepOptions) => void,
] & {
  withState: <
    StateExcludeStep extends Record<string, unknown> & { step?: never },
  >(
    initialState: StateExcludeStep
  ) => [
    FunnelComponent<Steps>,
    StateExcludeStep,
    (
      next:
        | Partial<StateExcludeStep & { step: Steps[number] }>
        | ((
            next: Partial<StateExcludeStep & { step: Steps[number] }>
          ) => StateExcludeStep & { step: Steps[number] })
    ) => void,
  ];
} => {
  const router = useRouter();
  const stepQueryKey = options?.stepQueryKey ?? DEFAULT_STEP_QUERY_KEY;

  assert(steps.length > 0, 'steps가 비어있습니다.');

  const FunnelComponent = useMemo(
    () =>
      Object.assign(
        function RouteFunnel(props: RouteFunnelProps<Steps>) {
          const router = useRouter();

          const step =
            (router.query[stepQueryKey] as Steps[number]) ??
            options?.initialStep;

          assert(
            step != null,
            `표시할 스텝을 ${stepQueryKey} 쿼리 파라미터에 지정해주세요. 쿼리 파라미터가 없을 때 초기 스텝을 렌더하려면 useFunnel의 두 번째 파라미터 options에 initialStep을 지정해주세요.`
          );

          return <Funnel<Steps> steps={steps} step={step} {...props} />;
        },
        {
          Step,
        }
      ),
    []
  );

  const setStep = useCallback(
    (step: Steps[number], setStepOptions?: SetStepOptions) => {
      const { preserveQuery = true, query = {} } = setStepOptions ?? {};

      const url = `${QS.create({
        ...(preserveQuery ? router.query : undefined),
        ...query,
        [stepQueryKey]: step,
      })}`;

      options?.onStepChange?.(step);

      switch (setStepOptions?.stepChangeType) {
        case 'replace':
          router.replace(url, undefined, {
            shallow: true,
          });
          return;
        case 'push':
        default:
          router.push(url, undefined, {
            shallow: true,
          });
          return;
      }
    },
    [options, router]
  );

  type S = Record<string, unknown>;
  const [state, _setState] = useFunnelState<S>({});
  type Step = Steps[number];
  type NextState = S & { step?: Step };

  const nextPendingStepRef = useRef<Step | null>(null);
  const nextStateRef = useRef<Partial<S> | null>(null);
  const setState = useCallback(
    (next: Partial<NextState> | ((next: Partial<NextState>) => NextState)) => {
      let nextStepValue: Partial<NextState>;
      if (typeof next === 'function') {
        nextStepValue = next(state);
      } else {
        nextStepValue = next;
      }

      if (nextStepValue.step != null) {
        nextPendingStepRef.current = nextStepValue.step;
      }
      nextStateRef.current = nextStepValue;

      _setState(next);
    },
    [_setState, state]
  );

  useEffect(() => {
    if (nextPendingStepRef.current == null) {
      return;
    }
    if (deepEqual(nextStateRef.current, state)) {
      setStep(nextPendingStepRef.current);
      nextPendingStepRef.current = null;
    }
  }, [setStep, state]);

  const initializedRef = useRef(false);
  function withState<State extends Record<string, unknown>>(
    initialState: State
  ) {
    if (!initializedRef.current) {
      setState(initialState);
      initializedRef.current = true;
    }
    return [FunnelComponent, state, setState] as const;
  }

  return Object.assign([FunnelComponent, setStep] as const, {
    withState,
  }) as unknown as readonly [
    FunnelComponent<Steps>,
    (step: Steps[number], options?: SetStepOptions) => Promise<void>,
  ] & {
    withState: <
      StateExcludeStep extends Record<string, unknown> & { step?: never },
    >(
      initialState: StateExcludeStep
    ) => [
      FunnelComponent<Steps>,
      StateExcludeStep,
      (
        next:
          | Partial<StateExcludeStep & { step: Steps[number] }>
          | ((
              next: Partial<StateExcludeStep & { step: Steps[number] }>
            ) => StateExcludeStep & { step: Steps[number] })
      ) => void,
    ];
  };
};

type FunnelStateId = `use-funnel-state__${string}`;

function createFunnelStateId(id: string): FunnelStateId {
  return `use-funnel-state__${id}`;
}

function createFunnelStorage<T>(
  funnelStateId: FunnelStateId,
  storageType = 'sessionStorage'
): FunnelStorage<T> {
  switch (storageType) {
    case 'sessionStorage': {
      const { storedValue, setValue, clearValue } = useSessionStorage({
        key: funnelStateId,
      });

      return {
        get: async () => {
          if (storedValue == null) {
            return null;
          }
          return JSON.parse(storedValue) as Partial<T>;
        },
        set: async (value: Partial<T>) => {
          setValue(JSON.stringify(value));
        },
        clear: async () => {
          clearValue();
        },
      };
    }
    default:
      throw new Error('Need to implement other storage types.');
  }
}

interface FunnelStorage<T> {
  get: () => Promise<Partial<T> | null>;
  set: (value: Partial<T>) => Promise<void>;
  clear: () => Promise<void>;
}

function useFunnelState<T extends Record<string, any>>(
  defaultValue: Partial<T>,
  options?: { storage?: FunnelStorage<T> }
) {
  const { pathname, basePath } = useRouter();

  const storage =
    options?.storage ??
    createFunnelStorage<T>(createFunnelStateId(`${basePath}${pathname}`));
  const persistentStorage = useRef(storage).current;

  const initialState = useQuery({
    queryFn: () => {
      return persistentStorage.get();
    },
    suspense: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  }).data;

  const [_state, _setState] = useState<Partial<T>>(
    initialState ?? defaultValue
  );

  const setState = useCallback(
    (state: SetStateAction<Partial<T>>) => {
      _setState((prev) => {
        if (typeof state === 'function') {
          const newState = state(prev);
          persistentStorage.set(newState);
          return newState;
        } else {
          persistentStorage.set(state);
          return state;
        }
      });
    },
    [persistentStorage]
  );

  const clearState = useCallback(() => {
    _setState({});
    persistentStorage.clear();
  }, [persistentStorage]);

  return [_state, setState, clearState] as const;
}
