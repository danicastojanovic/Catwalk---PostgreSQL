const ExpressCassandra = require('express-cassandra');
const fs = require('fs');
var LineByLineReader = require('line-by-line');


const addF = (models, dict) => {
  let style = models.instance.Styles;


  let header = false;
  let q = [];
  let counter = 0;

  lr = new LineByLineReader('/home/bargle/hackreactor/SDC-Team-C/products/skus.csv');

    lr.on('line', function (line) {
      let row = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)


      if (row[2].substr(0, 1) === '"' && row[2].substr(row[2].length - 1) === '"') {
        row[2] = row[2].substr(1, row[2].length - 2);
      }

      if (!header) {
        header = !header
      } else {

        let id = +row[1]
        let u = style.update(
          {
            product_id: dict[id],
            style_id: id
          },
          {
            sku_id:{'$add': [+row[0]]},
            sku_size:{'$add': [row[2]]},
            sku_quantity:{'$add': [+row[3]]},
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

module.exports = {
  init: (models) => {
    let style = models.instance.Styles;

    let dict = {};
    let header = false;

    prdSty = new LineByLineReader('/home/bargle/hackreactor/SDC-Team-C/products/styles.csv');

    prdSty.on('line', function (line) {
      let row = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)


      if (!header) {
        header = !header
      } else {
        dict[row[0]] = +row[1];
      }
    });

    prdSty.on('end', (line) => {
      addF(models, dict);
    })
  }
}
