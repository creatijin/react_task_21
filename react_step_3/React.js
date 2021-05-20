const React = (() => {
  let hooks = [];
  let currentHook = 0;
  let end_num = 0;
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
        hooks[currentHook] = dependencies;
      }
      currentHook++;
    },
    setValue: (fn, num) => {
      const count = end_num;
      if (count === num) {
        return;
      } else {
        end_num++;
        fn();
        return React.setValue(fn, num);
      }
    },
  };
})();
