
import { useCallback } from 'react'

import { debounce } from 'lodash';

function useDebounce(callback, delay) {
  const d = callback;
  const callbackfunc = useCallback(debounce(d, delay), []);
  return [callbackfunc]
}

export default useDebounce