if (typeof process === 'object') var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

class Client {
   constructor(baseUrl) {
      this.baseUrl = baseUrl + '/service';
   }

   getStatus() {
      return this._makeGetRequest('/status');
   }

   getWANStatus() {
      return this._makeGetRequest('/wan');
   }

   sendWANSettings(wanStatus) {
      return this._makePostRequest('/wan', wanStatus);
   }

   getDHCPStatus() {
      return this._makeGetRequest('/dhcp');
   }

   sendDHCPSettings(dhcpStatus) {
      return this._makePostRequest('/dhcp', dhcpStatus);
   }

   _makeGetRequest(endpoint) {
      const xmlHttp = new XMLHttpRequest();
      xmlHttp.open('GET', this.baseUrl + endpoint, false); // false for synchronous request
      xmlHttp.send(null);
      return JSON.parse(xmlHttp.responseText);
   }

   _makePostRequest(endpoint, data) {
      const xmlHttp = new XMLHttpRequest();
      xmlHttp.open('POST', this.baseUrl + endpoint, false); // false for synchronous request
      xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xmlHttp.send(JSON.stringify(data));
      return JSON.parse(xmlHttp.responseText);
   }
}

if (typeof process === 'object') module.exports = Client;

export default Client;
