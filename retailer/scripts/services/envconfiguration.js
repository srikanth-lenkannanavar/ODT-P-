'use strict';

app.service('envconfig', function () {

    var _environments = {
        local: {
            config: {
                /**
                 * Add any config properties you want in here for this
                 * environment
                 */

                host: 'http://localhost/MyDeliveryPortal',
                home: 'http://localhost/retailer',
                homeNonSsl: 'http://localhost/app',
                retailerHome: '',
                consumerHome: '',
                appId: '',
                payment: ''
            }
        },
        test: {
            config: {
                /**
                 * Add any config properties you want in here for this
                 * environment
                 */
                host: 'http://115.114.37.43/MyDeliveryPortal',
                home: 'http://115.114.37.43/app',
                homeNonSsl: 'http://115.114.37.43/app',
                retailerHome: '',
                consumerHome: '',
                appId: '',
                payment: ''
            }
        },
        uat: {
            config: {
                /**
                 * Add any config properties you want in here for this
                 * environment
                 */
                host: 'http://ec2-54-154-162-107.eu-west-1.compute.amazonaws.com/MyDeliveryPortal',
                home: 'http://ec2-54-154-162-107.eu-west-1.compute.amazonaws.com/retailer',
                homeNonSsl: 'http://ec2-54-154-162-107.eu-west-1.compute.amazonaws.com/retailer',
                retailerHome: 'http://ec2-54-154-162-107.eu-west-1.compute.amazonaws.com/retailer',
                consumerHome: 'http://ec2-54-154-162-107.eu-west-1.compute.amazonaws.com/app',
                appId: '446943715454288',
                payment: 'https://hpp.sandbox.realexpayments.com/pay'
            }
        },
        dev: {
            config: {
                /**
                 * Add any config properties you want in here for this
                 * environment
                 */

                host: 'http://ec2-54-77-96-65.eu-west-1.compute.amazonaws.com/MyDeliveryPortal',
                home: 'http://ec2-54-77-96-65.eu-west-1.compute.amazonaws.com/retailer',
                homeNonSsl: 'http://ec2-54-77-96-65.eu-west-1.compute.amazonaws.com/retailer',
                retailerHome: 'http://ec2-54-77-96-65.eu-west-1.compute.amazonaws.com/retailer',
                consumerHome: 'http://ec2-54-77-96-65.eu-west-1.compute.amazonaws.com/app',
                appId: '121921974827286',
                payment: 'https://hpp.sandbox.realexpayments.com/pay'
            }
        },
        prod: {
            config: {
                /**
                 * Add any config properties you want in here for this
                 * environment
                 */
                host: 'https://www.onthedot.co.uk/MyDeliveryPortal',
                home: 'https://www.onthedot.co.uk/retailer',
                homeNonSsl: 'http://www.onthedot.co.uk/retailer',
                retailerHome: 'https://www.onthedot.co.uk/retailer',
                consumerHome: 'https://www.onthedot.co.uk/app',
                appId: '1575137759428947',
                payment: 'https://hpp.realexpayments.com/pay'
            }
        },
        sandbox: {
            config: {
                /**
                 * Add any config properties you want in here for this
                 * environment
                 */
                host: 'https://retailer.onthedot.com/MyDeliveryPortal',
                home: 'https://retailer.onthedot.com/retailer',
                homeNonSsl: 'https://retailer.onthedot.com/retailer',
                retailerHome: 'https://retailer.onthedot.com/retailer',
                consumerHome: 'https://www.onthedot.co.uk/app',
                appId: '1575137759428947',
                payment: 'https://hpp.sandbox.realexpayments.com/pay'
            }
        }
    }, _environment;

    return {
        get: function (property) {
            return _environments['dev'].config[property];
        }
    };
});