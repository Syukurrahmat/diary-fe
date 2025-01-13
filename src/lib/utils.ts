import { UseFormReturnType } from "@mantine/form";
import { AxiosError } from "axios";
import moment, { Moment } from "moment";

export const getReverseCoordinateUrl = ({ lat, lng }: MyLatLng) => `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&zoom=13&normalizeaddress=0&oceans=1&accept-language=id&format=json`

export const filetoBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
});

export const relativeDay = (date: Date | Moment | string) => {
    const diff = moment().diff(date, 'day')
    return diff == 0 ? 'Hari Ini' : diff == 1 ? 'Kemaren' : diff == 2 ? 'Lusa' : moment(date).format('DD MMM YYYY')
}

export const qs = (json: Record<string, any>) => {
    return Object.keys(json)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(json[key]))
        .join('&');
};

export const getMotionSlideSectionProps = (key: string | number) => {
    const isMain = key === 0 || key === 'main';

    return {
        initial: {
            x: isMain ? '-100%' : '100%',
            opacity: 0,
        },
        exit: { x: isMain ? '-100%' : '100%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        transition: { duration: 0.3 },
        key
    };
};

export function getRandomItem<T>(array: T[]) {
    if (array.length === 0) throw new Error("Array tidak boleh kosong.");
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}


export const handlerFormValidationError = (
    axiosError: AxiosError<any, any>,
    form: UseFormReturnType<any>
) => {
    const messages = axiosError.response?.data?.message as string[];
    if (!Array.isArray(messages) || !messages.length) return;

    const errors = messages.reduce<Record<string, string[]>>(
        (acc, message) => {
            const field = message.split(' ')[0];
            if (!acc[field]) acc[field] = [];
            acc[field].push(message);
            return acc;
        },
        {}
    );

    Object.entries(errors).forEach(([field, messages]) => {
        form.setFieldError(field, messages.join(', '));
    });
};

export const getUserLocation = () => {
    return new Promise<MyLatLng | null>((res) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude: lat, longitude: lng } = pos.coords;
                res({ lat, lng });
            }, () => res(null));
        } else {
            res(null);
        }
    });
};

export const wait = (ms?: number) => new Promise(r => setTimeout(r, ms))

export function scrollToElementWithOffset(element: Element | HTMLDivElement | null, offset = 0) {
    if (!element) return
    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const targetPosition = rect.top + scrollTop - offset;

    window.scrollTo({
        top: targetPosition,
    });
}

import { useEffect, useRef, useState } from 'react';

interface UseInViewportOptions {
    root?: HTMLDivElement | null; // Root element to use for intersection checking
    rootMargin?: string;   // Margin around the root
    threshold?: number | number[]; // Intersection threshold(s)
    onVisible?: (entry: IntersectionObserverEntry) => void
}

export const useOnceInViewport = (
    options: UseInViewportOptions = {}
) => {
    const ref = useRef<HTMLDivElement>(null)

    const [onceInViewport, setIsInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (!onceInViewport) setIsInView(true)
                    if (options.onVisible) options.onVisible(entry)
                }
            },
            options
        );
        observer.observe(element);
        return () => {
            observer.disconnect();
        };
    }, [options, ref]);

    return { ref, onceInViewport };
}
