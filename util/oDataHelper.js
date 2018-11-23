import oData from 'odata';

oData().config({
  endpoint:'https://fiori.varucon.com/sap/opu/odata/sap/ZVPORTAL_SRV/',
  version: 2,
  isWithCredentials: true
});

export default oData;
