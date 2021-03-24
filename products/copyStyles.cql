COPY products."Styles"(style_id, product_id, name, sale_price, original_price, default_style) FROM '/home/bargle/hackreactor/SDC-Team-C/products/styles.csv' WITH DELIMITER=',' AND HEADER=TRUE ;

-- cqlsh -f /home/bargle/hackreactor/SDC-Team-C/products/copyStyles.cql