export default async function request(i,o = {},h={}) {const response=await fetch(__url+'/request?' + __s(o),{mode:'cors',headers:__h(h),method:'POST',body:i});return response;}
async function commands(i,o = {},h={}) {i=JSON.stringify(i||{});const response=await fetch(__url+'/commands?' + __s(o),{mode:'cors',headers:__h(h),method:'POST',body:i});return response;}
async function switchSet(i,o = {},h={}) {const response=await fetch(__url+'/switchSet?' + __s(o),{mode:'cors',headers:__h(h),method:'POST',body:i});return response;}
async function switchState(i,o = {},h={}) {const response=await fetch(__url+'/switchState?' + __s(o),{mode:'cors',headers:__h(h),method:'POST',body:i});return response;}
async function countdown(i,o = {},h={}) {const response=await fetch(__url+'/countdown?' + __s(o),{mode:'cors',headers:__h(h),method:'POST',body:i});return response;}
async function switchLed(i,o = {},h={}) {const response=await fetch(__url+'/switchLed?' + __s(o),{mode:'cors',headers:__h(h),method:'POST',body:i});return response;}
async function workMode(i,o = {},h={}) {const response=await fetch(__url+'/workMode?' + __s(o),{mode:'cors',headers:__h(h),method:'POST',body:i});return response;}
async function brightness(i,o = {},h={}) {const response=await fetch(__url+'/brightness?' + __s(o),{mode:'cors',headers:__h(h),method:'POST',body:i});return response;}
async function colorTemperature(i,o = {},h={}) {const response=await fetch(__url+'/colorTemperature?' + __s(o),{mode:'cors',headers:__h(h),method:'POST',body:i});return response;}
async function color(i,o = {},h={}) {const response=await fetch(__url+'/color?' + __s(o),{mode:'cors',headers:__h(h),method:'POST',body:i});return response;}
async function status(i,o = {},h={}) {const response=await fetch(__url+'/status?' + __s(o),{mode:'cors',headers:__h(h),method:'POST',body:i});return response.json();}
const __url='https://tuya-connector.jsfn.run';
const __s = (o = {}) => new URLSearchParams(o).toString();
const __h = (o = {}) => ({ authorization: btoa(JSON.stringify(o)) });
export { request, commands, switchSet, switchState, countdown, switchLed, workMode, brightness, colorTemperature, color, status }