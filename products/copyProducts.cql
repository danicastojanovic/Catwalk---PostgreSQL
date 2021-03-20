COPY products."Products"(product_id, name, slogan, description, category, default_price) FROM '/home/bargle/hackreactor/SDC-Team-C/products/product.csv' WITH DELIMITER=',' AND HEADER=TRUE ;

-- cqlsh -f /home/bargle/hackreactor/SDC-Team-C/products/copyProducts.cql