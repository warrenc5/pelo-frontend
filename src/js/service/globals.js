import * as buildTime1 from '../build'

export const globals = {
    buildTime: buildTime1.buildTime,
    AUTH: "login",
    APP_VERSION: 1.0,
    DB_VERSION: 1.1,
    debugFlag: true,
    peloBaseUrlMock: "http://dev.testpelo1.cc:8085/pelo/rest/view/",
    peloBaseUrlTryout: "http://dev.testpelo1.cc/pelo/rest/view/",
    peloBaseUrlLive: "http://app.pelo.cc/pelo/rest/view/",
    peloBaseUrlLocal: "http://localhost/pelo/rest/view/",
    peloBaseUrlWildflyLocal: "http://localhost:8080/pelo/rest/view/",
    peloBaseUrlMockLocal: "http://localhost:8085/pelo/rest/view/",
}
