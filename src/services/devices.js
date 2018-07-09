/**
 * @module "services.members"
 * @desc  This module provides a service for searching for Topcoder
 * members via API V3.
 */

/* global XMLHttpRequest */
import _ from 'lodash';
import qs from 'qs';
import logger from '../utils/logger';
import { setErrorIcon, ERROR_ICON_TYPES } from 'utils/errors';
import { getApiResponsePayloadV3 } from '../utils/tc';
import { getApiV3 } from './api';
import 'isomorphic-fetch';
/**
 * Service class.
 */
class DevicesService {
   constructor(tokenV3) {
    this.private = {
      api: getApiV3(tokenV3),
      tokenV3,
    };
  }


  async getDevices(handle, token) {
    console.log("Entering devices service with handle ", handle, "and token ", token);
    let res = await this.fetch(
           `http://local.topcoder-dev.com/v3/members/${handle}/traits?traitIds=device`,{
             headers: {
               'Content-Type': 'application/json',
               'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJhZG1pbmlzdHJhdG9yIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLWRldi5jb20iLCJoYW5kbGUiOiJoZWZmYW4iLCJleHAiOjE3NjYyODkyNDYsInVzZXJJZCI6IjEzMjQ1NiIsImlhdCI6MTQ1MDkyOTI0NiwiZW1haWwiOm51bGwsImp0aSI6IjEzNjljNjAwLWUwYTEtNDUyNS1hN2M3LTU2YmU3ZDgxM2Y1MSJ9.hp5peSoj-fh3KFkskvBpfUFIcJNtsv4zIMFV-D8F3JA'
             }
           }
         );
         console.log("Response devices", res);
         if (!res.ok) throw new Error(res.statusText);
             if (res.status !== 200) throw new Error(res.content);
             return res.json();
  }
  async updateDevices(device, handle) {
    console.log("Updated devices/devices services: ", device);
    const res = await this.private.api.putJsonLocal(`http://local.topcoder-dev.com/v3/members/${handle}/traits`, { param: [device] });
    return getApiResponsePayloadV3(res);
  }
  fetch(endpoint, options = {}) {

    console.log("endpoint ===>>>> " + endpoint);

    const headers = options.headers ? _.clone(options.headers) : {};
    return fetch(`${endpoint}`, { ...options,
      headers,
    })
    .catch((e) => {
      setErrorIcon(ERROR_ICON_TYPES.NETWORK, `${endpoint}`, e.message);
      throw e;
    });
  }
  
 
}
let lastInstance = null;
export function getService(tokenV3) {
  if (!lastInstance || tokenV3 !== lastInstance.private.tokenV3) {
    lastInstance = new DevicesService(tokenV3);
  }
  return lastInstance;
}

/* Using default export would be confusing in this case. */
export default undefined;