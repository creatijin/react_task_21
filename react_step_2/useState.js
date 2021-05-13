let _value;
const useState = (initialValue) => {
  _value = _value || initialValue;
  function setState(newVal) {
    _value = newVal;
  }
  return [_value, setState];
};
