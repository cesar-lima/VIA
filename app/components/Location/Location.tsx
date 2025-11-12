"use client"
import './style.css'

import { useEffect, useState } from 'react'

import { MapPin } from 'lucide-react'

export default function Location() {
    const [address, setAddress] = useState('Permita o acesso à sua localização.');
    const [loadingAddress, setLoadingAddress] = useState(false);

    useEffect(() => {
        if (!navigator.geolocation) return;

        setLoadingAddress(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();

                    // Extrai apenas rua, bairro e estado (com fallback se indisponível)
                    const addr = data?.address || {};
                    const street = addr.road || addr.pedestrian || addr.cycleway || addr.footway || addr.house_number || null;
                    const neighbourhood = addr.neighbourhood || addr.suburb || addr.city_district || addr.village || addr.hamlet || null;
                    const state = addr.state || addr.state_code || addr.county || null;

                    const parts: string[] = [];
                    if (street) parts.push(street);
                    if (neighbourhood) parts.push(neighbourhood);

                    const formatted = parts.length > 0
                        ? `${parts.join(', ')}${state ? ` - ${state}` : ''}`
                        : (data?.display_name || '');

                    if (formatted) setAddress(formatted);
                } catch (err) {
                    // erro silencioso — manter endereço padrão
                } finally {
                    setLoadingAddress(false);
                }
            },
            (err) => {
                setLoadingAddress(false);
                // usuário negou ou erro — manter endereço padrão
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);

    return (
        <div className="address">
            <MapPin color="#f0e7d5" />

            <div>
                {loadingAddress ? 'Obtendo localização...' : address}
            </div>
        </div>
    )
}