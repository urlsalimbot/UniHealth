import { useEffect, useState } from 'react';

export interface Barangay {
    code: string;
    name: string;
}

export interface PsgcData {
    region: { code: string; name: string };
    province: { code: string; name: string };
    city_municipality: { code: string; name: string };
    barangays: Barangay[];
}

export default function usePsgcData() {
    const [psgc, setPsgc] = useState<PsgcData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/data/psgc.json')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to load PSGC data');
                return res.json();
            })
            .then((data) => setPsgc(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { psgc, loading, error };
}
