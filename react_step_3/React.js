const React = (() => {
  let hooks = [];
  let currentHook = 0;
  return {
    render: (Component, domElem) => {
      const Comp = Component();
      const renderHTML = Comp.render();
      if (domElem) domElem.innerHTML = renderHTML;
      currentHook = 0;
      return Comp;
    },
    useState: (initialValue) => {
      hooks[currentHook] = hooks[currentHook] || initialValue;
      const setStateHookIndex = currentHook;
      const setState = (newState) => (hooks[setStateHookIndex] = newState);
      return [hooks[currentHook++], setState];
    },
    useMemo: (fn, dependencies) => {
      const [prevDependencies, setPrevDependencies] = React.useState(dependencies);
      const hasNoDeps = !dependencies;
      const deps = hooks[currentHook];
      const hasChangedDeps = deps ? !dependencies.every((el, i) => el === deps[i]) : true;
      if (hasNoDeps || hasChangedDeps) {
        setPrevDependencies(dependencies);
        return fn?.();
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
        hooks[currentHook] = dependencies;
      }
    },
  };
})();
