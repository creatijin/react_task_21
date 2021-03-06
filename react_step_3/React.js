const React = (() => {
  let hooks = [];
  let currentHook = 0;
  let test;
  let renderTest;
  return {
    render: (Component, domElem) => {
      const Comp = Component();
      currentHook = 0;
      renderTest = Component;
      return Comp;
    },
    useState: (initialValue) => {
      hooks[currentHook] = hooks[currentHook] || initialValue;
      const setStateHookIndex = currentHook;
      const setState = (newState) => {
        hooks[setStateHookIndex] = newState;
        if (!(newState === test)) {
          renderTest();
        }
        test = newState;
      };
      return [hooks[currentHook++], setState];
    },
    useMemo: (fn, dependencies) => {
      const [subscribes, setSubscribes] = React.useState(null);
      const hasNoDeps = !dependencies;
      const deps = hooks[currentHook];
      const hasChangedDeps = deps ? !dependencies.every((el, i) => el === deps[i]) : true;
      if (hasNoDeps || hasChangedDeps) {
        setSubscribes(fn);
        if (subscribes) return subscribes?.();
      }
    },
    useEffect: (callback, dependencies) => {
      const [subscribes, setSubscribes] = React.useState(null);

      const hasNoDeps = !dependencies;
      const deps = hooks[currentHook];
      const hasChangedDeps = deps ? !dependencies.every((el, i) => el === deps[i]) : true;
      if (hasNoDeps || hasChangedDeps) {
        if (subscribes) subscribes?.();
        setSubscribes(callback());
        // callback();
        hooks[currentHook] = dependencies;
      }
      currentHook++;
    },
  };
})();
