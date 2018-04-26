// TODO: Implement JSONata
// //var jsonata = require("jsonata");
// import * as jsonata from 'jsonata';

// import { Injectable } from '@angular/core';

// @Injectable()
// export class Jsonata
// {
//     filter(query: string, item: any, data: any): boolean
//     {
//         let expression = jsonata(query);
//         let result = expression.evaluate(data);

//         let itemMatch = false;

//         query.forEach(q => {
//             //console.log("  q:", q);

//             if (q.type == "or")
//             {
//                 q.filters.forEach(filter => {

//                 //console.log("     filter:", filter);

//                 //if (filter.op == "eq")
//                 if (true)
//                 {
//                     //console.log("   data:", data);

//                     let matches;

//                     let testItem = item[filter.prop];
//                     const matchAgainst: any = this.template.parseTpl(filter.filterBinding, data, matches);


//                   //console.log(" testItem: ", testItem, " matchAgainst: ", matchAgainst);

//                   // console.log(`     filterItem:"`, filterItem,
//                   //   '",typeof filterItem:', typeof filterItem, " _.isNil(filterItem):", _.isNil(filterItem),
//                   //   " _.isEmpty(filterItem):", _.isEmpty(filterItem),
//                   //   " filterItem.length:", filterItem.length
//                   // );

//                   //if (filterItem == null || filterItem == undefined || typeof filterItem === 'undefined')
//                   //if (!filterItem || _.isNil(filterItem) || _.isEmpty(filterItem) || filterItem == "" || filterItem.length <= 0)
//                   if (matchAgainst === "undefined")
//                   {
//                     //console.log("filterItem == undefined");
//                     itemMatch = true;
//                   }
//                   else
//                   {
//                     let testItemType = typeof testItem;
//                     let matchAgainstConverted;

//                     if (testItemType === "string")
//                     {
//                         //TODO: setting for case sensitive
//                         if (true)
//                         {
//                             testItem = testItem.toLowerCase();
//                             matchAgainstConverted = matchAgainst.toLowerCase();
//                         }
//                         //TODO: Finish
//                         // else
//                         // {
//                         //     matchAgainstConverted = matchAgainst;
//                         // }
//                     }
//                     else if (testItemType === "number")
//                     {
//                         //matchAgainstConverted = Number(matchAgainst);
//                         matchAgainstConverted = +matchAgainst;
//                     }

//                     //console.log(` testItemType: ${testItemType}`, " typeof matchAgainstConverted:", typeof matchAgainstConverted);

//                     //console.log("filterItem != undefined");
//                     if (filter.op === "eq" && testItem === matchAgainstConverted)
//                     {
//                       //console.log(`       item[${filter.prop}] === data.${filter.filterBinding}`);
//                       itemMatch = true;
//                     }
//                     else if (filter.op === "like" && typeof testItem === "string" && testItem.indexOf(matchAgainstConverted) >= 0)
//                     {
//                       itemMatch = true;
//                     }
//                     else
//                     {
//                       //console.log(`       item[${filter.prop}]: ${item[filter.prop]} !== data.${filter.filterBinding}: ${filterItem}`);
//                     }

//                     //console.log("testItem: ", testItem, "matchAgainstConverted: ", matchAgainstConverted, "filter.op:", filter.op, "itemMatch: ", itemMatch);
//                   }
//                 }
//                 else
//                 {
//                   //console.log(`      filter.op = ${filter.op}`);
//                 }
//               })
//             }
//             else
//             {
//               //console.log(`      q.type = ${q.type}`);
//             }
//           });

//           return itemMatch;
//     }
// }