
const { chromium } = require('playwright');

const sleep = time => new Promise(resolve => {setTimeout(resolve, time)});

//Login Liberty
async function login(browser, page, dato, user, pass){
    try {
        await page.goto(dato.ruta_loguin);  //voy a la ruta indicada
        if( dato.boton_acepto_cookies ){  // si la paguna tiene un modal de uso de cookies
            await page.click('text='+ dato.boton_acepto_cookies ); // doy clic en el boton con las propiedades indicadas
            await sleep(1000);  //demora de 3000ms
        } 
        await page.fill('input[id="' + dato.id_user + '"]', user); // busco los campos indicados y los lleno con la informacion suministrada
        await page.fill('input[id="' + dato.id_pass + '"]', pass); // busco los campos indicados y los lleno con la informacion suministrada
        await page.click('text='+ dato.boton_login );    // doy clic en el boton con las propiedades indicadas

        return { status: 200, message: "Logueado con éxito", data: []}

    } catch (error) {
        await browser.close(); //cierro navegador
        console.log(error)
        return { status: 400, message: "Error: Tiempo de ejecución, algun parametro no ha sido encontrado", data: []}
    }
}

// loguea y lista nuevos espedientes
async function listaExp( dato, user, pass ){
    return (async () => {
        // inicio navegador
        const browser = await chromium.launch( { ignoreHTTPSErrors: true, headless: false } );    //abre el navegador con las propiedades descritas 
        const context = await browser.newContext(); // usa el modo incognito
        const page = await context.newPage();   //abre una nueva paguina del navegado

        // logueo completo
        await login(browser, page, dato, user, pass);

        await sleep(2000);  //demora de 2000ms
        let url = await page.url();
        if( url != dato.link_exps){
            await browser.close();      //cierro navegador
            return { status: 400, message: "Error: Ha ocurrido un error en el login revise el Usuario y el Password", data: [] }
        }

        // mapeo la lista de expedientes nuevos
        let mapeo = dato.mapeo_lista;
        let array_mapeo = mapeo.split('||');
        let wait = array_mapeo[0];
        let map = array_mapeo[1];
    
        try{
            await page.waitForSelector(wait);
            const lista = await page.$$eval(map, (spans) => spans.map((span) => span.textContent));

            if( lista.length == 0 ){
                await browser.close();      //cierro navegador
                return { status: 200,  message: "No hay expedientes nuevos", data: [] }
            }

            await browser.close();      //cierro navegador
            return { status: 200, message: "La consulta ha sido exitosa", data: lista  }

        }catch (error) {
            await browser.close();      //cierro navegador
            if (error instanceof playwright.errors.TimeoutError) {
                return { status: 400, message: "Error: ocurrio un error al intentar mapear la lista de expedientes", data: []  }
            }
        }
    })();
}

//loguea y mapea data de un expediente para formar una XML
async function XMLexp( dato, user, pass, exp){
    return (async () => {
        // Inicio navegador
        const browser = await chromium.launch( { ignoreHTTPSErrors: true, headless: false } );    //abre el navegador con las propiedades descritas 
        const context = await browser.newContext(); // usa el modo incognito
        const page = await context.newPage();   //abre una nueva paguina del navegado

        // logueo completo
        await login(browser, page, dato, user, pass);

        await sleep(2000);  //demora de 2000ms
        let url = await page.url();
        if( url != dato.link_exps){
            await browser.close();      //cierro navegador
            return { status: 400, message: "Error: Ha ocurrido un error en el login revise el Usuario y el Password", data: [] }
        }

        //clic en el expedinete a consultar
        try {
            await page.click('text='+ exp );
        } catch (error) {
            await browser.close();      //cierro navegador
            console.log(error);
            return { status: 400, message: "No se pudo mapear el expediente", data: []  }
        }

        //mapeo de la data del expediente
        var mapeo = dato.mapeo_exp;
        var excepcion = dato.data_excluida;
        var array_mapeo = mapeo.split('||');        
        var array_excepcion = excepcion.split('||');
        var hash = {};
        var salto = 0;
        var get = "";
        try {
            for ( var  arraydoble of array_mapeo ) {
                var array = arraydoble.split('::');
                var data = array[0].replaceAll("\\n\\r", "").trim();
                var link = array[1];
                var cadena = 'boton';
    
                if( data.includes(cadena) ){
                    await page.click(link);
                }else{
                    salto = 1
                    array_excepcion.forEach(element => {
                        if( element.includes(data) ){ salto = 0;}
                    });

                    if( salto == 1 ){
                        get = await page.innerText(link);
                        hash[data] =  get;
                    }else{
                        get = "";
                        hash[data] = "";
                    }
                }
                await sleep(500);
                console.log(data + "   " + get);
            }
            await browser.close();      //cierro navegador
            return { status: 200, data: hash};
            //return { status: 200, message: "La consulta ha sido exitosa", data: hash  }
        } catch (error) {
            await browser.close();      //cierro navegador
            console.log( " Error : No se pudo mapear el expediente");
            return { status: 400, message: "No se pudo mapear el expediente", data: []  }
        }
    })();
}

