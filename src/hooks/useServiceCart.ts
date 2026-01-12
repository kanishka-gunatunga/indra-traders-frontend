// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useMemo } from 'react';
//
// export type CartItem = {
//     id: number | string;
//     name: string;
//     type: 'Package' | 'Repair' | 'Maintenance' | 'Paint' | 'Inspection' | 'AddOn';
//     price: number;
//     originalData?: any;
// };
//
// export type PromoDetails = {
//     code: string;
//     discountType: 'FIXED' | 'PERCENTAGE';
//     amount: number;
//     applicableTypes: string[]; // e.g. ["ALL"] or ["Repair", "Paint"]
// };
//
// export const useServiceCart = () => {
//     const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
//     // Changed from array to single object or null
//     const [activePromo, setActivePromo] = useState<PromoDetails | null>(null);
//
//     const addItem = (item: CartItem) => {
//         setSelectedItems((prev) => {
//             // Prevent duplicates
//             if (prev.find((i) => i.id === item.id && i.type === item.type)) return prev;
//             return [...prev, item];
//         });
//     };
//
//     const removeItem = (id: number | string, type: string) => {
//         setSelectedItems((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
//     };
//
//     const isSelected = (id: number | string, type: string) => {
//         return !!selectedItems.find((i) => i.id === id && i.type === type);
//     };
//
//     const applyPromo = (newPromo: PromoDetails) => {
//         setActivePromo(newPromo);
//     };
//
//     const removePromo = () => {
//         setActivePromo(null);
//     };
//
//     const totals = useMemo(() => {
//         const subTotal = selectedItems.reduce((sum, item) => sum + item.price, 0);
//         let discount = 0;
//
//         if (activePromo) {
//             // Calculate the total value of items eligible for this promo
//             const eligibleItems = selectedItems.filter(item =>
//                 activePromo.applicableTypes.includes("ALL") ||
//                 activePromo.applicableTypes.includes(item.type)
//             );
//
//             const eligibleTotal = eligibleItems.reduce((sum, item) => sum + item.price, 0);
//
//             if (eligibleTotal > 0) {
//                 if (activePromo.discountType === 'FIXED') {
//                     // Cannot discount more than the eligible amount
//                     discount = Math.min(activePromo.amount, eligibleTotal);
//                 } else {
//                     discount = (eligibleTotal * activePromo.amount) / 100;
//                 }
//             }
//         }
//
//         // Ensure total is not negative
//         const total = Math.max(0, subTotal - discount);
//
//         return { subTotal, discount, total };
//     }, [selectedItems, activePromo]);
//
//     const groupedItems = useMemo(() => {
//         return {
//             packages: selectedItems.filter(i => i.type === 'Package'),
//             repairs: selectedItems.filter(i => i.type === 'Repair'),
//             paints: selectedItems.filter(i => i.type === 'Paint'),
//             maintenance: selectedItems.filter(i => i.type === 'Maintenance'),
//             addOns: selectedItems.filter(i => i.type === 'AddOn'),
//         };
//     }, [selectedItems]);
//
//     return {
//         selectedItems,
//         addItem,
//         removeItem,
//         isSelected,
//         groupedItems,
//         totals,
//         activePromo, // Export single object
//         applyPromo,  // Replaced addPromo
//         removePromo
//     };
// };


/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from 'react-redux';
import { setBookingData, removeBookingItem } from "@/redux/slices/bookingSlice";
import { useMemo } from 'react';

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
    const dispatch = useDispatch();

    const { selectedServices, activePromo, totals } = useSelector((state: any) => state.booking);

    const selectedItems: CartItem[] = selectedServices || [];

    const calculateTotals = (items: CartItem[], promo: PromoDetails | null) => {
        const subTotal = items.reduce((sum, item) => sum + item.price, 0);
        let discount = 0;

        if (promo) {
            const eligibleItems = items.filter(item =>
                promo.applicableTypes.includes("ALL") ||
                promo.applicableTypes.includes(item.type)
            );

            const eligibleTotal = eligibleItems.reduce((sum, item) => sum + item.price, 0);

            if (eligibleTotal > 0) {
                if (promo.discountType === 'FIXED') {
                    discount = Math.min(promo.amount, eligibleTotal);
                } else {
                    discount = (eligibleTotal * promo.amount) / 100;
                }
            }
        }

        return {
            subTotal,
            discount,
            total: Math.max(0, subTotal - discount)
        };
    };

    // 2. DISPATCH TO REDUX
    const addItem = (item: CartItem) => {
        // Prevent duplicates
        if (selectedItems.find((i) => i.id === item.id && i.type === item.type)) return;

        const newItems = [...selectedItems, item];
        const newTotals = calculateTotals(newItems, activePromo);

        dispatch(setBookingData({
            selectedServices: newItems,
            totals: newTotals
        }));
    };

    const removeItem = (id: number | string, type: string) => {
        dispatch(removeBookingItem({ id, type }));
    };

    const isSelected = (id: number | string, type: string) => {
        return !!selectedItems.find((i) => i.id === id && i.type === type);
    };

    const applyPromo = (newPromo: PromoDetails) => {
        const newTotals = calculateTotals(selectedItems, newPromo);
        dispatch(setBookingData({
            activePromo: newPromo,
            totals: newTotals
        }));
    };

    const removePromo = () => {
        const newTotals = calculateTotals(selectedItems, null);
        dispatch(setBookingData({
            activePromo: null,
            totals: newTotals
        }));
    };

    const groupedItems = useMemo(() => {
        return {
            packages: selectedItems.filter(i => i.type === 'Package'),
            repairs: selectedItems.filter(i => i.type === 'Repair'),
            paints: selectedItems.filter(i => i.type === 'Paint'),
            maintenance: selectedItems.filter(i => i.type === 'Maintenance'),
            addOns: selectedItems.filter(i => i.type === 'AddOn'),
        };
    }, [selectedItems]);

    return {
        selectedItems,
        addItem,
        removeItem,
        isSelected,
        groupedItems,
        totals,
        activePromo,
        applyPromo,
        removePromo
    };
};