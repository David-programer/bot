
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
        const browser = await chromium.launch( { ignoreHTTPSErrors: true, headless: true } );    //abre el navegador con las propiedades descritas 
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
async function XMLexp(dato, user, pass, exp){
    return (async () => {
        // Inicio navegador
        const browser = await chromium.launch( { ignoreHTTPSErrors: true, headless: true } );    //abre el navegador con las propiedades descritas 
        const context = await browser.newContext(); // usa el modo incognito
        const page = await context.newPage();   //abre una nueva paguina del navegado

        // logueo completo
        await login(browser, page, dato, user, pass);

        await sleep(2000);  //demora de 2000ms
        let url = await page.url();

        // if( url != dato.link_exps){
        //     await browser.close();      //cierro navegador
        //     return { status: 400, message: "Error: Ha ocurrido un error en el login revise el Usuario y el Password", data: [] }
        // }

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
        const browser = await chromium.launch( { ignoreHTTPSErrors: true, headless: true } );    //abre el navegador con las propiedades descritas 
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
                
        let resultado = await page.$$eval('body > div.libty > div > div:nth-child(1) > main > article > div > div > div > ul > li > div > div > div > article > header > div.col-component.col-cell.col-offset-0.col-9.col-tablet-9.col-mobile-0.horizontal-left.vertical-middle.scroll-default.ov-default > div > div.col-component.col-cell.col-offset-0.col-3.col-tablet-4.col-mobile-0.horizontal-left.vertical-bottom.scroll-default.ov-default > h1', (h1s) => h1s.map((h1, index) => h1.textContent ));

        resultado.forEach((value, index)=> {
            setTimeout(async () => {
                await page.click(`#home-mensaje-${index}`);
                if(index + 1 == resultado.length){
                    await page.click('#encargo-detalle-mensajes-header-buttons > ul > li > div > a');
                    await page.click('#encargo-detalle-mensajes-header-buttons > ul > li > div > ul > li:nth-child(2) > a');
                    await sleep(2000);
                    await browser.close(); //cierro navegador
                }
            }, 300 + Number(`${index}00`));
        })

        return { status: 200, message:  `¡Se ha generado la información!`, data: resultado}
    })();
}

async function ListarMensajesExpediente(data, user, pass, exp){
    return (async () => {
        // inicio navegador
        const browser = await chromium.launch( { ignoreHTTPSErrors: true, headless: true } );    //abre el navegador con las propiedades descritas 
        const context = await browser.newContext(); // usa el modo incognito
        const page = await context.newPage();   //abre una nueva paguina del navegado

        // logueo completo
        await login(browser, page, data, user, pass);

        await sleep(5000);//demora de 2000ms
        let url = await page.url();
        if( url != data.link_exps){
            await browser.close();//cierro navegador
            return { status: 400, message: "Error: Ha ocurrido un error en el login revise el Usuario y el Password", data: [] }
        }
        
        // Buscar Expediente
        try {
            await page.fill('input[id="diversosForm.numSiniestro"]', exp);
            await page.focus('#filter-encargos > div:nth-child(2) > div.row-component.row-cell.responsive-none > div > form > div > div > div > div.col-component.col-cell.col-offset-0.col-4.col-tablet-100.col-mobile-0.horizontal-left.vertical-bottom.scroll-default.ov-default.filter-encargos__col--right.espacio-b-1 > div > div > div.inline.margen-r-2 > button'); //Activar btn
            await page.click('#filter-encargos > div:nth-child(2) > div.row-component.row-cell.responsive-none > div > form > div > div > div > div.col-component.col-cell.col-offset-0.col-4.col-tablet-100.col-mobile-0.horizontal-left.vertical-bottom.scroll-default.ov-default.filter-encargos__col--right.espacio-b-1 > div > div > div.inline.margen-r-2 > button');
            await sleep(2000);
            await page.click('text='+ exp );
            await sleep(2000);
            await page.click('body > div.libty > div > div:nth-child(1) > main > section > ul > li:nth-child(7)');
            await sleep(2000);

            //Mapear mensajes
            let mensajes = await page.$$eval('#mensajes-area-lista-mensajes > div > div > div > div > div > ul > li > div > div > div > article > div > div.data__description > span', (spans) => spans.map((span) => span.textContent)),
            fechas = await page.$$eval('#mensajes-area-lista-mensajes > div > div > div > div > div > ul > li > div > div > div > article > div > div.data__date', (spans) => spans.map((span) => span.textContent)),
            autores = await page.$$eval('#mensajes-area-lista-mensajes > div > div > div > div > div > ul > li > div > div > div > article > div > div.data__author > span.txt-bold.inline.v-align-s', (spans) => spans.map((span) => span.textContent));
            
            await browser.close(); //cierro navegador
            
            let response_data = mensajes.map((mensaje, index) => {
                return {mensaje, autor: autores[index], fecha: fechas[index]}
            });

            return { status: 200, message: `${response_data.length} Mensaje(s) del expediente ${exp}`, data: response_data }

        } catch (error) {
            await browser.close();//cierro navegador
            return { status: 400, message: "No se pudo listar los mensajes del expediente", data: []  }
        }
    })();
}

