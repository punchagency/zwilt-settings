import {IncomingMessage} from 'http'
import {GetStaticPropsContext, NextPageContext} from "next"

export interface CustomGetStaticPropsContext extends GetStaticPropsContext {
    req: {
        headers: IncomingMessage["headers"];
    };
    [key: string]: any;
}

export interface CustomPageContext extends NextPageContext {
    pageProps: {
        [key: string]: any;
    }
}
