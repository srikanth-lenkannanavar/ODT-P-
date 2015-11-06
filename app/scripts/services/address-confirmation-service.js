/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('app').factory("AddressConfirmationService", function () {
    var addConfService = {
        getColletion: function () {
            var items =[
            	 
            
                {
                	"referencenumber":"1234",
                    "itemdesc": "item description",
                    "itemvalue": "item value",
                    "cardholder": "name of cardholder",
                    "instruction": "other instructions",
                    "display": 1
                },
                 
                {
                	"referencenumber":"12345",
                    "itemdesc": "item description2",
                    "itemvalue": "item value2",
                    "cardholder": "name of cardholder2",
                    "instruction": "other instructions2",
                    "display": 2
                }
            
       ];


            
            //items = [{}];
            return items;
        }
    };
    return addConfService;
});
