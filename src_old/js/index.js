import $ from 'jquery'
import 'angular'

import init from './init'
import misc from './misc'
import worker from './worker'
import dom from './dom'
import ajax from './ajax'
import map_location from './map_location'

import './services'

/*
require.config({
    baseUrl: 'node_modules/',
    paths: {
        jquery: 'jquery/dist/jquery.min.js',
        angular: 'angular/angular.js',
        facebook: 'facebook/debug.js',
        //facebook: '//connect.facebook.net/en_US/sdk/all.js'
    },
    shim: {
        angular: {
            deps: ['jquery'],
            exports: "angular"
        },
        facebook: {
            exports: 'FB'
        }
    },
});
    */