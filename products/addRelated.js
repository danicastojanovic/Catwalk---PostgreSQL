const ExpressCassandra = require('express-cassandra');
const fs = require('fs');
var LineByLineReader = require('line-by-line');




module.exports = {
  init: (models) => {
    let prod = models.instance.Products;

    let header = false;
    let q = [];
    let counter = 0;

    lr = new LineByLineReader('/home/bargle/hackreactor/SDC-Team-C/products/related.csv');

    lr.on('line', function (line) {

      let row = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)

      if (!header) {
        header = !header
      } else {

        let id = +row[1]

        let u = prod.update(
          {product_id: id},
          {
            related_products:{'$add': [+row[2]]},
          },
          {return_query: true}
          )
          q.push(u)
          if (q.length > 1000) {
            lr.pause();

            models.doBatch(q, function(err){
            if(err) {
              console.error(err)
            } else {
              console.log('added?', counter++)
              q = [];
              lr.resume();
            }
          })
        }
      }
    });

    lr.on('end', (line) => {
      models.doBatch(q, function(err){
        if(err) {
          console.error(err)
        } else {
          console.log('complete', counter++)
          q = [];
        }
      })
    })
  }
}
