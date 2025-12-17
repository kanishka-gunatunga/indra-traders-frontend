/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState, useMemo} from 'react';

export type CartItem = {
    id: number | string;
    name: string;
    type: 'Package' | 'Repair' | 'Maintenance' | 'Paint' | 'Inspection' | 'AddOn';
    price: number;
    originalData?: any;
};

export type PromoDetails = {
    code: string;
    discountType: 'FIXED' | 'PERCENTAGE';
    amount: number;
    applicableTypes: string[];
};

export const useServiceCart = () => {
    const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);

    const [activePromos, setActivePromos] = useState<PromoDetails[]>([]);

    const addItem = (item: CartItem) => {
        setSelectedItems((prev) => {
            if (prev.find((i) => i.id === item.id && i.type === item.type)) return prev;
            return [...prev, item];
        });
    };

    const removeItem = (id: number | string, type: string) => {
        setSelectedItems((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
    };

    const isSelected = (id: number | string, type: string) => {
        return !!selectedItems.find((i) => i.id === id && i.type === type);
    };

    const addPromo = (newPromo: PromoDetails) => {
        setActivePromos((prev) => {
            const filtered = prev.filter(p =>
                !p.applicableTypes.some(t => newPromo.applicableTypes.includes(t))
            );
            return [...filtered, newPromo];
        });
    };

    const removePromo = (code: string) => {
        setActivePromos(prev => prev.filter(p => p.code !== code));
    };

    const totals = useMemo(() => {
        const subTotal = selectedItems.reduce((sum, item) => sum + item.price, 0);
        let totalDiscount = 0;

        activePromos.forEach((promo) => {
            const eligibleItems = selectedItems.filter(item =>
                promo.applicableTypes.includes("ALL") || promo.applicableTypes.includes(item.type)
            );

            const eligibleTotal = eligibleItems.reduce((sum, item) => sum + item.price, 0);

            let discountAmount = 0;
            if (eligibleTotal > 0) {
                if (promo.discountType === 'FIXED') {
                    discountAmount = Math.min(promo.amount, eligibleTotal);
                } else {
                    discountAmount = (eligibleTotal * promo.amount) / 100;
                }
            }

            totalDiscount += discountAmount;
        });

        totalDiscount = Math.min(totalDiscount, subTotal);
        const total = subTotal - totalDiscount;

        return {subTotal, discount: totalDiscount, total};
    }, [selectedItems, activePromos]);

    const groupedItems = useMemo(() => {
        return {
            packages: selectedItems.filter(i => i.type === 'Package'),
            repairs: selectedItems.filter(i => i.type === 'Repair'),
            paints: selectedItems.filter(i => i.type === 'Paint'),
            maintenance: selectedItems.filter(i => i.type === 'Maintenance'),
            addOns: selectedItems.filter(i => i.type === 'AddOn'),
        };
    }, [selectedItems]);

    const getPromoForType = (type: string): PromoDetails | undefined => {
        return activePromos.find(p => p.applicableTypes.includes(type) || p.applicableTypes.includes("ALL"));
    };

    return {
        selectedItems,
        addItem,
        removeItem,
        isSelected,
        groupedItems,
        totals,
        activePromos,
        addPromo,
        removePromo,
        getPromoForType
    };
};