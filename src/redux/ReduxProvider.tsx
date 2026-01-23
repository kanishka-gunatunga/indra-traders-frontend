"use client";

import {Provider} from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {store, persistor} from "./store";
import React from "react";
import RedSpinner from "@/components/RedSpinner";

export default function ReduxProvider({children}: { children: React.ReactNode }) {
    // return <Provider store={store}>{children}</Provider>;
    return (
        <Provider store={store}>
            <PersistGate loading={<div className="h-screen flex items-center justify-center">
                {/*<Spin size="large"/>*/}
                <RedSpinner/>
            </div>
            } persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}