import { useCallback, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import config from "../common/config";

const baseURL = process.env.REACT_APP_ENV == 'dev' ? config.hostUrl : config.hostUrl

export function useFetch({ path, method, data, start }) {
    const cache = useRef({});
    const [res, setRes] = useState({ data: null, error: null, loading: false });

    const fetchData = useCallback(async () => {
        if (!path && cache.current[data]) {
            setRes({ data: cache.current[data], error: null, loading: false })
            return
        }
        setRes({ ...res, loading: true });
        let headers = { "content-type": "application/x-www-form-urlencoded; charset=UTF-8" }
        // if (typeof window !== "undefined" && window?.frappe?.csrf_token && window?.frappe?.csrf_token != 'None') {
        //     headers['X-Frappe-CSRF-Token'] = window?.frappe?.csrf_token
        // } else {
        //     headers['Authorization'] = config.token
        // }
        headers['Authorization'] = config.token
        try {
            let response = await fetch(baseURL + path, { "headers": headers, "body": data, "method": method })
            let res = await response.json()
            cache.current[data] = res
            setRes({ data: res, error: null, loading: false })
        } catch (error) {
            toast.error(error.message);
            setRes({ data: null, error, loading: false })
        }
    }, [res]);

    useEffect(() => {
        if (start) { fetchData(); }
    }, [start]);

    return res;
}


export function useGet(data) {
    const [start, setStart] = useState(false);
    const res = useFetch({ path: '', method: "POST", data, start });
    let value = { ...res, data: res?.data?.message }
    setTimeout(() => setStart(false), 0)
    return [value, setStart];
}


export function usePost(path, data) {
    const [start, setStart] = useState(false);
    const res = useFetch({ path: `/api/resource/${path}`, method: "POST", data: JSON.stringify(data), start });
    let value = { ...res, data: res?.data?.data }
    setTimeout(() => setStart(false), 0)
    return [value, setStart];
}

export function usePut(path, data) {
    const [start, setStart] = useState(false);
    const res = useFetch({ path: `/api/resource/${path}/${data.name}`, method: "PUT", data: JSON.stringify(data), start });
    let value = { ...res, data: res?.data?.data }
    setTimeout(() => setStart(false), 0)
    return [value, setStart];
}

export function useDelete(path, data) {
    const [start, setStart] = useState(false);
    const res = useFetch({ path: `/api/resource/${path}/${data.name}`, method: "DELETE", data: null, start });
    let value = { ...res, data: "OK" }
    setTimeout(() => setStart(false), 0)
    return [value, setStart];
}