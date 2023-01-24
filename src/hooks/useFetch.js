import { useCallback, useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import Config from "../common/Config";

const baseURL = process.env.REACT_APP_ENV == 'dev' ? Config.hostUrl : Config.hostUrl

export function useGetApi(path) {
    const [res, setRes] = useState({ data: null, error: null, isLoading: false });
    const callAPI = async () => {
        setRes(prevState => ({ ...prevState, isLoading: true }));
        setRes({ data: null, isLoading: false, error: null });
        let isMounted = true

        try {
            let headers = { "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "Authorization": Config.token }
            let response = await fetch(baseURL + path, { "headers": headers, "method": 'GET' })
            let res = await response.json()
            if (isMounted) {
                setRes({ data: res.message, isLoading: false, error: null });
            }
        } catch (err) {
            if (isMounted) {
                // toast.error(err.message);
                setRes({ data: null, isLoading: false, error: err.message });
            }
        }

        // let response = await getAllDataApi({ doctype: 'Item Group', fields: ['name'], token: Config.token })
        // if (isMounted && response.data) {
        //     setRes({ data: response, isLoading: false, error: null });
        // } else {
        //     setRes({ data: null, isLoading: false, error: response });
        // }
    }
    useEffect(() => {
        if (path) {
            callAPI()
        }
    }, [path])
    return res;
}

export function usePostApi(path, data) {
    const [res, setRes] = useState({ data: null, error: null, isLoading: false });

    // You POST method here
    const callAPI = async () => {
        setRes(prevState => ({ ...prevState, isLoading: true }));
        setRes({ data: null, isLoading: false, error: null });
        let isMounted = true
        try {
            let headers = { "content-type": "application/json" }
            if (typeof window !== "undefined" && window?.frappe?.csrf_token && window?.frappe?.csrf_token != 'None') {
                headers['X-Frappe-CSRF-Token'] = window?.frappe?.csrf_token
            } else {
                headers['Authorization'] = Config.token
            }
            let response = await fetch(baseURL + path, { "headers": headers, "body": data, "method": 'POST' })
            let res = await response.json()
            if (isMounted) {
                setRes({ data: res.message, isLoading: false, error: null });
            }
        } catch (err) {
            if (isMounted) {
                toast.error(err.message);
                setRes({ data: null, isLoading: false, error: err.message });
            }
        }
    }
    useEffect(() => {
        if (data) {
            callAPI()
        }
    }, [data])


    return res;
}