# Query Parser

Purpose: Add ability for the user to modify "free-form" query 

```
node main.js 'test  test shop:aaaa sale:1 -free_delivery:true test:MIAB-2415 test:MIAB-7777'
node main.js 'delivery:free discount:true ean:11111 test search'
node main.js 'delivery:free discount:true brand:sony'
node main.js 'delivery:free -brand:samsung tv on sale'
node main.js 'cheap tv -brand:samsung'
```

Restricted modifiers (for the authorized ppl only ???)

* feed:blahhhh
* campaign:blahhhh
* product:blahhhh
* family:blahhhh



