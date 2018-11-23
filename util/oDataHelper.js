import oData from 'odata';

oData().config({
  endpoint:'http://192.168.2.17:8000/sap/opu/odata/sap/ZVPORTAL_SRV/',
  version: 2,
  isWithCredentials: true
});

export default oData;
