const fs = require('fs');
const http = require('http');
const url = require('url');

/*const input = fs.readFileSync('./text/innertest/input.txt','utf-8');
console.log(input);

const textout = `The file content from input.txt id ${input}\nEnd o file`;
fs.writeFileSync('./text/innertest/output.txt', textout); */

/* fs.readFile('./text/innertest/input.txt','utf-8', (err,data)=>{
    
    fs.writeFile('./text/innertest/output.txt', `${data}`,'utf-8',(err)=>{
        console.log(`wittern sucessfully`);
    });

    console.log(data);
})
console.log("File reading"); */
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const productData = JSON.parse(data);

const replaceContent = (temp , product)=>{
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  
  if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
};

const server = http.createServer((req,res)=>{
    //const pathname = req.url;
    const {query, pathname} = url.parse(req.url,true);
    console.log(url.parse(req.url,true));

    // home page
    if (pathname === '/' || pathname === '/overview'){
        res.writeHead(200,{'Content-type': 'text/html'})
        const cardHtml = productData.map(el => replaceContent(tempCard, el)).join(' ');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardHtml);
        res.end(output);
    }

    // idividual product page
    else if (pathname==='/product'){
        res.writeHead(200,{'Content-type':'text/html'});
        const product = productData[query.id];
        const output = replaceContent(tempProduct,product);
        res.end(output);
    }

    // error page
    else{
        res.writeHead(404,{'Context-type':'text/html'});
        res.end('<h1>Page Not Found</h1>');
    }
    
});

server.listen(8000,'127.0.0.1',()=>{
    console.log("Listening to server...");
});