export const REQUESTS = [
    'active_symbols',
    'authorize',
    'balance',
    'buy',
    'proposal',
    'proposal_open_contract',
    'transaction',
    'ticks_history',
    'history',
];

interface IAPIMiddlewareConfig {
    [key: string]: any;
}

interface IRequest {
    [key: string]: any;
}

interface IResponse {
    [key: string]: any;
}

class APIMiddleware {
    config: IAPIMiddlewareConfig;
    debounced_calls: Record<string, any>;

    constructor(config: IAPIMiddlewareConfig) {
        this.config = config;
        this.debounced_calls = {};
    }

    getRequestType = (request: IRequest): string | undefined => {
        let req_type: string | undefined;
        REQUESTS.forEach(type => {
            if (type in request && !req_type) req_type = type;
        });

        return req_type;
    };

    defineMeasure = (res_type: string): Date | false => {
        if (res_type) {
            let measure: PerformanceMeasure;
            if (res_type === 'history') {
                performance.mark('ticks_history_end');
                measure = performance.measure('ticks_history', 'ticks_history_start', 'ticks_history_end');
            } else {
                performance.mark(`${res_type}_end`);
                measure = performance.measure(`${res_type}`, `${res_type}_start`, `${res_type}_end`);
            }
            return new Date(Date.now() - measure.startTime);
        }
        return false;
    };

    sendIsCalled = ({ response_promise, args: [request] }: { response_promise: Promise<IResponse>; args: [IRequest] }): Promise<IResponse> => {
        const req_type = this.getRequestType(request);
        if (req_type) performance.mark(`${req_type}_start`);
        response_promise
            .then(res => {
                const res_type = this.getRequestType(res);
                if (res_type) {
                    this.defineMeasure(res_type);
                }
            })
            .catch(() => {
                // Silent catch
            });
        return response_promise;
    };
}

export default APIMiddleware;
