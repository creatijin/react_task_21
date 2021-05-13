const myUseState = () => {
  let hooks = [];
  let index = 0;
  function render() {
    // index = 0;
    console.log('render 작동');
  }

  function useState(initialState) {
    if (!hooks) {
      hooks = [];
    }
    // const hooks = hooks;
    const currentState = hooks[index] || initialState;
    hooks[index] = currentState;
    console.log(hooks, hooks[index], currentState);
    firstrender = true;

    index++;
    const setState = () => {
      let currentIndex = index;
      return function (value) {
        hooks[currentIndex] = value;
        render();
      };
    };
    return [currentState, setState()];
  }
  // return { render,  };
  useState(index);
};
