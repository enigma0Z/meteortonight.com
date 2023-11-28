
import { useState, useEffect } from 'react';

function useFetch<T>(url: string): [T | null, boolean, boolean] {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
      fetch(url)
        .then(res => {
            setLoading(false);
            //checking for multiple responses for more flexibility 
            //with the url we send in.
            console.debug('useFetch()', url, res)
            if (res.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
              // JSON response
              res.json().then((json) => {setData(json as T)})
            } else {
              // Text response, just read the body and return the result
              res.body?.getReader().read().then(body => {
                setData(new TextDecoder().decode(body.value) as T)
              })
            }
        })
        .catch(err => {
            setLoading(false)
            setError(true)
        })
  }, [url])

  return [ data, loading, error ]
}

export default useFetch;