async function ListaMensajes(data, user, pass){
    return (async () => {
        // inicio navegador
        const browser = await chromium.launch( { ignoreHTTPSErrors: true, headless: false } );    //abre el navegador con las propiedades descritas 
        const context = await browser.newContext(); // usa el modo incognito
        const page = await context.newPage();   //abre una nueva paguina del navegado

        // logueo completo
        await login(browser, page, data, user, pass);

        await sleep(3000);//demora de 2000ms
        let url = await page.url();
        if( url != data.link_exps){
            await browser.close();//cierro navegador
            return { status: 400, message: "Error: Ha ocurrido un error en el login revise el Usuario y el Password", data: [] }
        }

        await page.click('#row-nav-principal > div > div.col-component.col-cell.col-offset-0.col-9.col-tablet-0.col-mobile-0.horizontal-left.vertical-bottom.scroll-default.ov-default > div > ul > li:nth-child(3) > a');
        await sleep(3000);

        await page.mouse.down();
        
        // let resultado = await page.$$eval('body > div.libty > div > div:nth-child(1) > main > article > div > div > div > ul > li > div > div > div > article > header > div.col-component.col-cell.col-offset-0.col-9.col-tablet-9.col-mobile-0.horizontal-left.vertical-middle.scroll-default.ov-default > div > div.col-component.col-cell.col-offset-0.col-3.col-tablet-4.col-mobile-0.horizontal-left.vertical-bottom.scroll-default.ov-default > h1', (h1s) => h1s.map((h1) => h1.textContent));

        // return resultado

    
        // try{
        //     await page.waitForSelector(wait);
        //     const lista = await page.$$eval(map, (spans) => spans.map((span) => span.textContent));

        //     if( lista.length == 0 ){
        //         await browser.close();      //cierro navegador
        //         return { status: 200,  message: "No hay expedientes nuevos", data: [] }
        //     }

        //     await browser.close();      //cierro navegador
        //     return { status: 200, message: "La consulta ha sido exitosa", data: lista  }

        // }catch (error) {
        //     await browser.close();      //cierro navegador
        //     if (error instanceof playwright.errors.TimeoutError) {
        //         return { status: 400, message: "Error: ocurrio un error al intentar mapear la lista de expedientes", data: []  }
        //     }
        // }
    })();
}

module.exports = { listaExp, XMLexp, ListaMensajes};

//Lista mensaje de ubn expediente
// async function ListaMensajes(data, user, pass, exp, fecha_encargo){
//     // Inicio navegador
//     const browser = await chromium.launch( { ignoreHTTPSErrors: true, headless: false } );    //abre el navegador con las propiedades descritas 
//     const context = await browser.newContext(); // usa el modo incognito
//     const page = await context.newPage();   //abre una nueva paguina del navegado

//     try{
//         //login
//         const response = await login_sinexia( browser, page, data, user, pass);
//         if(response.status != 200){return await browser.close()}

//         //Buscar expediente
//         let busqueda = await buscarExpediente(browser, page, exp, fecha_encargo);
//         if(busqueda.status != 200) {await browser.close(); return busqueda}

//         frameObject = page.frame({ name: 'fraPrincipal' });
//         await frameObject.locator('#tabMensaje > a').click();

//         await sleep(2000);
//         let lista = await frameObject.$$eval('#gridbox > div.objbox > table > tbody > tr', (spans) => spans.map((span) => span.innerHTML));

//         lista.shift();
//         lista = lista.map(element => {
//             let cadena = element.split('<td align="left" valign="middle">');
//             cadena = cadena.map(item => item.substring(0, item.indexOf('</td>')));
//             return {codigo: cadena[1], tipo: cadena[2], origen: cadena[3], usuario: cadena[4], fecha: cadena[5]};
//         })

//         if( lista.length == 0 ){
//             await browser.close();
//             return { status: 200,  message: "No hay mensajes en este expediente", data: [] }
//         }

//         await browser.close();
//         return { status: 200, message: "La consulta ha sido exitosa", data: lista  }            

//     }catch(err){ await browser.close() }
// }