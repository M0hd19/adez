import { List, Map } from 'immutable';

/**
Below are the list of events we can register to listen to :
 
-bot.running : Emitted in trade/index.js, in old Binary Bot this is only used
to set the label to is running.

-bot.stop: Bot was stopped by the user

-bot.contract: Called in OpenContract.js, object consisting of
accountID and a proposal_open_contract response, this will
be emitted on each POC message from the server.

-bot.info: Emitted in trade/Balance.js, it announces account ID and balance,
we don't need this in DerivBot. Can also be emitted during running
contract, it then announces an object consisting of accountID,
total_runs, transaction_ids, contract_type, and buy_price.

-contract.status:  First emitted in trade/Purchase.js with an idea that's more
of a flag e.g. contract_purchase_sent (when buy was sent to
API, or contract_purchase_recieved (when buy was acknowledged
by API), or contract.sold (when a contract was sold/expired).

-contract.settled: this event was emitted to initiate a
settlement of a contract, i.e. it would call proposal_open_contract to retrieve
latest values for contract, not required atm by DerivBot

-googledrive.authorise : event to start auturize google flow

-ui.log.success: UI Notifications

-ui.log.error: UI errors

-ui.log.warn: UI warning

-Notify: Server Notifications

-Error : Server errors

 */

interface IAction {
    action: (...args: any[]) => void;
    searchBy: (...args: any[]) => void;
}

interface IUnregisterIfError {
    type: string;
    unregister: (string | [string, (...args: any[]) => void])[];
}

export default class Observer {
    eam: Map<string, List<IAction>>;
    state?: Record<string, any>;

    constructor() {
        this.eam = new Map(); // event action map
    }

    register(
        event: string,
        _action: (...args: any[]) => void,
        once?: boolean,
        unregisterIfError?: IUnregisterIfError,
        unregisterAllBefore?: boolean
    ) {
        if (unregisterAllBefore) {
            this.unregisterAll(event);
        }
        const apiError = (error: any) => {
            if (error.type === unregisterIfError?.type) {
                this.unregister('api.error', apiError);
                unregisterIfError.unregister.forEach(unreg => {
                    if (unreg instanceof Array) {
                        this.unregister(unreg[0], unreg[1]);
                    } else {
                        this.unregisterAll(unreg);
                    }
                });
            }
        };
        if (unregisterIfError) {
            this.register('api.error', apiError);
        }
        const action = (...args: any[]) => {
            if (once) {
                this.unregister(event, _action);
            }
            if (unregisterIfError) {
                this.unregister('api.error', apiError);
            }
            _action(...args);
        };

        const actionList = this.eam.get(event);

        this.eam = actionList
            ? this.eam.set(event, actionList.push({ action, searchBy: _action }))
            : this.eam.set(event, new List().push({ action, searchBy: _action }));
    }

    unregister(event: string, f: (...args: any[]) => void) {
        this.eam = this.eam.set(
            event,
            this.eam.get(event)?.filter(r => r.searchBy !== f) || new List()
        );
    }

    isRegistered(event: string): boolean {
        return this.eam.has(event);
    }

    unregisterAll(event: string) {
        this.eam = this.eam.delete(event);
    }

    emit(event: string, data?: any) {
        if (this.eam.has(event)) {
            this.eam.get(event)?.forEach(action => action.action(data));
        }
    }

    setState(state: Record<string, any> = {}) {
        this.state = { ...this.state, ...state };
    }

    getState(key: string) {
        return this.state?.[key];
    }
}

export const observer = new Observer();