async function SubirMensajes({data, user, pass, exp, text}){
    return (async () => {
        // inicio navegador
        const browser = await chromium.launch( { ignoreHTTPSErrors: true, headless: true } );    //abre el navegador con las propiedades descritas 
        const context = await browser.newContext(); // usa el modo incognito
        const page = await context.newPage();   //abre una nueva paguina del navegado

        // logueo completo
        await login(browser, page, data, user, pass);

        await sleep(6000);//demora de 2000ms
        let url = await page.url();
        if( url != data.link_exps){
            await browser.close();//cierro navegador
            return { status: 400, message: "Error: Ha ocurrido un error en el login revise el Usuario y el Password", data: [] }
        }
        
        // Buscar Expediente
        try {
            await page.fill('input[id="diversosForm.numSiniestro"]', exp);
            await page.focus('#filter-encargos > div:nth-child(2) > div.row-component.row-cell.responsive-none > div > form > div > div > div > div.col-component.col-cell.col-offset-0.col-4.col-tablet-100.col-mobile-0.horizontal-left.vertical-bottom.scroll-default.ov-default.filter-encargos__col--right.espacio-b-1 > div > div > div.inline.margen-r-2 > button'); //Activar btn
            await page.click('#filter-encargos > div:nth-child(2) > div.row-component.row-cell.responsive-none > div > form > div > div > div > div.col-component.col-cell.col-offset-0.col-4.col-tablet-100.col-mobile-0.horizontal-left.vertical-bottom.scroll-default.ov-default.filter-encargos__col--right.espacio-b-1 > div > div > div.inline.margen-r-2 > button');
            await sleep(2000);
            await page.click('text='+ exp );
            await sleep(2000);
            await page.click('body > div.libty > div > div:nth-child(1) > main > section > ul > li:nth-child(7)');
            await sleep(2000);
            await page.fill('textarea[id="nuevoMensajeForm.descripcion"]', text); 

            await page.click('#mensajes-area-nuevo-mensaje > div > div > div > div > form > div.row-component.row-cell.espacio-v-3.responsive-none > div > button.button-component.btn.btn-principal.margen-l-2');
            await sleep(2000);
            await browser.close(); //cierro navegador
            
            return { status: 200, message: `¡Mensaje enviado con éxito!`, data: []};

        } catch (error) {
            await browser.close();//cierro navegador
            return { status: 400, message: "No se pudo listar los mensajes del expediente", data: []  }
        }
    })();
}

module.exports = { listaExp, XMLexp, ListaMensajes, ListarMensajesExpediente, SubirMensajes};