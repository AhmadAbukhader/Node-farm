const http = require('http');
const fs = require('fs');
const url = require('url')
const slugify = require('slugify')
const replaceTemplate = require('./modules/replaceTemplate')


/*
//blocking , sync 
const textIn =  fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);
const textOut = `This is what we know abiut the avocado : ${textIn}.\n Creted on ${Date.now()}`
fs.writeFileSync('./txt/output.txt', textOut); 
 console.log('File written !');

//non blocking , async 
fs.readFile('./txt/start.txt','utf-8'  , (err , data1) => {
     if(err) return console.log('ERRORRRRRRRR');

    fs.readFile(`./txt/${data1}.txt`,'utf-8'  , (err , data2) => {
        console.log(data2);
        fs.readFile(`./txt/append.txt`,'utf-8'  , (err , data3) => {
            console.log(data3);
            fs.writeFile('./TXT/final.txt' ,`${data2}\n${data3}` , 'utf-8' , err =>{
                console.log('your file has been written');
            })
        })
    })
})
console.log('Will read file ');*/

/////////////////////////////////////////////////////////////////
//SERVER 


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObject = JSON.parse(data)

const slugs = dataObject.map(el => slugify(el.productName, { lower: true }))
console.log(slugs)

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true)

    // const pathName = req.url

    //overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' })

        const cardsHtml = dataObject.map(el => replaceTemplate(tempCard, el)).join('')
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        res.end(output)
    }
    //product page 
    else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' })
        const product = dataObject[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.end(output)
    }
    //Api
    else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(data)

        //Not Found         
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'helo-word'
        });
        res.end('<h1>page not found<h1>')
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening is requests on port 8000');
})

